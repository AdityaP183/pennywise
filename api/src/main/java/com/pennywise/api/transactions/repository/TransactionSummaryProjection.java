package com.pennywise.api.transactions.repository;

import java.math.BigDecimal;
import java.time.Instant;

public interface TransactionSummaryProjection {
    Instant getPeriod();

    BigDecimal getIncome();

    BigDecimal getExpense();

    BigDecimal getAmount();
}