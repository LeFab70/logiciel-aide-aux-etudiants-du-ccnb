package com.ccnb.app.auth;

import com.ccnb.app.user.User;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final long refreshTokenTtlDays;
    private final SecureRandom secureRandom = new SecureRandom();

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            @Value("${ccnb.jwt.refresh-token-ttl-days}") long refreshTokenTtlDays) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshTokenTtlDays = refreshTokenTtlDays;
    }

    public String issue(User user) {
        String rawToken = generateRawToken();
        RefreshToken entity = new RefreshToken();
        entity.setUser(user);
        entity.setTokenHash(hash(rawToken));
        entity.setExpiresAt(Instant.now().plus(refreshTokenTtlDays, ChronoUnit.DAYS));
        refreshTokenRepository.save(entity);
        return rawToken;
    }

    /**
     * Validates the raw refresh token, revokes it, and returns the associated user.
     * Callers are expected to issue a fresh refresh token immediately after (rotation),
     * so a stolen, already-used token cannot be replayed.
     */
    public User verifyAndConsume(String rawToken) {
        RefreshToken entity = refreshTokenRepository
                .findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new BadCredentialsException("Refresh token invalide"));
        if (entity.isRevoked() || entity.getExpiresAt().isBefore(Instant.now())) {
            throw new BadCredentialsException("Refresh token invalide");
        }
        entity.setRevoked(true);
        refreshTokenRepository.save(entity);
        return entity.getUser();
    }

    private String generateRawToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
