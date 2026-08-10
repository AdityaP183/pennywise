package com.pennywise.api.auth.service;

import com.pennywise.api.auth.dto.request.ChangePasswordRequest;
import com.pennywise.api.auth.dto.request.LoginRequest;
import com.pennywise.api.auth.dto.request.RegisterRequest;
import com.pennywise.api.auth.dto.response.LoginResult;
import com.pennywise.api.auth.dto.response.UserResponse;

import java.util.UUID;

public interface AuthService {
    UserResponse register(RegisterRequest request);

    LoginResult login(LoginRequest request);

    String refresh(String refreshToken);

    void logout(String refreshToken);

    void changePassword(UUID userId, ChangePasswordRequest request);
}
