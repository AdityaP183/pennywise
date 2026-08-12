package com.pennywise.api.transactions.service;

import com.pennywise.api.transactions.dto.request.CreateTransactionRequest;
import com.pennywise.api.transactions.dto.request.TransactionQuery;
import com.pennywise.api.transactions.dto.request.UpdateTransactionRequest;
import com.pennywise.api.transactions.dto.response.TransactionResponse;

import java.util.List;
import java.util.UUID;

public interface TransactionService {
    TransactionResponse createTransaction(
            UUID userId,
            CreateTransactionRequest request
    );

    List<TransactionResponse> getAllTransactions(
            UUID userId,
            TransactionQuery query
    );

    TransactionResponse getTransaction(
            UUID userId,
            UUID transactionId
    );

    TransactionResponse updateTransaction(
            UUID userId,
            UUID transactionId,
            UpdateTransactionRequest request
    );

    void deleteTransaction(
            UUID userId,
            UUID transactionId
    );
}