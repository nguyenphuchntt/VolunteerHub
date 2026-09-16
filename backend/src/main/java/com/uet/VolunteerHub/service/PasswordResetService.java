package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.configuration.OtpProperties;
import com.uet.VolunteerHub.dto.password.ForgotPasswordRequestDTO;
import com.uet.VolunteerHub.dto.password.PasswordResetResponseDTO;
import com.uet.VolunteerHub.dto.password.VerifyPasswordResetOtpDTO;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

/**
 * Password reset via OTP. Reuses the same verification infrastructure as email verification.
 */
@Slf4j
@Service
public class PasswordResetService {

    private static final String PASSWORD_RESET_TEMPLATE = "password-reset-email-otp";
    private static final String PASSWORD_RESET_SUBJECT = "Password Reset Request";
    private static final String GENERIC_SUCCESS_MESSAGE =
            "If an account exists with this email, you will receive a password reset code shortly.";

    private final AccountRepository accountRepository;
    private final VerificationCodeStore codeStore;
    private final OtpGenerator otpGenerator;
    private final OtpProperties otpProperties;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public PasswordResetService(
            AccountRepository accountRepository,
            VerificationCodeStore codeStore,
            OtpGenerator otpGenerator,
            OtpProperties otpProperties,
            EmailService emailService,
            PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.codeStore = codeStore;
        this.otpGenerator = otpGenerator;
        this.otpProperties = otpProperties;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Initiates password reset by generating OTP and sending email.
     * Returns generic message to prevent email enumeration attacks.
     */
    public PasswordResetResponseDTO initiatePasswordReset(ForgotPasswordRequestDTO request) {
        String email = normalize(request.getEmail());
        Optional<Account> accountOptional = accountRepository.findByUsernameOrEmail(email, email);

        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();
            if (account.getAccountStatus() != AccountStatus.ACTIVE) {
                if (account.getAccountStatus() == AccountStatus.INACTIVE) {
                    log.debug("Password reset requested for inactive account: {}. User should verify email first.", email);
                } else if (account.getAccountStatus() == AccountStatus.BANNED) {
                    log.debug("Password reset requested for banned account: {}", email);
                }
                return PasswordResetResponseDTO.success(GENERIC_SUCCESS_MESSAGE);
            }
            try {
                issueAndSendOtp(account);
                log.info("Password reset OTP initiated for email: {}", email);
            } catch (OtpException e) {
                log.warn("Failed to send password reset OTP for {}: {}", email, e.getMessage());
            }
        } else {
            log.debug("Password reset requested for non-existent email: {}", email);
        }
        return PasswordResetResponseDTO.success(GENERIC_SUCCESS_MESSAGE);
    }

    /**
     * Resets user password using valid OTP (single-use).
     * Deletes OTP after use and sends confirmation email.
     */
    @Transactional
    public PasswordResetResponseDTO resetPassword(VerifyPasswordResetOtpDTO request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return PasswordResetResponseDTO.error("New password and confirmation password do not match.");
        }

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

        VerificationCodeEntry entry = codeStore.find(OtpScope.PASSWORD_RESET, email)
                .orElseThrow(() -> new OtpException(OtpErrorCode.OTP_EXPIRED, HttpStatus.BAD_REQUEST,
                        "Invalid or expired password reset code. Please request a new one."));

        int maxAttempts = otpProperties.getVerification().getMaxAttempts();
        if (entry.attempts() >= maxAttempts) {
            codeStore.delete(OtpScope.PASSWORD_RESET, email);
            throw new OtpException(OtpErrorCode.OTP_LOCKED, HttpStatus.BAD_REQUEST,
                    "Too many incorrect attempts. Please request a new code.");
        }

        if (!otpGenerator.matches(request.getOtp(), entry.codeHash())) {
            codeStore.incrementAttempts(OtpScope.PASSWORD_RESET, email);
            int remaining = maxAttempts - entry.attempts() - 1;
            throw new OtpException(OtpErrorCode.OTP_INVALID, HttpStatus.BAD_REQUEST,
                    "Incorrect password reset code.", remaining);
        }

        // Update password
        String encodedPassword = passwordEncoder.encode(request.getNewPassword());
        account.setPassword(encodedPassword);
        accountRepository.save(account);

        // Delete OTP immediately after use (single-use)
        codeStore.delete(OtpScope.PASSWORD_RESET, email);

        // Send confirmation email
        emailService.sendPasswordResetConfirmationEmail(account.getEmail(), account.getUsername());

        log.info("Password reset successful for account: {}", account.getUsername());
        return PasswordResetResponseDTO.success(
                "Password has been reset successfully. You can now login with your new password.");
    }

    private void issueAndSendOtp(Account account) {
        String email = normalize(account.getEmail());
        OtpProperties.VerificationConfig config = otpProperties.getVerification();

        if (!codeStore.tryAcquireCooldown(OtpScope.PASSWORD_RESET, email, config.getResendCooldown())) {
            throw new OtpException(OtpErrorCode.OTP_COOLDOWN, HttpStatus.TOO_MANY_REQUESTS,
                    "Please wait " + config.getResendCooldownSeconds()
                            + " seconds before requesting a new code.");
        }

        long sendCount = codeStore.incrementSendCount(
                OtpScope.PASSWORD_RESET, email, Duration.ofHours(1));
        if (sendCount > config.getMaxSendsPerHour()) {
            throw new OtpException(OtpErrorCode.OTP_QUOTA_EXCEEDED, HttpStatus.TOO_MANY_REQUESTS,
                    "Too many password reset codes requested. Please try again later.");
        }

        String otp = otpGenerator.generate(config.getLength());
        codeStore.save(OtpScope.PASSWORD_RESET, email,
                new VerificationCodeEntry(otpGenerator.hash(otp), 0, Instant.now()),
                config.getExpiry());

        emailService.sendOtp(account.getEmail(), otp, account.getUsername(),
                config.getExpiryMinutes(), PASSWORD_RESET_TEMPLATE, PASSWORD_RESET_SUBJECT);
        log.info("Password reset OTP issued for account: {}", account.getUsername());
    }

    private String normalize(String email) {
        return email == null ? "" : email.toLowerCase().trim();
    }
}
