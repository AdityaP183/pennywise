package com.pennywise.api.transactions.service;

import com.pennywise.api.auth.model.User;
import com.pennywise.api.auth.repository.UserRepository;
import com.pennywise.api.common.exception.ResourceNotFoundException;
import com.pennywise.api.common.model.SortDirection;
import com.pennywise.api.transactions.dto.request.CreateTransactionRequest;
import com.pennywise.api.transactions.dto.request.TransactionQuery;
import com.pennywise.api.transactions.dto.request.UpdateTransactionRequest;
import com.pennywise.api.transactions.dto.response.TransactionResponse;
import com.pennywise.api.transactions.model.Transaction;
import com.pennywise.api.transactions.model.TransactionSortBy;
import com.pennywise.api.transactions.repository.TransactionRepository;
import com.pennywise.api.transactions.repository.TransactionSpecification;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionServiceImpl(
            TransactionRepository transactionRepository,
            UserRepository userRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public TransactionResponse createTransaction(
            UUID userId,
            CreateTransactionRequest request
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        Transaction transaction = new Transaction();

        transaction.setUser(user);
        transaction.setAmount(request.amount());
        transaction.setType(request.type());
        transaction.setCategory(
                request.category() == null ||
                        request.category().isBlank()
                        ? "Other"
                        : request.category().trim()
        );
        transaction.setDescription(request.description());
        transaction.setTransactionDate(request.transactionDate());
        transaction.setCreatedAt(Instant.now());
        transaction.setUpdatedAt(Instant.now());

        Transaction savedTransaction =
                transactionRepository.save(transaction);

        return TransactionResponse.from(savedTransaction);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getAllTransactions(
            UUID userId,
            TransactionQuery query
    ) {
        Specification<Transaction> specification =
                TransactionSpecification.hasUserId(userId);

        if (query.type() != null) {
            specification = specification.and(
                    TransactionSpecification.hasType(
                            query.type()
                    )
            );
        }

        if (query.search() != null &&
                !query.search().isBlank()) {

            specification = specification.and(
                    TransactionSpecification.search(
                            query.search()
                    )
            );
        }

        Sort sort = createSort(query);

        return transactionRepository
                .findAll(specification, sort)
                .stream()
                .map(TransactionResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionResponse getTransaction(
            UUID userId,
            UUID transactionId
    ) {
        Transaction transaction = transactionRepository
                .findByIdAndUserId(transactionId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Transaction not found"
                        )
                );

        return TransactionResponse.from(transaction);
    }

    @Override
    @Transactional
    public TransactionResponse updateTransaction(
            UUID userId,
            UUID transactionId,
            UpdateTransactionRequest request
    ) {
        Transaction transaction = transactionRepository
                .findByIdAndUserId(transactionId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Transaction not found"
                        )
                );

        if (request.amount() != null) {
            transaction.setAmount(request.amount());
        }

        if (request.type() != null) {
            transaction.setType(request.type());
        }

        if (request.category() != null) {
            transaction.setCategory(request.category().trim());
        }

        if (request.description() != null) {
            transaction.setDescription(request.description().trim());
        }

        if (request.transactionDate() != null) {
            transaction.setTransactionDate(request.transactionDate());
        }

        Transaction updatedTransaction =
                transactionRepository.save(transaction);

        return TransactionResponse.from(updatedTransaction);
    }

    @Override
    @Transactional
    public void deleteTransaction(
            UUID userId,
            UUID transactionId
    ) {
        Transaction transaction = transactionRepository
                .findByIdAndUserId(transactionId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Transaction not found"
                        )
                );

        transactionRepository.delete(transaction);
    }

    private Sort createSort(TransactionQuery query) {
        TransactionSortBy sortBy =
                query.sortBy() != null
                        ? query.sortBy()
                        : TransactionSortBy.TRANSACTION_DATE;

        SortDirection direction =
                query.direction() != null
                        ? query.direction()
                        : SortDirection.DESC;

        String field = switch (sortBy) {
            case TRANSACTION_DATE ->
                    "transactionDate";
            case AMOUNT ->
                    "amount";
            case CREATED_AT ->
                    "createdAt";
            case UPDATED_AT ->
                    "updatedAt";
        };

        Sort.Direction sortDirection =
                direction == SortDirection.ASC
                        ? Sort.Direction.ASC
                        : Sort.Direction.DESC;

        return Sort.by(sortDirection, field);
    }
}
