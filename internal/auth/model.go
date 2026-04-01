package auth

import (
	"context"
	"database/sql"
	"errors"

	"github.com/Zurisaday01/FastTrack/internal/apperrors"
	"github.com/google/uuid"
)

type AuthModel struct {
	DB        *sql.DB
	appErrors *apperrors.AppErrors
}

// CreateUser creates a new user in the database with the provided registration input
// It returns the ID of the newly created user or an error if there was a problem creating the user
func (am *AuthModel) CreateUser(ctx context.Context, input RegisterInput) (uuid.UUID, error) {
	id := uuid.New()

	stmt := `INSERT INTO users (id, first_name, last_name, email, hashed_password) VALUES ($1, $2, $3, $4, $5)`
	_, err := am.DB.ExecContext(ctx, stmt, id, input.FirstName, input.LastName, input.Email, input.Password)
	if err != nil {
		return uuid.Nil, err
	}

	return id, nil
}

// GetUserByEmail retrieves a user from the database by their email address
// It returns the user if found, or an error if not found or if there was a problem querying the database
func (am *AuthModel) GetUserByEmail(ctx context.Context, email string) (User, error) {
	stmt := `SELECT id, first_name, last_name, email, hashed_password, created_at FROM users WHERE email = $1`

	var u User
	err := am.DB.QueryRowContext(ctx, stmt, email).Scan(&u.ID, &u.FirstName, &u.LastName, &u.Email, &u.HashedPassword, &u.CreatedAt)
	
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return User{}, apperrors.ErrRecordNotFound
		}
		return User{}, err
	}

	return u, nil
}

// EmailExists checks if a user with the given email already exists in the database
// It returns true if the email exists, false if it does not, and an error if there was a problem querying the database
func (am *AuthModel) EmailExists(ctx context.Context, email string) (bool, error) {
	var exists bool
	err := am.DB.QueryRowContext(ctx, `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`, email).Scan(&exists)

	return exists, err
}