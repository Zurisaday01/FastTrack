package auth

import (
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"strings"

	"github.com/Zurisaday01/FastTrack/internal/apperrors"
	"github.com/Zurisaday01/FastTrack/internal/helpers"
)

type Handler struct {
	service   Service
	appErrors *apperrors.AppErrors
}

func NewHandler(service Service, appErrors *apperrors.AppErrors) *Handler {
	return &Handler{service: service, appErrors: appErrors}
}

func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var input RegisterRequest

	// Decode JSON body with strict field checking
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	err := decoder.Decode(&input)
	if err != nil {
		h.appErrors.BadRequest(w, err)
		return
	}

	// Clean inputs
	firstName := strings.TrimSpace(input.FirstName)
	lastName := strings.TrimSpace(input.LastName)
	email := strings.TrimSpace(input.Email)
	password := strings.TrimSpace(input.Password)

	// Validate inputs
	if firstName == "" {
		h.appErrors.BadRequest(w, errors.New("first name is required"))
		return
	}

	if lastName == "" {
		h.appErrors.BadRequest(w, errors.New("last name is required"))
		return
	}

	if email == "" {
		h.appErrors.BadRequest(w, errors.New("email is required"))
		return
	}
	if password == "" {
		h.appErrors.BadRequest(w, errors.New("password is required"))
		return
	}
	if err := helpers.ValidatePassword(password); err != nil {
		h.appErrors.BadRequest(w, err)
		return
	}

	id, err := h.service.Register(ctx, RegisterInput{
		FirstName: firstName,
		LastName:  lastName,
		Email: strings.ToLower(email),
		Password: password,
	})

	if err != nil {
		if errors.Is(err, apperrors.ErrEmailAlreadyExists) {
			h.appErrors.Conflict(w, "email already in use")
			return
		}
		h.appErrors.ServerError(w, r, err)
		return
	}

	// Return created user info (excluding password)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(UserResponse{
		ID:        id,
		FirstName: firstName,
		LastName:  lastName,
		Email:     strings.ToLower(email),
	})
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var input LoginInput

	// Decode JSON body with strict field checking
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	// Decode
	err := decoder.Decode(&input)
	if err != nil {
		h.appErrors.BadRequest(w, err)
		return
	}

	// Clean inputs
	email := strings.TrimSpace(strings.ToLower(input.Email))
	password := strings.TrimSpace(input.Password)

	// Validate inputs
	if email == "" {
		h.appErrors.BadRequest(w, errors.New("email is required"))
		return
	}

	if password == "" {
		h.appErrors.BadRequest(w, errors.New("password is required"))
		return
	}

	tokens, err := h.service.Login(ctx, LoginInput{
		Email: email, 
		Password: password,
	})

	if err != nil {
		if errors.Is(err, apperrors.ErrInvalidCredentials) {
			h.appErrors.Unauthorized(w, "invalid email or password")
			return
		}
		h.appErrors.ServerError(w, r, err)
		return
	}

	// Set tokens in cookies
	helpers.SetAuthCookies(w, tokens)

	// Return email to the user
	json.NewEncoder(w).Encode(UserResponse{
		Email: strings.ToLower(email),
	})
}

func (h *Handler) Refresh(w http.ResponseWriter, r *http.Request) {
	// Read refresh token from cookie instead of body
	cookie, err := r.Cookie("refreshToken")
	if err != nil {
		h.appErrors.BadRequest(w, errors.New("refresh token is required"))
		return
	}

	tokens, err := h.service.RefreshTokens(cookie.Value)
	if err != nil {
		if errors.Is(err, apperrors.ErrInvalidToken) {
			h.appErrors.Unauthorized(w, "invalid or expired refresh token")
			return
		}
		h.appErrors.ServerError(w, r, err)
		return
	}

	// Set tokens in cookies
	helpers.SetAuthCookies(w, tokens)

	// Return status OK along with the tokens that are set in cookies by default
	w.WriteHeader(http.StatusOK)
}


func (h *Handler) Me(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
    // Get cookie
    cookie, err := r.Cookie("accessToken")
    if err != nil {
        h.appErrors.Unauthorized(w, "not authenticated")
        return
    }

    // Validate token
    claims, err := helpers.ParseToken(cookie.Value, os.Getenv("JWT_SECRET"))
    if err != nil {
        h.appErrors.Unauthorized(w, "invalid or expired token")
        return
    }

	// Fetch user from the db to retrieve profile info (excluding password)
	user, err := h.service.GetUserById(ctx, claims.UserID)

	// If there is an error and it's not a "record not found" error, return it
	if err != nil {
		h.appErrors.ServerError(w, r, err)
		return
	}

    // Return user info (using db data)
    json.NewEncoder(w).Encode(UserResponse{
        ID:    user.ID,
        Email: user.Email,
		FirstName: user.FirstName,
		LastName: user.LastName,
    })
}

func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	// Clear auth cookies
	helpers.ClearAuthCookies(w)

	w.WriteHeader(http.StatusOK)
}