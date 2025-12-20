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

    public static EmailVerificationResponseDTO success(String message) {
        return new EmailVerificationResponseDTO(message, true);
    }

    public static EmailVerificationResponseDTO error(String message) {
        return new EmailVerificationResponseDTO(message, false);
    }
}
