package com.pennywise.api.auth.dto.response;

public record LoginResult(
        UserResponse user,
        String accessToken,
        String refreshToken
) {}