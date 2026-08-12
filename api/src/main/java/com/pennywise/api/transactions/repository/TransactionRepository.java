package com.pennywise.api.transactions.repository;

import com.pennywise.api.transactions.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository
        extends JpaRepository<Transaction, UUID>,
        JpaSpecificationExecutor<Transaction> {
    Optional<Transaction> findByIdAndUserId(
            UUID id,
            UUID userId
    );

    @Query(value = """
            SELECT
                date_trunc('day', t.transaction_date) AS period,
                COALESCE(
                    SUM(
                        CASE
                            WHEN t.type = 'INCOME'
                            THEN t.amount
                            ELSE 0
                        END
                    ),
                    0
                ) AS income,
                COALESCE(
                    SUM(
                        CASE
                            WHEN t.type = 'EXPENSE'
                            THEN -t.amount
                            ELSE 0
                        END
                    ),
                    0
                ) AS expense,
                COALESCE(
                    SUM(
                        CASE
                            WHEN t.type = 'INCOME'
                            THEN t.amount
                            ELSE -t.amount
                        END
                    ),
                    0
                ) AS amount
            FROM transactions t
            WHERE t.user_id = :userId
              AND t.transaction_date >= :start
              AND t.transaction_date < :end
            GROUP BY date_trunc('day', t.transaction_date)
            ORDER BY period
            """,
            nativeQuery = true)
    List<TransactionSummaryProjection> getDailySummary(
            @Param("userId") UUID userId,
            @Param("start") Instant start,
            @Param("end") Instant end
    );

    @Query(value = """
            SELECT
                date_trunc('month', t.transaction_date) AS period,
                COALESCE(
                    SUM(
                        CASE
                            WHEN t.type = 'INCOME'
                            THEN t.amount
                            ELSE 0
                        END
                    ),
                    0
                ) AS income,
                COALESCE(
                    SUM(
                        CASE
                            WHEN t.type = 'EXPENSE'
                            THEN -t.amount
                            ELSE 0
                        END
                    ),
                    0
                ) AS expense,
                COALESCE(
                    SUM(
                        CASE
                            WHEN t.type = 'INCOME'
                            THEN t.amount
                            ELSE -t.amount
                        END
                    ),
                    0
                ) AS amount
            FROM transactions t
            WHERE t.user_id = :userId
              AND t.transaction_date >= :start
              AND t.transaction_date < :end
            GROUP BY date_trunc('month', t.transaction_date)
            ORDER BY period
            """,
            nativeQuery = true)
    List<TransactionSummaryProjection> getMonthlySummary(
            @Param("userId") UUID userId,
            @Param("start") Instant start,
            @Param("end") Instant end
    );
}