package com.pennywise.api.user.controller;

import com.pennywise.api.auth.dto.response.UserResponse;
import com.pennywise.api.auth.model.User;
import com.pennywise.api.auth.repository.UserRepository;
import com.pennywise.api.common.exception.ResourceNotFoundException;
import com.pennywise.api.common.exception.UnauthorizedException;
import com.pennywise.api.common.response.ApiResponse;
import com.pennywise.api.user.dto.request.UpdateUserRequest;
import com.pennywise.api.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;
    private final UserService userService;

    public UserController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
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

    @PatchMapping("/me")
    public ApiResponse<UserResponse> updateMe(
            @Valid @RequestBody UpdateUserRequest request,
            Authentication authentication
    ) {
        if (!(authentication.getPrincipal() instanceof UUID userId)) {
            throw new UnauthorizedException("Invalid authentication");
        }

        UserResponse response =
                userService.updateUser(userId, request);

        return ApiResponse.success(
                "User updated successfully",
                response
        );
    }
}
