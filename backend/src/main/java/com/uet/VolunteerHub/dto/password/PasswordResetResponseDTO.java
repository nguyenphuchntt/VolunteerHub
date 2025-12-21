package com.uet.VolunteerHub.dto.password;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for password reset response.
 * Returns a generic message to avoid email enumeration attacks.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetResponseDTO {
    
    private String message;
    private boolean success;

    public static PasswordResetResponseDTO success(String message) {
        return new PasswordResetResponseDTO(message, true);
    }

    public static PasswordResetResponseDTO error(String message) {
        return new PasswordResetResponseDTO(message, false);
    }
}
