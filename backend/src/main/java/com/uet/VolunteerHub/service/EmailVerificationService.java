package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.email.EmailVerificationResponseDTO;
import com.uet.VolunteerHub.dto.email.ResendVerificationRequestDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.repository.AccountRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class EmailVerificationService {

    private static final String EMAIL_VERIFICATION_TOKEN_PREFIX = "email_verify:";
    private static final String GENERIC_SUCCESS_MESSAGE = 
            "If an account exists with this email and requires verification, you will receive a verification link shortly.";
    private final AccountRepository accountRepository;
    private final StringRedisTemplate redisTemplate;
    private final EmailService emailService;
    @Value("${app.email-verification.frontend-url:http://localhost:5173/verify-email}")
    private String frontendVerifyUrl;
    @Value("${app.email-verification.token-expiry-minutes:30}")
    private int tokenExpiryMinutes;

    @Autowired
    public EmailVerificationService(
            AccountRepository accountRepository,
            StringRedisTemplate redisTemplate,
            EmailService emailService) {
        this.accountRepository = accountRepository;
        this.redisTemplate = redisTemplate;
        this.emailService = emailService;
    }

    public void sendVerificationEmail(Account account) {
        String token = generateToken();
        String redisKey = EMAIL_VERIFICATION_TOKEN_PREFIX + token;
        redisTemplate.opsForValue().set(
                redisKey,
                account.getAccountId().toString(),
                Duration.ofMinutes(tokenExpiryMinutes)
        );
        String verifyLink = frontendVerifyUrl + "?token=" + token;
        emailService.sendVerificationEmail(
                account.getEmail(),
                verifyLink,
                account.getUsername(),
                tokenExpiryMinutes  // Pass minutes, template will handle display
        );
        log.info("Verification email sent for account: {}", account.getUsername());
    }

    public EmailVerificationResponseDTO resendVerificationEmail(ResendVerificationRequestDTO request) {
        String email = request.getEmail().toLowerCase().trim();
        Optional<Account> accountOptional = accountRepository.findByUsernameOrEmail(email, email);
        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();
            // Only resend for INACTIVE accounts
            if (account.getAccountStatus() == AccountStatus.INACTIVE) {
                sendVerificationEmail(account);
                log.info("Verification email resent for: {}", email);
            } else if (account.getAccountStatus() == AccountStatus.ACTIVE) {
                log.debug("Resend verification requested for already active account: {}", email);
            } else {
                log.debug("Resend verification requested for banned account: {}", email);
            }
        } else {
            log.debug("Resend verification requested for non-existent email: {}", email);
        }
        
        // Always return same message to prevent email enumeration
        return EmailVerificationResponseDTO.success(GENERIC_SUCCESS_MESSAGE);
    }

    @Transactional
    public EmailVerificationResponseDTO verifyEmail(String token) {
        String redisKey = EMAIL_VERIFICATION_TOKEN_PREFIX + token;
        String accountIdStr = redisTemplate.opsForValue().get(redisKey);
        if (accountIdStr == null) {
            log.warn("Email verification attempted with invalid or expired token");
            return EmailVerificationResponseDTO.error("Invalid or expired verification link. Please request a new one.");
        }
        try {
            UUID accountId = UUID.fromString(accountIdStr);
            Optional<Account> accountOptional = accountRepository.findById(accountId);
            if (accountOptional.isEmpty()) {
                log.error("Account not found for email verification. Account ID: {}", accountId);
                redisTemplate.delete(redisKey);
                return EmailVerificationResponseDTO.error("Account not found.");
            }
            Account account = accountOptional.get();
            if (account.getAccountStatus() == AccountStatus.ACTIVE) {
                redisTemplate.delete(redisKey);
                return EmailVerificationResponseDTO.success("Your email is already verified. You can login now.");
            }
            if (account.getAccountStatus() == AccountStatus.BANNED) {
                redisTemplate.delete(redisKey);
                return EmailVerificationResponseDTO.error("Your account has been banned. Please contact support.");
            }
            account.setAccountStatus(AccountStatus.ACTIVE);
            accountRepository.save(account);
            redisTemplate.delete(redisKey);
            log.info("Email verified successfully for account: {}", account.getUsername());
            return EmailVerificationResponseDTO.success("Email verified successfully! You can now login to your account.");
            
        } catch (IllegalArgumentException e) {
            log.error("Invalid UUID format in Redis for verification token: {}", accountIdStr);
            redisTemplate.delete(redisKey);
            return EmailVerificationResponseDTO.error("Invalid or expired verification link.");
        }
    }

    public EmailVerificationResponseDTO validateToken(String token) {
        String redisKey = EMAIL_VERIFICATION_TOKEN_PREFIX + token;
        String accountId = redisTemplate.opsForValue().get(redisKey);
        if (accountId == null) {
            return EmailVerificationResponseDTO.error("Invalid or expired verification link.");
        }
        return EmailVerificationResponseDTO.success("Token is valid.");
    }

    private String generateToken() {
        return UUID.randomUUID().toString();
    }
}
