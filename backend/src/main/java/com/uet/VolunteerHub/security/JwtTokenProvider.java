package com.uet.VolunteerHub.security;

import com.uet.VolunteerHub.entity.Account;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;

@Component
@Validated
@ConfigurationProperties(prefix = "spring.security.jwt")
public class JwtTokenProvider {

    @NotBlank
    private String secret;

    @Positive
    private long accessTokenExpirationTime;

    @Positive
    private long refreshTokenExpirationTime;

    private SecretKey signingKey;

    @PostConstruct
    void initialize() {
        try {
            byte[] keyBytes = Base64.getDecoder().decode(secret);
            signingKey = Keys.hmacShaKeyFor(keyBytes);
        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException(
                    "spring.security.jwt.secret must be a valid Base64-encoded HS512 key", exception);
        }
    }

    public String generateAccessToken(Authentication authentication) {
        return generateToken(authentication, accessTokenExpirationTime, "access");
    }

    public String generateRefreshToken(Authentication authentication) {
        return generateToken(authentication, refreshTokenExpirationTime, "refresh");
    }

    private String generateToken(Authentication authentication, long expirationTime, String tokenType) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Account account)
                || account.getAccountId() == null) {
            throw new IllegalArgumentException("Authentication must contain an account with an ID");
        }

        Instant issuedAt = Instant.now();
        Instant expiresAt;
        try {
            expiresAt = issuedAt.plusMillis(expirationTime);
        } catch (ArithmeticException exception) {
            throw new IllegalStateException("JWT expiration time is out of range", exception);
        }

        return Jwts.builder()
                .subject(account.getAccountId().toString())
                .claim("type", tokenType)
                .issuedAt(Date.from(issuedAt))
                .expiration(Date.from(expiresAt))
                .signWith(signingKey, Jwts.SIG.HS512)
                .compact();
    }

    public Claims parseJwtToken(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("JWT token must not be blank");
        }

        Jws<Claims> claims = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token);
        return claims.getPayload();
    }
}
