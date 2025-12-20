package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.password.ForgotPasswordRequestDTO;
import com.uet.VolunteerHub.dto.password.PasswordResetResponseDTO;
import com.uet.VolunteerHub.dto.password.ResetPasswordRequestDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.repository.AccountRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class PasswordResetService {

    private static final String PASSWORD_RESET_TOKEN_PREFIX = "password_reset:";
    private static final String GENERIC_SUCCESS_MESSAGE =
            "If an account exists with this email, you will receive a password reset link shortly.";

    private final AccountRepository accountRepository;
    private final StringRedisTemplate redisTemplate;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    @Value("${app.password-reset.frontend-url}")
    private String frontendResetUrl;
    @Value("${app.password-reset.token-expiry-minutes}")
    private int tokenExpiryMinutes;

    @Autowired
    public PasswordResetService(
            AccountRepository accountRepository,
            StringRedisTemplate redisTemplate,
            EmailService emailService,
            PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.redisTemplate = redisTemplate;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public PasswordResetResponseDTO initiatePasswordReset(ForgotPasswordRequestDTO request) {
        String email = request.getEmail().toLowerCase().trim();
        Optional<Account> accountOptional = accountRepository.findByUsernameOrEmail(email, email);
        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();
            // Generate unique token
            String token = generateToken();
            String redisKey = PASSWORD_RESET_TOKEN_PREFIX + token;
            redisTemplate.opsForValue().set(
                    redisKey,
                    account.getAccountId().toString(),
                    Duration.ofMinutes(tokenExpiryMinutes)
            );
            String resetLink = frontendResetUrl + "?token=" + token;
            emailService.sendPasswordResetEmail(
                    account.getEmail(),
                    resetLink,
                    account.getUsername(),
                    tokenExpiryMinutes
            );
            log.info("Password reset initiated for email: {}", email);
        } else {
            log.debug("Password reset requested for non-existent email: {}", email);
        }
        return PasswordResetResponseDTO.success(GENERIC_SUCCESS_MESSAGE);
    }

    public PasswordResetResponseDTO validateToken(String token) {
        String redisKey = PASSWORD_RESET_TOKEN_PREFIX + token;
        String accountId = redisTemplate.opsForValue().get(redisKey);
        
        if (accountId == null) {
            return PasswordResetResponseDTO.error("Invalid or expired password reset token.");
        }
        
        return PasswordResetResponseDTO.success("Token is valid.");
    }

    @Transactional
    public PasswordResetResponseDTO resetPassword(ResetPasswordRequestDTO request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return PasswordResetResponseDTO.error("New password and confirmation password do not match.");
        }
        String token = request.getToken();
        String redisKey = PASSWORD_RESET_TOKEN_PREFIX + token;
        // Get account ID from Redis
        String accountIdStr = redisTemplate.opsForValue().get(redisKey);
        if (accountIdStr == null) {
            log.warn("Password reset attempted with invalid or expired token");
            return PasswordResetResponseDTO.error("Invalid or expired password reset token.");
        }
        try {
            UUID accountId = UUID.fromString(accountIdStr);
            Optional<Account> accountOptional = accountRepository.findById(accountId);
            if (accountOptional.isEmpty()) {
                log.error("Account not found for password reset. Account ID: {}", accountId);
                redisTemplate.delete(redisKey);
                return PasswordResetResponseDTO.error("Account not found.");
            }
            Account account = accountOptional.get();
            // Update password
            String encodedPassword = passwordEncoder.encode(request.getNewPassword());
            account.setPassword(encodedPassword);
            accountRepository.save(account);
            // Delete token immediately after use (single-use token)
            redisTemplate.delete(redisKey);
            // Send confirmation email
            emailService.sendPasswordResetConfirmationEmail(account.getEmail(), account.getUsername());
            log.info("Password reset successful for account: {}", account.getUsername());
            return PasswordResetResponseDTO.success("Password has been reset successfully. You can now login with your new password.");
        } catch (IllegalArgumentException e) {
            log.error("Invalid UUID format in Redis for password reset token: {}", accountIdStr);
            redisTemplate.delete(redisKey);
            return PasswordResetResponseDTO.error("Invalid or expired password reset token.");
        }
    }

    private String generateToken() {
        return UUID.randomUUID().toString();
    }
}
