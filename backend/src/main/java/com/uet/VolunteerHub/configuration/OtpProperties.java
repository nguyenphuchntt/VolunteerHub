package com.uet.VolunteerHub.configuration;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;

@Data
@Validated
@Configuration
@ConfigurationProperties(prefix = "spring.mail.otp")
public class OtpProperties {

    // field name
    private VerificationConfig verification = new VerificationConfig();

    @NotBlank
    private String pepper;

    @Data
    public static class VerificationConfig {
        @Min(4)
        private int length = 6;

        @Min(1)
        private int expiryMinutes = 5;

        @Min(1)
        private int maxAttempts = 5;

        @Min(30)
        private int resendCooldownSeconds = 60;

        @Min(1)
        private int maxSendsPerHour = 5;

        public Duration getExpiry() {
            return Duration.ofMinutes(expiryMinutes);
        }

        public Duration getResendCooldown() {
            return Duration.ofSeconds(resendCooldownSeconds);
        }
    }
}
