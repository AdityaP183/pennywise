package com.pennywise.api.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @Size(max = 50)
        String firstName,

        @Size(max = 50)
        String lastName
) {}