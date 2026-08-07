package com.pennywise.api.auth.service;

import com.pennywise.api.auth.dto.request.RegisterRequest;
import com.pennywise.api.auth.dto.response.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest request);
}
