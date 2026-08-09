package com.pennywise.api.user.controller;

import com.pennywise.api.auth.dto.response.UserResponse;
import com.pennywise.api.auth.model.User;
import com.pennywise.api.auth.repository.UserRepository;
import com.pennywise.api.common.exception.ResourceNotFoundException;
import com.pennywise.api.common.exception.UnauthorizedException;
import com.pennywise.api.common.response.ApiResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> me(
            Authentication authentication
    ) {
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID userId)) {
            throw new UnauthorizedException("Invalid authentication");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "User not found"
                        )
                );

        UserResponse response = new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );

        return ApiResponse.success(
                "User retrieved successfully",
                response
        );
    }
}
