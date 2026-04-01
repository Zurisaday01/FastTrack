package auth

import (
	"context"
	"net/http"
	"strings"

	"github.com/Zurisaday01/FastTrack/internal/apperrors"
)

type contextKey string

const ClaimsKey contextKey = "claims"

// RequireAuth is an HTTP middleware that validates the Bearer token on
// protected routes and injects the parsed Claims into the request context.
func RequireAuth(service Service, appErrors *apperrors.AppErrors) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				appErrors.Unauthorized(w, "missing Authorization header")
				return
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
				appErrors.Unauthorized(w, "authorization header must be in the format: Bearer <token>")
				return
			}

			tokenStr := strings.TrimSpace(parts[1])
			if tokenStr == "" {
				appErrors.Unauthorized(w, "missing token")
				return
			}

			claims, err := service.ValidateToken(tokenStr)
			if err != nil {
				appErrors.Unauthorized(w, "invalid or expired token")
				return
			}

			// Inject claims into the context so downstream handlers can read them
			ctx := context.WithValue(r.Context(), ClaimsKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// ClaimsFromContext is a convenience helper to retrieve Claims from a context.
func ClaimsFromContext(ctx context.Context) (*Claims, bool) {
	claims, ok := ctx.Value(ClaimsKey).(*Claims)
	return claims, ok
}