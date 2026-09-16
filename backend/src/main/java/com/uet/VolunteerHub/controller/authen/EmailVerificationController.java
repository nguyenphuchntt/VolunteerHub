package com.uet.VolunteerHub.controller.authen;

import com.uet.VolunteerHub.dto.email.EmailVerificationResponseDTO;
import com.uet.VolunteerHub.dto.email.ResendOtpRequestDTO;
import com.uet.VolunteerHub.dto.email.VerifyOtpRequestDTO;
import com.uet.VolunteerHub.service.OtpVerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/email")
public class EmailVerificationController {

    private final OtpVerificationService otpVerificationService;

    public EmailVerificationController(OtpVerificationService otpVerificationService) {
        this.otpVerificationService = otpVerificationService;
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<EmailVerificationResponseDTO> verifyOtp(
            @Valid @RequestBody VerifyOtpRequestDTO request) {
        return ResponseEntity.ok(otpVerificationService.verifyOtp(request));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<EmailVerificationResponseDTO> resendOtp(
            @Valid @RequestBody ResendOtpRequestDTO request) {
        return ResponseEntity.ok(otpVerificationService.resendVerificationOtp(request));
    }
}
