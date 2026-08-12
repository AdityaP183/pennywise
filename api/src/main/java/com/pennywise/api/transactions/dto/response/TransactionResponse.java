package com.pennywise.api.transactions.dto.response;

import com.pennywise.api.transactions.model.Transaction;
import com.pennywise.api.transactions.model.TransactionType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TransactionResponse(
        UUID id,
        BigDecimal amount,
        TransactionType type,
        String category,
        String description,
        Instant transactionDate,
        Instant createdAt,
        Instant updatedAt
) {
    public static TransactionResponse from(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getCategory(),
                transaction.getDescription(),
                transaction.getTransactionDate(),
                transaction.getCreatedAt(),
                transaction.getUpdatedAt()
        );
    }
}