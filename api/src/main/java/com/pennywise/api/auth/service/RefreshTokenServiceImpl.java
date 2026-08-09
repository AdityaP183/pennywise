package com.pennywise.api.auth.service;

import com.pennywise.api.auth.model.RefreshToken;
import com.pennywise.api.auth.model.User;
import com.pennywise.api.auth.repository.RefreshTokenRepository;
import com.pennywise.api.common.exception.UnauthorizedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final Duration refreshTokenExpiration;

    public RefreshTokenServiceImpl(
            RefreshTokenRepository refreshTokenRepository,
            @Value("${app.jwt.refresh-token-expiration}")
            Duration refreshTokenExpiration
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    @Override
    public String create(User user) {

        String rawToken = UUID.randomUUID() + "-" + UUID.randomUUID();

        Instant now = Instant.now();

        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setId(UUID.randomUUID());
        refreshToken.setUserId(user.getId());
        refreshToken.setTokenHash(hash(rawToken));
        refreshToken.setExpiresAt(
                now.plus(refreshTokenExpiration)
        );
        refreshToken.setCreatedAt(now);
        refreshToken.setUpdatedAt(now);

        refreshTokenRepository.save(refreshToken);

        return rawToken;
    }

    @Override
    public RefreshToken validate(String token) {

        RefreshToken refreshToken =
                refreshTokenRepository
                        .findByTokenHash(hash(token))
                        .orElseThrow(() ->
                                new UnauthorizedException(
                                        "Invalid refresh token"
                                )
                        );

        if (refreshToken.getRevokedAt() != null) {
            throw new UnauthorizedException(
                    "Refresh token has been revoked"
            );
        }

        if (refreshToken.getExpiresAt().isBefore(Instant.now())) {
            throw new UnauthorizedException(
                    "Refresh token has expired"
            );
        }

        return refreshToken;
    }

    @Override
    public void revoke(RefreshToken refreshToken) {

        Instant now = Instant.now();

        refreshToken.setRevokedAt(now);
        refreshToken.setUpdatedAt(now);

        refreshTokenRepository.save(refreshToken);
    }

    private String hash(String token) {

        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            return Base64.getEncoder().encodeToString(hash);

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(
                    "SHA-256 algorithm is not available",
                    e
            );
        }
    }
}
