package com.pennywise.api.transactions.dto.response;

import com.pennywise.api.transactions.model.TransactionRange;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record TransactionSummaryResponse(
        TransactionRange range,
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal net,
        List<TransactionSummaryPoint> data
) {
    public record TransactionSummaryPoint(
            Instant period,
            BigDecimal income,
            BigDecimal expense,
            BigDecimal amount
    ) {
    }
}