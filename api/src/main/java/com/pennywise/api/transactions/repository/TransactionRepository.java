package com.pennywise.api.transactions.repository;

import com.pennywise.api.transactions.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository
        extends JpaRepository<Transaction, UUID>,
                JpaSpecificationExecutor<Transaction> {
    List<Transaction> findAllByUserId(UUID userId);

    Optional<Transaction> findByIdAndUserId(
            UUID id,
            UUID userId
    );
}