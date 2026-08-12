package com.pennywise.api.transactions.dto.request;

import com.pennywise.api.common.model.SortDirection;
import com.pennywise.api.transactions.model.TransactionSortBy;
import com.pennywise.api.transactions.model.TransactionType;

public record TransactionQuery(
        String search,
        TransactionSortBy sortBy,
        SortDirection direction,
        TransactionType type
) {}