package com.pennywise.api.auth.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class AuthCookie {
    private final Duration accessTokenExpiration;
    private final Duration refreshTokenExpiration;
    private final boolean secure;

    public AuthCookie(
            @Value("${app.jwt.access-token-expiration}")
            Duration accessTokenExpiration,

            @Value("${app.jwt.refresh-token-expiration}")
            Duration refreshTokenExpiration,

            @Value("${app.cookie.secure}")
            boolean secure
    ) {
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
        this.secure = secure;
    }

    public ResponseCookie accessToken(String token) {
        return ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(secure)
                .sameSite("Lax")
                .path("/")
                .maxAge(accessTokenExpiration)
                .build();
    }

    public ResponseCookie refreshToken(String token) {
        return ResponseCookie.from("refresh_token", token)
                .httpOnly(true)
                .secure(secure)
                .sameSite("Lax")
                .path("/api/v1/auth")
                .maxAge(refreshTokenExpiration)
                .build();
    }

    public ResponseCookie clearAccessToken() {
        return ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(secure)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ZERO)
                .build();
    }

    public ResponseCookie clearRefreshToken() {
        return ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(secure)
                .sameSite("Lax")
                .path("/api/v1/auth")
                .maxAge(Duration.ZERO)
                .build();
    }
}
