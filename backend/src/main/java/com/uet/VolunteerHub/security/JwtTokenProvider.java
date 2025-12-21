package com.uet.VolunteerHub.security;

import io.jsonwebtoken.*;
import com.uet.VolunteerHub.entity.Account;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

/**
 * Utility class for JWT token operations
 */
@Component
@Slf4j
public class JwtTokenProvider {

    private final String JWT_SECRET = "2c32590fba6982b958933173c2044eae";

    private final Long JWT_TOKEN_EXPIRATION_TIME = 604800000L;

    /**
     * Generates JWT token from authentication
     * @param authentication user authentication
     * @return JWT token string
     */
    public String generateJwtToken(Authentication authentication) {
        Account account = (Account) authentication.getPrincipal();
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + JWT_TOKEN_EXPIRATION_TIME);
        return Jwts.builder()
                .setSubject(account.getAccountId().toString())
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
                .compact();
    }

    /**
     * Parses and validates JWT token
     * @param token JWT token string
     * @return claims from token
     */
    public Claims parseJwtToken(String token) {
        return Jwts.parser().setSigningKey(JWT_SECRET).parseClaimsJws(token).getBody();
    }

}
