package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.configuration.OtpProperties;
import com.uet.VolunteerHub.dto.email.EmailVerificationResponseDTO;
import com.uet.VolunteerHub.dto.email.ResendOtpRequestDTO;
import com.uet.VolunteerHub.dto.email.VerifyOtpRequestDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.enums.OtpErrorCode;
import com.uet.VolunteerHub.exception.OtpException;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.service.otp.OtpGenerator;
import com.uet.VolunteerHub.service.otp.OtpScope;
import com.uet.VolunteerHub.service.otp.VerificationCodeEntry;
import com.uet.VolunteerHub.service.otp.VerificationCodeStore;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;

@Slf4j
@Service
public class OtpVerificationService {

    private static final String VERIFICATION_TEMPLATE = "email-verification";
    private static final String VERIFICATION_SUBJECT = "Verify Your Email Address";

    private final AccountRepository accountRepository;
    private final VerificationCodeStore codeStore;
    private final OtpGenerator otpGenerator;
    private final OtpProperties otpProperties;
    private final EmailService emailService;

    public OtpVerificationService(
            AccountRepository accountRepository,
            VerificationCodeStore codeStore,
            OtpGenerator otpGenerator,
            OtpProperties otpProperties,
            EmailService emailService) {
        this.accountRepository = accountRepository;
        this.codeStore = codeStore;
        this.otpGenerator = otpGenerator;
        this.otpProperties = otpProperties;
        this.emailService = emailService;
    }

    /**
     * Issues a new verification OTP for a freshly registered account and emails it.
     * Called from the registration flow; failures here must not abort registration.
     */
    public void sendVerificationOtp(Account account) {
        try {
            issueAndSendOtp(account);
        } catch (OtpException e) {
            log.warn("Skipped initial verification OTP for {}: {}", account.getEmail(), e.getMessage());
        }
    }

    /**
     * Resends a verification OTP. Enforces cooldown and hourly quota constraints.
     */
    public EmailVerificationResponseDTO resendVerificationOtp(ResendOtpRequestDTO request) {
        String email = normalize(request.getEmail());
        Account account = accountRepository.findByUsernameOrEmail(email, email)
                .orElseThrow(() -> new OtpException(
                        OtpErrorCode.ACCOUNT_NOT_FOUND,
                        HttpStatus.NOT_FOUND,
                        "No account found with this email address"));

        if (account.getAccountStatus() == AccountStatus.ACTIVE) {
            return EmailVerificationResponseDTO.success("Your email is already verified");
        }
        issueAndSendOtp(account);
        return EmailVerificationResponseDTO.success("Verification code has been sent to your email");
    }

    /**
     * Verifies an OTP and activates the account on success.
     */
    @Transactional
    public EmailVerificationResponseDTO verifyOtp(VerifyOtpRequestDTO request) {
        String email = normalize(request.getEmail());
        Account account = accountRepository.findByUsernameOrEmail(email, email)
                .orElseThrow(() -> new OtpException(
                        OtpErrorCode.ACCOUNT_NOT_FOUND,
                        HttpStatus.NOT_FOUND,
                        "No account found with this email address"));

        if (account.getAccountStatus() == AccountStatus.BANNED) {
            throw new OtpException(OtpErrorCode.ACCOUNT_BANNED, HttpStatus.FORBIDDEN,
                    "Your account has been banned. Please contact support.");
        }
        if (account.getAccountStatus() == AccountStatus.ACTIVE) {
            codeStore.delete(OtpScope.EMAIL_VERIFY, email);
            return EmailVerificationResponseDTO.success("Your email is already verified. You can login now.");
        }

        VerificationCodeEntry entry = codeStore.find(OtpScope.EMAIL_VERIFY, email)
                .orElseThrow(() -> new OtpException(OtpErrorCode.OTP_EXPIRED, HttpStatus.BAD_REQUEST,
                        "Invalid or expired verification code. Please request a new one."));

        int maxAttempts = otpProperties.getVerification().getMaxAttempts();
        if (entry.attempts() >= maxAttempts) {
            codeStore.delete(OtpScope.EMAIL_VERIFY, email);
            throw new OtpException(OtpErrorCode.OTP_LOCKED, HttpStatus.BAD_REQUEST,
                    "Too many incorrect attempts. Please request a new code.");
        }

        if (!otpGenerator.matches(request.getOtp(), entry.codeHash())) {
            codeStore.incrementAttempts(OtpScope.EMAIL_VERIFY, email);
            int remaining = maxAttempts - entry.attempts() - 1;
            throw new OtpException(OtpErrorCode.OTP_INVALID, HttpStatus.BAD_REQUEST,
                    "Incorrect verification code.", remaining);
        }

        account.setAccountStatus(AccountStatus.ACTIVE);
        accountRepository.save(account);
        codeStore.delete(OtpScope.EMAIL_VERIFY, email);
        log.info("Email verified successfully for account: {}", account.getUsername());
        return EmailVerificationResponseDTO.success(
                "Email verified successfully! You can now login to your account.");
    }

    private void issueAndSendOtp(Account account) {
        String email = normalize(account.getEmail());
        OtpProperties.VerificationConfig config = otpProperties.getVerification();

        if (!codeStore.tryAcquireCooldown(OtpScope.EMAIL_VERIFY, email, config.getResendCooldown())) {
            throw new OtpException(OtpErrorCode.OTP_COOLDOWN, HttpStatus.TOO_MANY_REQUESTS,
                    "Please wait " + config.getResendCooldownSeconds()
                            + " seconds before requesting a new code.");
        }

        long sendCount = codeStore.incrementSendCount(
                OtpScope.EMAIL_VERIFY, email, Duration.ofHours(1));
        if (sendCount > config.getMaxSendsPerHour()) {
            throw new OtpException(OtpErrorCode.OTP_QUOTA_EXCEEDED, HttpStatus.TOO_MANY_REQUESTS,
                    "Too many verification codes requested. Please try again later.");
        }

        String otp = otpGenerator.generate(config.getLength());
        codeStore.save(OtpScope.EMAIL_VERIFY, email,
                new VerificationCodeEntry(otpGenerator.hash(otp), 0, Instant.now()),
                config.getExpiry());

        emailService.sendOtp(account.getEmail(), otp, account.getUsername(),
                config.getExpiryMinutes(), VERIFICATION_TEMPLATE, VERIFICATION_SUBJECT);
        log.info("Verification OTP issued for account: {}", account.getUsername());
    }

    private String normalize(String email) {
        return email == null ? "" : email.toLowerCase().trim();
    }
}
