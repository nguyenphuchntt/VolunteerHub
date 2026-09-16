package com.uet.VolunteerHub.controller.authen;

import com.uet.VolunteerHub.dto.Account.LoginDTO;
import com.uet.VolunteerHub.dto.JWT.RefreshTokenRequest;
import com.uet.VolunteerHub.dto.JWT.TokenResponse;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.service.AuthenticationService;
import com.uet.VolunteerHub.service.RefreshTokenService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final RefreshTokenService refreshTokenService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(
            AuthenticationService authenticationService,
            RefreshTokenService refreshTokenService) {
        this.authenticationService = authenticationService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO loginDTO) {
        authenticationService.login(loginDTO);
        return ResponseEntity.ok(toResponse(refreshTokenService.issue(
                (Account) SecurityContextHolder.getContext()
                        .getAuthentication().getPrincipal()
        )));
    }

    @PostMapping("/refresh")
    public TokenResponse refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return toResponse(refreshTokenService.rotate(request.refreshToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshTokenRequest request) {
        refreshTokenService.revoke(request.refreshToken());
        return ResponseEntity.noContent().build();
    }

    private TokenResponse toResponse(RefreshTokenService.IssuedTokens tokens) {
        return new TokenResponse(tokens.accessToken(), tokens.refreshToken(), "Bearer", tokens.accessTokenExpiresIn());
    }
}
