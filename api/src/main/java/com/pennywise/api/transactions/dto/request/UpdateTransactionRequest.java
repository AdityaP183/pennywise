package com.pennywise.api.transactions.dto.request;

import com.pennywise.api.transactions.model.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Instant;

public record UpdateTransactionRequest(
        @DecimalMin(
                value = "0.01",
                message = "Amount must be greater than 0"
        )
        BigDecimal amount,

        TransactionType type,

        @Size(
                max = 100,
                message = "Category must not exceed 100 characters"
        )
        String category,

        @Size(
                max = 500,
                message = "Description must not exceed 500 characters"
        )
        String description,

        Instant transactionDate
) {}