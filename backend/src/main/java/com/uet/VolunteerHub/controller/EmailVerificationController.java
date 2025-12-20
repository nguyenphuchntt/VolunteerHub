package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.email.EmailVerificationResponseDTO;
import com.uet.VolunteerHub.dto.email.ResendVerificationRequestDTO;
import com.uet.VolunteerHub.service.EmailVerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/email")
@Tag(name = "Email Verification", description = "APIs for email verification functionality")
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;

    @Autowired
    public EmailVerificationController(EmailVerificationService emailVerificationService) {
        this.emailVerificationService = emailVerificationService;
    }

    @GetMapping("/verify")
    @Operation(
            summary = "Verify email address",
            description = "Verifies user email and activates the account"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Email verified successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired token")
    })
    public ResponseEntity<EmailVerificationResponseDTO> verifyEmail(
            @RequestParam("token") String token) {
        EmailVerificationResponseDTO response = emailVerificationService.verifyEmail(token);
        
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate-token")
    @Operation(
            summary = "Validate verification token",
            description = "Checks if the verification token is valid and not expired"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token validation result returned"),
            @ApiResponse(responseCode = "400", description = "Token not provided or invalid")
    })
    public ResponseEntity<EmailVerificationResponseDTO> validateToken(
            @RequestParam("token") String token) {
        EmailVerificationResponseDTO response = emailVerificationService.validateToken(token);
        
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resend")
    @Operation(
            summary = "Resend verification email",
            description = "Resends the verification email to user's email address"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Request processed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid email format")
    })
    public ResponseEntity<EmailVerificationResponseDTO> resendVerificationEmail(
            @Valid @RequestBody ResendVerificationRequestDTO request) {
        EmailVerificationResponseDTO response = emailVerificationService.resendVerificationEmail(request);
        return ResponseEntity.ok(response);
    }
}
