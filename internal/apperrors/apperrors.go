package apperrors

import (
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"runtime/debug"
)

// Define a Responder wrapper struct
type AppErrors struct {
	Logger *slog.Logger
}

func (e *AppErrors) JSONError(w http.ResponseWriter, message string, status int) {
    w.WriteHeader(status)

	// Create a JSON response with the error message
    _ = json.NewEncoder(w).Encode(map[string]string{
        "error": message,
    })
}

var ErrRecordNotFound = errors.New("no matching record found")


// The serverError helper writes a log entry at Error level (including the request
// method and URI as attributes), then sends a generic 500 Internal Server Error
// response to the user.
func (e *AppErrors) ServerError(w http.ResponseWriter, r *http.Request, err error) {
	var (
		method  = r.Method
		uri		= r.URL.RequestURI()
		// Use debug.Stack() to get the stack trace. This returns a byte slice, which
		// we need to convert to a string so that it's readable in the log entry.
		trace = string(debug.Stack())
	)

	e.Logger.Error(err.Error(), "method", method, "uri", uri, "trace", trace)
	// pass writer, then status text(internal server error), again internal server error
	e.JSONError(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
}


// The clientError helper sends a specific status code and corresponding description
func (e *AppErrors) ClientError(w http.ResponseWriter, status int) {
	e.JSONError(w, http.StatusText(status), status)
}

func (e *AppErrors) InvalidId(w http.ResponseWriter, entity string) {
	e.JSONError(w, fmt.Sprintf("Invalid %s id", entity), http.StatusBadRequest)
} 

func (e *AppErrors) BadRequest(w http.ResponseWriter, err error) {
	e.JSONError(w, err.Error(), http.StatusBadRequest)
}

func (e *AppErrors) NotFound(w http.ResponseWriter, entity string) {
	e.JSONError(w, fmt.Sprintf("%s not found", entity), http.StatusNotFound)
}

// --- Sentinel errors ---

var ErrEmailAlreadyExists = errors.New("email already exists")
var ErrInvalidCredentials = errors.New("invalid credentials")
var ErrInvalidToken       = errors.New("invalid or expired token")

// --- New AppErrors methods ---

func (e *AppErrors) Unauthorized(w http.ResponseWriter, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusUnauthorized)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

func (e *AppErrors) Conflict(w http.ResponseWriter, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusConflict)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}