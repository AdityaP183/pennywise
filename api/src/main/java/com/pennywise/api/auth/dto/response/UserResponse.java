package com.pennywise.api.auth.dto.response;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        Instant createdAt,
        Instant updatedAt
) {}