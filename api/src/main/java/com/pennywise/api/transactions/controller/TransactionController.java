package com.pennywise.api.transactions.controller;

import com.pennywise.api.common.exception.UnauthorizedException;
import com.pennywise.api.common.model.SortDirection;
import com.pennywise.api.common.response.ApiResponse;
import com.pennywise.api.transactions.dto.request.CreateTransactionRequest;
import com.pennywise.api.transactions.dto.request.TransactionQuery;
import com.pennywise.api.transactions.dto.request.UpdateTransactionRequest;
import com.pennywise.api.transactions.dto.response.TransactionResponse;
import com.pennywise.api.transactions.model.TransactionSortBy;
import com.pennywise.api.transactions.model.TransactionType;
import com.pennywise.api.transactions.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ApiResponse<TransactionResponse> createTransaction(
            @Valid @RequestBody CreateTransactionRequest request,
            Authentication authentication
    ) {
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID userId)) {
            throw new UnauthorizedException(
                    "Invalid authentication"
            );
        }

        TransactionResponse transaction =
                transactionService.createTransaction(
                        userId,
                        request
                );

        return ApiResponse.success(
                "Transaction created successfully",
                transaction
        );
    }

    @GetMapping
    public ApiResponse<List<TransactionResponse>> getAllTransactions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) TransactionSortBy sortBy,
            @RequestParam(required = false) SortDirection direction,
            @RequestParam(required = false) TransactionType type,
            Authentication authentication
    ) {
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID userId)) {
            throw new UnauthorizedException(
                    "Invalid authentication"
            );
        }

        TransactionQuery query = new TransactionQuery(
                search,
                sortBy,
                direction,
                type
        );

        List<TransactionResponse> response =
                transactionService.getAllTransactions(userId, query);

        return ApiResponse.success(
                "Transactions retrieved successfully",
                response
        );
    }

    @GetMapping("/{transactionId}")
    public ApiResponse<TransactionResponse> getTransaction(
            @PathVariable UUID transactionId,
            Authentication authentication
    ) {
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID userId)) {
            throw new UnauthorizedException(
                    "Invalid authentication"
            );
        }

        TransactionResponse response =
                transactionService.getTransaction(
                        userId,
                        transactionId
                );

        return ApiResponse.success(
                "Transaction retrieved successfully",
                response
        );
    }

    @PatchMapping("/{transactionId}")
    public ApiResponse<TransactionResponse> updateTransaction(
            @PathVariable UUID transactionId,
            @Valid @RequestBody UpdateTransactionRequest request,
            Authentication authentication
    ) {
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID userId)) {
            throw new UnauthorizedException(
                    "Invalid authentication"
            );
        }

        TransactionResponse response =
                transactionService.updateTransaction(
                        userId,
                        transactionId,
                        request
                );

        return ApiResponse.success(
                "Transaction updated successfully",
                response
        );
    }

    @DeleteMapping("/{transactionId}")
    public ApiResponse<Void> deleteTransaction(
            @PathVariable UUID transactionId,
            Authentication authentication
    ) {
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID userId)) {
            throw new UnauthorizedException(
                    "Invalid authentication"
            );
        }

        transactionService.deleteTransaction(
                userId,
                transactionId
        );

        return ApiResponse.success(
                "Transaction deleted successfully",
                null
        );
    }
}
