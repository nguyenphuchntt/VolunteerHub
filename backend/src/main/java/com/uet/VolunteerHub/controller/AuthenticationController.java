package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.LoginDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public AuthenticationController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO loginDTO) {
        Authentication authenticationRequest =
                UsernamePasswordAuthenticationToken.unauthenticated(loginDTO.getUsernameOrEmail(), loginDTO.getPassword());
        Authentication authentication = authenticationManager.authenticate(authenticationRequest);
        
        if (authentication.getPrincipal() instanceof Account account) {
            if (account.getAccountStatus() == AccountStatus.BANNED) {
                throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Your account has been banned"
                );
            } else if (account.getAccountStatus() == AccountStatus.INACTIVE) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Your account should be activated before login"
                );
            }
        }
        String jwtToken = jwtTokenProvider.generateJwtToken(authentication);
        return ResponseEntity.ok(new JwtResponse(jwtToken));
    }

    private static class JwtResponse {
        private String token;
        private String type = "Bearer";

        public JwtResponse(String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }

        public String getType() {
            return type;
        }
    }

}
