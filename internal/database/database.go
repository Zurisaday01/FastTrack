package database

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/Zurisaday01/FastTrack/internal/config"
	_ "github.com/lib/pq" // PostgreSQL driver
)

// The OpenDB() function wraps sql.Open() and returns a sql.DB connection pool for a given DSN.
func OpenDB(conf *config.Config) (*sql.DB, error) {
	// Create the Postgres DSN from the config.
	dsn := conf.DatabaseUrl()

	db, err := sql.Open("postgres", dsn)

	// If there is an error opening the connection, return a nil sql.DB pool
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Verify that everything is set up correctly by pinging the database.

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

	defer cancel()

	err = db.PingContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	// If everything is okay, return the sql.DB connection pool.
	return db, nil
}