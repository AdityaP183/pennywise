CREATE TABLE transactions
(
    id               UUID PRIMARY KEY                  DEFAULT gen_random_uuid(),

    user_id          UUID                     NOT NULL,

    amount           NUMERIC(15, 2)           NOT NULL,
    type             VARCHAR(20)              NOT NULL,
    category         VARCHAR(100),
    description      VARCHAR(500),

    transaction_date DATE                     NOT NULL,

    created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transactions_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT chk_transactions_amount
        CHECK (amount > 0),

    CONSTRAINT chk_transactions_type
        CHECK (type IN ('INCOME', 'EXPENSE'))
);

CREATE INDEX idx_transactions_user_id
    ON transactions (user_id);

CREATE INDEX idx_transactions_user_date
    ON transactions (user_id, transaction_date);