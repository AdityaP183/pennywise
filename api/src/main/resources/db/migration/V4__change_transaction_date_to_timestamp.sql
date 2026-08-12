ALTER TABLE transactions
    ALTER COLUMN transaction_date
        TYPE TIMESTAMP WITH TIME ZONE
        USING transaction_date::TIMESTAMP WITH TIME ZONE;