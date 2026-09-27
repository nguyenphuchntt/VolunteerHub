package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.RefreshToken;
import com.uet.VolunteerHub.repository.RefreshTokenRepository;
import com.uet.VolunteerHub.security.JwtTokenProvider;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final SecureRandom secureRandom = new SecureRandom();

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository,
                               JwtTokenProvider jwtTokenProvider) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public IssuedTokens issue(Account account) {
        String refreshToken = generateOpaqueToken();
        Instant expiresAt = Instant.now().plusMillis(jwtTokenProvider.getRefreshTokenExpirationTime());

        RefreshToken entity = new RefreshToken();
        entity.setAccount(account);
        entity.setTokenHash(hash(refreshToken));
        entity.setExpiresAt(expiresAt);
        refreshTokenRepository.save(entity);

        return new IssuedTokens(
                jwtTokenProvider.generateAccessToken(account),
                refreshToken,
                jwtTokenProvider.getAccessTokenExpirationTime());
    }

    @Transactional
    public IssuedTokens rotate(String rawRefreshToken) {
        RefreshToken storedToken = findActive(rawRefreshToken);
        Account account = storedToken.getAccount();
        storedToken.setRevokedAt(Instant.now());
        refreshTokenRepository.save(storedToken);
        return issue(account);
    }

    @Transactional
    public void revoke(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            return;
        }
        refreshTokenRepository.findByTokenHash(hash(rawRefreshToken)).ifPresent(token -> {
            if (token.getRevokedAt() == null) {
                token.setRevokedAt(Instant.now());
                refreshTokenRepository.save(token);
            }
        });
    }

    // find valid refresh token in db
    private RefreshToken findActive(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw invalidRefreshToken();
        }

        RefreshToken token = refreshTokenRepository.findByTokenHashAndRevokedAtIsNull(hash(rawRefreshToken))
                .orElseThrow(this::invalidRefreshToken);
        if (token.getExpiresAt() == null || !token.getExpiresAt().isAfter(Instant.now())
                || token.getAccount() == null || !token.getAccount().isEnabled()) {
            throw invalidRefreshToken();
        }
        return token;
    }

    private String generateOpaqueToken() {
        byte[] bytes = new byte[64];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available", exception);
        }
    }

    private ResponseStatusException invalidRefreshToken() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
    }

    public record IssuedTokens(String accessToken, String refreshToken, long accessTokenExpiresIn) {
    }
}
