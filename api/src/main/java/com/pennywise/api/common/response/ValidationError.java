package com.pennywise.api.common.response;

public record ValidationError(
        String field,
        String message
) {
}
