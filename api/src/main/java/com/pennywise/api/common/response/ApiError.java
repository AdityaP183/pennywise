package com.pennywise.api.common.response;


import java.util.List;

public record ApiError(
        boolean success,
        String message,
        List<ValidationError> errors
) {

    public static ApiError of(String message) {
        return new ApiError(false, message, List.of());
    }

    public static ApiError of(String message, List<ValidationError> errors) {
        return new ApiError(false, message, errors);
    }
}