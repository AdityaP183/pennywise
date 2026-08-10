package com.pennywise.api.user.service;

import com.pennywise.api.auth.dto.response.UserResponse;
import com.pennywise.api.auth.model.User;
import com.pennywise.api.auth.repository.UserRepository;
import com.pennywise.api.common.exception.BadRequestException;
import com.pennywise.api.common.exception.ResourceNotFoundException;
import com.pennywise.api.user.dto.request.UpdateUserRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponse updateUser(
            UUID userId,
            UpdateUserRequest request
    ) {
        if ((request.firstName() == null || request.firstName().isBlank())
                && (request.lastName() == null || request.lastName().isBlank())) {

            throw new BadRequestException(
                    "At least one of firstName or lastName must be provided"
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        String firstName = request.firstName() != null
                ? request.firstName()
                : user.getFirstName();

        String lastName = request.lastName() != null
                ? request.lastName()
                : user.getLastName();

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setUpdatedAt(Instant.now());

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getEmail(),
                savedUser.getCreatedAt(),
                savedUser.getUpdatedAt()
        );
    }
}
