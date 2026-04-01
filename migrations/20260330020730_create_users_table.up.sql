CREATE TABLE users (
    id              UUID PRIMARY KEY, -- Using UUID for unique user identification with Google UUID in Go
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    email           TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);