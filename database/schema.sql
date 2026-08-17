-- =========================================================
-- SmartSpend Database Schema
-- =========================================================

CREATE DATABASE IF NOT EXISTS smartspend;

USE smartspend;


-- =========================================================
-- 1. USERS
-- =========================================================

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'USER',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_user_role
        CHECK (role IN ('USER', 'ADMIN'))
);


-- =========================================================
-- 2. CATEGORIES
-- =========================================================

CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    name VARCHAR(50) NOT NULL,

    type VARCHAR(20) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_category_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_category_type
        CHECK (type IN ('INCOME', 'EXPENSE')),

    CONSTRAINT uq_user_category
        UNIQUE (user_id, name, type)
);


-- =========================================================
-- 3. TRANSACTIONS
-- =========================================================

CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    category_id BIGINT NOT NULL,

    type VARCHAR(20) NOT NULL,

    amount DECIMAL(12,2) NOT NULL,

    description VARCHAR(255),

    transaction_date DATE NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_transaction_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_transaction_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_transaction_type
        CHECK (type IN ('INCOME', 'EXPENSE')),

    CONSTRAINT chk_transaction_amount
        CHECK (amount > 0)
);


-- =========================================================
-- 4. BUDGETS
-- =========================================================

CREATE TABLE budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    category_id BIGINT NOT NULL,

    amount DECIMAL(12,2) NOT NULL,

    period VARCHAR(20) NOT NULL,

    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_budget_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_budget_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_budget_amount
        CHECK (amount > 0),

    CONSTRAINT chk_budget_period
        CHECK (period IN ('WEEKLY', 'MONTHLY', 'YEARLY')),

    CONSTRAINT chk_budget_dates
        CHECK (end_date >= start_date)
);


-- =========================================================
-- 5. SAVINGS GOALS
-- =========================================================

CREATE TABLE savings_goals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    name VARCHAR(100) NOT NULL,

    target_amount DECIMAL(12,2) NOT NULL,

    current_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    target_date DATE,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_savings_goal_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_target_amount
        CHECK (target_amount > 0),

    CONSTRAINT chk_current_amount
        CHECK (current_amount >= 0),

    CONSTRAINT chk_savings_status
        CHECK (status IN ('ACTIVE', 'COMPLETED', 'PAUSED'))
);


-- =========================================================
-- 6. RECURRING TRANSACTIONS
-- =========================================================

CREATE TABLE recurring_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    category_id BIGINT NOT NULL,

    type VARCHAR(20) NOT NULL,

    amount DECIMAL(12,2) NOT NULL,

    description VARCHAR(255),

    frequency VARCHAR(20) NOT NULL,

    start_date DATE NOT NULL,

    end_date DATE,

    next_execution_date DATE NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_recurring_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_recurring_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_recurring_type
        CHECK (type IN ('INCOME', 'EXPENSE')),

    CONSTRAINT chk_recurring_amount
        CHECK (amount > 0),

    CONSTRAINT chk_recurring_frequency
        CHECK (frequency IN ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY')),

    CONSTRAINT chk_recurring_status
        CHECK (status IN ('ACTIVE', 'PAUSED'))
);


-- =========================================================
-- 7. NOTIFICATIONS
-- =========================================================

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    title VARCHAR(150) NOT NULL,

    message VARCHAR(500) NOT NULL,

    type VARCHAR(30) NOT NULL,

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =========================================================
-- 8. AI INSIGHTS
-- =========================================================

CREATE TABLE ai_insights (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    insight_type VARCHAR(50) NOT NULL,

    content TEXT NOT NULL,

    generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ai_insight_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_transactions_user
    ON transactions(user_id);

CREATE INDEX idx_transactions_category
    ON transactions(category_id);

CREATE INDEX idx_transactions_date
    ON transactions(transaction_date);

CREATE INDEX idx_transactions_user_date
    ON transactions(user_id, transaction_date);

CREATE INDEX idx_budgets_user
    ON budgets(user_id);

CREATE INDEX idx_budgets_category
    ON budgets(category_id);

CREATE INDEX idx_notifications_user
    ON notifications(user_id);

CREATE INDEX idx_notifications_user_read
    ON notifications(user_id, is_read);

CREATE INDEX idx_ai_insights_user
    ON ai_insights(user_id);