package com.pennywise.api.transactions.repository;

import com.pennywise.api.transactions.model.Transaction;
import com.pennywise.api.transactions.model.TransactionType;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public final class TransactionSpecification {
    private TransactionSpecification() {}

    public static Specification<Transaction> hasUserId(
            UUID userId
    ) {
        return (root, query, cb) ->
                cb.equal(
                        root.get("user").get("id"),
                        userId
                );
    }

    public static Specification<Transaction> hasType(
            TransactionType type
    ) {
        return (root, query, cb) ->
                cb.equal(
                        root.get("type"),
                        type
                );
    }

    public static Specification<Transaction> search(
            String search
    ) {
        return (root, query, cb) -> {

            String pattern = "%" +
                    search.toLowerCase().trim() +
                    "%";

            return cb.or(
                    cb.like(
                            cb.lower(root.get("category")),
                            pattern
                    ),
                    cb.like(
                            cb.lower(root.get("description")),
                            pattern
                    )
            );
        };
    }
}