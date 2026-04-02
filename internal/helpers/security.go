package helpers

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"
	"unicode"

	"github.com/Zurisaday01/FastTrack/internal/apperrors"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/argon2"
)

type TokenPair struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

type Claims struct {
	UserID uuid.UUID `json:"userId"`
	Email  string    `json:"email"`
	jwt.RegisteredClaims
}

// Argon2Params holds the parameters for Argon2
type Argon2Params struct {
    Memory      uint32
    Iterations  uint32
    Parallelism uint8
    SaltLength  uint32
    KeyLength   uint32
}

// DefaultArgon2Params returns recommended parameters
func DefaultArgon2Params() *Argon2Params {
    return &Argon2Params{
        Memory:      64 * 1024,  // 64 MB
        Iterations:  3,           // 3 iterations
        Parallelism: 2,           // 2 threads
        SaltLength:  16,          // 16 bytes
        KeyLength:   32,          // 32 bytes
    }
}

// HashPassword hashes a password using Argon2
func HashPassword(password string) (string, error) {
    params := DefaultArgon2Params()
    
    // Generate random salt
    salt := make([]byte, params.SaltLength)
    if _, err := rand.Read(salt); err != nil {
        return "", err
    }
    
    // Hash the password
    hash := argon2.IDKey(
        []byte(password),
        salt,
        params.Iterations,
        params.Memory,
        params.Parallelism,
        params.KeyLength,
    )
    
    // Encode to base64 for storage
    // Format: $argon2id$v=19$m=65536,t=3,p=2$salt$hash
    encodedHash := fmt.Sprintf(
        "$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
        argon2.Version,
        params.Memory,
        params.Iterations,
        params.Parallelism,
        base64.RawStdEncoding.EncodeToString(salt),
        base64.RawStdEncoding.EncodeToString(hash),
    )
    
    return encodedHash, nil
}

// VerifyPassword checks if a password matches the hash
func VerifyPassword(password, encodedHash string) (bool, error) {
    // Extract parameters and hash from encoded string
    params, salt, hash, err := DecodeHash(encodedHash)
    if err != nil {
        return false, err
    }
    
    // Hash the password with the same parameters
    newHash := argon2.IDKey(
        []byte(password),
        salt,
        params.Iterations,
        params.Memory,
        params.Parallelism,
        params.KeyLength,
    )
    
    // Compare hashes with constant time comparison to prevent timing attacks
    return subtle.ConstantTimeCompare(hash, newHash) == 1, nil
}

// decodeHash extracts parameters, salt, and hash from encoded string
func DecodeHash(encodedHash string) (*Argon2Params, []byte, []byte, error) {
    // Format: $argon2id$v=19$m=65536,t=3,p=2$salt$hash
    parts := strings.Split(encodedHash, "$")
    if len(parts) != 6 {
        return nil, nil, nil, fmt.Errorf("invalid hash format")
    }
    
    var version int
    _, err := fmt.Sscanf(parts[2], "v=%d", &version)
    if err != nil {
        return nil, nil, nil, err
    }
    if version != argon2.Version {
        return nil, nil, nil, fmt.Errorf("incompatible argon2 version")
    }
    
    params := &Argon2Params{}
    _, err = fmt.Sscanf(parts[3], "m=%d,t=%d,p=%d", 
        &params.Memory, &params.Iterations, &params.Parallelism)
    if err != nil {
        return nil, nil, nil, err
    }
    
    salt, err := base64.RawStdEncoding.DecodeString(parts[4])
    if err != nil {
        return nil, nil, nil, err
    }
    params.SaltLength = uint32(len(salt))
    
    hash, err := base64.RawStdEncoding.DecodeString(parts[5])
    if err != nil {
        return nil, nil, nil, err
    }
    params.KeyLength = uint32(len(hash))
    
    return params, salt, hash, nil
}


// GenerateTokenPair creates both access and refresh tokens
func GenerateTokenPair(userID uuid.UUID, email string) (TokenPair, error) {
	accessToken, err := SignToken(userID, email, os.Getenv("JWT_SECRET"), 15*time.Minute)
	if err != nil {
		return TokenPair{}, err
	}

	refreshToken, err := SignToken(userID, email, os.Getenv("JWT_REFRESH_SECRET"), 7*24*time.Hour)
	if err != nil {
		return TokenPair{}, err
	}

	return TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

// SignToken creates a signed JWT token with the given parameters
func SignToken(userID uuid.UUID, email, secret string, ttl time.Duration) (string, error) {
	claims := Claims{
		UserID: userID,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(ttl)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// ParseToken validates and parses a JWT token
func ParseToken(tokenStr, secret string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, apperrors.ErrInvalidToken
		}
		return []byte(secret), nil
	})

	if err != nil || !token.Valid {
		return nil, apperrors.ErrInvalidToken
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return nil, apperrors.ErrInvalidToken
	}

	return claims, nil
}

func ValidatePassword(password string) error {
    if len(password) < 8 {
        return errors.New("password must be at least 8 characters")
    }

    var hasUpper, hasLower, hasNumber, hasSymbol bool
    for _, c := range password {
        switch {
        case unicode.IsUpper(c):
            hasUpper = true
        case unicode.IsLower(c):
            hasLower = true
        case unicode.IsNumber(c):
            hasNumber = true
        case unicode.IsPunct(c) || unicode.IsSymbol(c):
            hasSymbol = true
        }
    }

    if !hasUpper {
        return errors.New("password must contain at least one uppercase letter")
    }
    if !hasLower {
        return errors.New("password must contain at least one lowercase letter")
    }
    if !hasNumber {
        return errors.New("password must contain at least one number")
    }
    if !hasSymbol {
        return errors.New("password must contain at least one symbol")
    }

    return nil
}

// Set tokens in cookies
func SetAuthCookies(w http.ResponseWriter, tokens TokenPair) {
    isProduction := os.Getenv("ENV") == "production"

    // Use SameSite=Strict in production for better security, and SameSite=Lax in development for easier testing
    var sameSiteValue http.SameSite
    if isProduction {
        sameSiteValue = http.SameSiteStrictMode
    } else {
        sameSiteValue = http.SameSiteLaxMode
    }

	http.SetCookie(w, &http.Cookie{
		Name:     "accessToken",
		Value:    tokens.AccessToken,
		HttpOnly: true,
		Secure:   isProduction,
		SameSite: sameSiteValue,
		Path:     "/",
		MaxAge:   15 * 60, // 15 minutes
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refreshToken",
		Value:    tokens.RefreshToken,
		HttpOnly: true,
		Secure:   isProduction,
		SameSite: sameSiteValue,
		Path:     "/",
		MaxAge:   7 * 24 * 60 * 60, // 7 days
	})
}

// ClearAuthCookies removes the authentication cookies
func ClearAuthCookies(w http.ResponseWriter) {
    // Clear both cookies by setting MaxAge to -1
    http.SetCookie(w, &http.Cookie{
		Name:     "accessToken",
		Value:    "",
		HttpOnly: true,
		Path:     "/",
		MaxAge:   -1, 
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refreshToken",
		Value:    "",
		HttpOnly: true,
		Path:     "/",
		MaxAge:   -1,
	})
}