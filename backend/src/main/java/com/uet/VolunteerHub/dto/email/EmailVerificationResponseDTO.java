package com.uet.VolunteerHub.dto.email;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for email verification response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailVerificationResponseDTO {

    private String message;
    private boolean success;
    private String code;
    private Integer remainingAttempts;
    private Long resendCooldownSeconds;

    public static EmailVerificationResponseDTO success(String message) {
        return new EmailVerificationResponseDTO(message, true, null, null, null);
    }

    public static EmailVerificationResponseDTO error(String message) {
        return new EmailVerificationResponseDTO(message, false, null, null, null);
    }

    public static EmailVerificationResponseDTO error(String code, String message) {
        return new EmailVerificationResponseDTO(message, false, code, null, null);
    }

    public static EmailVerificationResponseDTO error(String code, String message, Integer remainingAttempts) {
        return new EmailVerificationResponseDTO(message, false, code, remainingAttempts, null);
    }

    public static EmailVerificationResponseDTO cooldown(String message, long resendCooldownSeconds) {
        return new EmailVerificationResponseDTO(message, false, "OTP_COOLDOWN", null, resendCooldownSeconds);
    }
}
