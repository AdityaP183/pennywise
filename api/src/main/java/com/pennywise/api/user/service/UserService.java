package com.pennywise.api.user.service;

import com.pennywise.api.auth.dto.response.UserResponse;
import com.pennywise.api.user.dto.request.UpdateUserRequest;

import java.util.UUID;

public interface UserService {
    UserResponse updateUser(
            UUID userId,
            UpdateUserRequest request
    );
}
