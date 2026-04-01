package auth

import (
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/Zurisaday01/FastTrack/internal/apperrors"
	"github.com/Zurisaday01/FastTrack/internal/helpers"
	"github.com/google/uuid"
)

// Reassigning types from helpers/security for cleaner imports in handlers
type TokenPair = helpers.TokenPair
type Claims    = helpers.Claims


type Service interface {
	Register(ctx context.Context, input RegisterInput) (uuid.UUID, error)
	Login(ctx context.Context, input LoginInput) (TokenPair, error)
	ValidateToken(tokenStr string) (*Claims, error)
	RefreshTokens(refreshToken string) (TokenPair, error)
}

type svc struct {
	model *AuthModel
}

func NewService(model *AuthModel) Service {
	return &svc{model: model}
}

func (s *svc) Register(ctx context.Context, input RegisterInput) (uuid.UUID, error) {
	exists, err := s.model.EmailExists(ctx, input.Email)
	if err != nil {
		return uuid.Nil, err
	}
	if exists {
		return uuid.Nil, apperrors.ErrEmailAlreadyExists
	}

	// Hash password with Argon2 before storing
	hashedPassword, err := helpers.HashPassword(input.Password)
	if err != nil {
		return uuid.Nil, err
	}
	input.Password = hashedPassword

	return s.model.CreateUser(ctx, input)
}

func (s *svc) Login(ctx context.Context, input LoginInput) (TokenPair, error) {
	user, err := s.model.GetUserByEmail(ctx, input.Email)
	if err != nil {
		if errors.Is(err, apperrors.ErrRecordNotFound) {
			return TokenPair{}, apperrors.ErrInvalidCredentials
		}
		return TokenPair{}, err
	}

	// Replace bcrypt with Argon2 verification
	match, err := helpers.VerifyPassword(input.Password, user.HashedPassword)
	fmt.Println("match:", match, "err:", err) 
	if err != nil || !match {
		return TokenPair{}, apperrors.ErrInvalidCredentials
	}

	return helpers.GenerateTokenPair(user.ID, user.Email)
}

func (s *svc) ValidateToken(tokenStr string) (*Claims, error) {
	return helpers.ParseToken(tokenStr, os.Getenv("JWT_SECRET"))
}

func (s *svc) RefreshTokens(refreshToken string) (TokenPair, error) {
	claims, err := helpers.ParseToken(refreshToken, os.Getenv("JWT_REFRESH_SECRET"))
	if err != nil {
		return TokenPair{}, apperrors.ErrInvalidToken
	}

	return helpers.GenerateTokenPair(claims.UserID, claims.Email)
}