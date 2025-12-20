package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.password.ForgotPasswordRequestDTO;
import com.uet.VolunteerHub.dto.password.PasswordResetResponseDTO;
import com.uet.VolunteerHub.dto.password.ResetPasswordRequestDTO;
import com.uet.VolunteerHub.service.PasswordResetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/password")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @Autowired
    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/forgot")
    @Operation(
            summary = "Request password reset",
            description = "Initiates password reset process by sending an email with reset link"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Request processed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid email format")
    })
    public ResponseEntity<PasswordResetResponseDTO> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequestDTO request) {
        PasswordResetResponseDTO response = passwordResetService.initiatePasswordReset(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate-token")
    @Operation(
            summary = "Validate password reset token",
            description = "Checks if the password reset token is valid and not expired"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token validation result returned"),
            @ApiResponse(responseCode = "400", description = "Token not provided")
    })
    public ResponseEntity<PasswordResetResponseDTO> validateToken(
            @RequestParam("token") String token) {
        PasswordResetResponseDTO response = passwordResetService.validateToken(token);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset")
    @Operation(
            summary = "Reset password",
            description = "Resets user password using the token from email"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password reset successful"),
            @ApiResponse(responseCode = "400", description = "Invalid token or password mismatch")
    })
    public ResponseEntity<PasswordResetResponseDTO> resetPassword(
            @Valid @RequestBody ResetPasswordRequestDTO request) {
        PasswordResetResponseDTO response = passwordResetService.resetPassword(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
