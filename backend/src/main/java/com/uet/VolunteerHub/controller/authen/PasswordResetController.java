package com.uet.VolunteerHub.controller.authen;

import com.uet.VolunteerHub.dto.password.ForgotPasswordRequestDTO;
import com.uet.VolunteerHub.dto.password.PasswordResetResponseDTO;
import com.uet.VolunteerHub.dto.password.VerifyPasswordResetOtpDTO;
import com.uet.VolunteerHub.service.PasswordResetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/password")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/forgot")
    public ResponseEntity<PasswordResetResponseDTO> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequestDTO request) {
        return ResponseEntity.ok(passwordResetService.initiatePasswordReset(request));
    }

    @PostMapping("/reset")
    public ResponseEntity<PasswordResetResponseDTO> resetPassword(
            @Valid @RequestBody VerifyPasswordResetOtpDTO request) {
        return ResponseEntity.ok(passwordResetService.resetPassword(request));
    }
}
