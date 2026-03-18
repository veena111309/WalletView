-- schema.sql — Wallet View

CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT    NOT NULL UNIQUE,
    password_hash TEXT    NOT NULL,
    income        REAL    DEFAULT 0,
    created_at    TEXT    DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS expenses (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name    TEXT    NOT NULL,
    amount  REAL    NOT NULL,
    month   TEXT    NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS investments (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name    TEXT    NOT NULL,
    amount  REAL    NOT NULL,
    month   TEXT    NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS accounts (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id   INTEGER NOT NULL,
    bank      TEXT    NOT NULL,
    last4     TEXT    NOT NULL,
    expiry    TEXT,
    balance   REAL    DEFAULT 0,
    hand_cash REAL    DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);