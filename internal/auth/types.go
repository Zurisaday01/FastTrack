package auth

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID           	uuid.UUID `json:"id"`
	FirstName   	string    `json:"firstName"`
	LastName    	string    `json:"lastName"`
	Email        	string    `json:"email"`
	HashedPassword 	string    `json:"-"`
	CreatedAt    	time.Time `json:"createdAt"`
}

type UserResponse struct {
	ID        uuid.UUID `json:"id"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Email     string    `json:"email"`
}

type RegisterRequest struct {
	FirstName	string `json:"firstName"`
	LastName 	string `json:"lastName"`
	Email   	string `json:"email"`
	Password	string `json:"password"`
}

type LoginRequest struct {
	Email   	string `json:"email"`
}

type RefreshRequest struct {
	RefreshToken 	string `json:"refreshToken"`
}

type RegisterInput struct {
	FirstName	string
	LastName 	string
	Email		string
	Password	string
}

type LoginInput struct {
	Email		string
	Password	string
}