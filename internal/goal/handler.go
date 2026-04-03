package goal

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/Zurisaday01/FastTrack/internal/apperrors"
	"github.com/Zurisaday01/FastTrack/internal/helpers"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type Handler struct {
	service Service
	appErrors *apperrors.AppErrors
}

func NewHandler(service Service, appErrors *apperrors.AppErrors) *Handler {
	return &Handler{service: service, appErrors: appErrors}
}

// Return a list of goals for a user in JSON format
func (h *Handler) ListGoals(w http.ResponseWriter, r *http.Request) {
	// Get the userId from the cookies
	userId, err := helpers.AuthenticateRequest(w, r)

	if err != nil {
		if errors.Is(err, apperrors.ErrNotAuthenticated) {
			h.appErrors.Unauthorized(w, "not authenticated")
			return
		} else if errors.Is(err, apperrors.ErrInvalidToken) {
			h.appErrors.Unauthorized(w, "invalid or expired token")
			return
		}

		// For any other error, return a 500 server error
		h.appErrors.ServerError(w, r, err)
		return
	}
	// get the context
	ctx := r.Context()

	goals, err := h.service.GetGoalsByUserId(ctx, userId)
	if err != nil {
		h.appErrors.ServerError(w, r, err)
		return
	}

	// Return the goals in JSON format
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(goals) 
}

// Return a goals for a user in JSON format
func (h *Handler) GetGoalById(w http.ResponseWriter, r *http.Request) {
	// Get the userId from the cookies
	userId, err := helpers.AuthenticateRequest(w, r)

	if err != nil {
		if errors.Is(err, apperrors.ErrNotAuthenticated) {
			h.appErrors.Unauthorized(w, "not authenticated")
			return
		} else if errors.Is(err, apperrors.ErrInvalidToken) {
			h.appErrors.Unauthorized(w, "invalid or expired token")
			return
		}

		// For any other error, return a 500 server error
		h.appErrors.ServerError(w, r, err)
		return
	}
	// get the context
	ctx := r.Context()
	idParam := chi.URLParam(r, "id")
	goalId, err := uuid.Parse(idParam)

	if err != nil {
		h.appErrors.BadRequest(w, errors.New("invalid goal id"))
		return
	}

	goal, err := h.service.GetGoalById(ctx, goalId, userId)
	if err != nil {
		h.appErrors.ServerError(w, r, err)
		return
	}

	// Return the goal in JSON format
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(goal)
}

// create a new goal for a user
func (h *Handler) CreateGoal(w http.ResponseWriter, r *http.Request) {
	// Get the userId from the cookies
	userId, err := helpers.AuthenticateRequest(w, r)

	if err != nil {
		if errors.Is(err, apperrors.ErrNotAuthenticated) {
			h.appErrors.Unauthorized(w, "not authenticated")
			return
		} else if errors.Is(err, apperrors.ErrInvalidToken) {
			h.appErrors.Unauthorized(w, "invalid or expired token")
			return
		}

		// For any other error, return a 500 server error
		h.appErrors.ServerError(w, r, err)
		return
	}
	// get the body from the request
	var input CreateUpdateGoalInput

	decoder := json.NewDecoder(r.Body)
	// disable unknown fields
	decoder.DisallowUnknownFields()

	// Decode the body into the input struct
	err = decoder.Decode(&input)

	if err != nil {
		h.appErrors.BadRequest(w, err)
		return
	}

	// get the context
	ctx := r.Context()

	// Trim and validate required fields
	windowStart := strings.TrimSpace(input.WindowStart)
	windowEnd := strings.TrimSpace(input.WindowEnd)

	if windowStart == "" {
		h.appErrors.BadRequest(w, errors.New("windowStart is required"))
		return
	}

	if windowEnd == "" {
		h.appErrors.BadRequest(w, errors.New("windowEnd is required"))
		return
	}

	id, err := h.service.CreateGoal(ctx, userId, CreateUpdateGoalInput{
		WindowStart: windowStart,
		WindowEnd: windowEnd,
	})

	if err != nil {
		// Check if there is a duplicated goal already
		if errors.Is(err, apperrors.ErrAlreadyExists) {
			h.appErrors.Conflict(w, "goal already exists")
			return
		}
		// For any other error, return a 500 server error
		h.appErrors.ServerError(w, r, err)
		return
	}

	// Return the created goal
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(Goal{
		ID: id,
		UserID: userId,
		WindowStart: windowStart,
		WindowEnd: windowEnd,
	})
}


func (h *Handler) UpdateGoal(w http.ResponseWriter, r *http.Request) {
	// Get the userId from the cookies
	userId, err := helpers.AuthenticateRequest(w, r)

	if err != nil {
		if errors.Is(err, apperrors.ErrNotAuthenticated) {
			h.appErrors.Unauthorized(w, "not authenticated")
			return
		} else if errors.Is(err, apperrors.ErrInvalidToken) {
			h.appErrors.Unauthorized(w, "invalid or expired token")
			return
		}

		// For any other error, return a 500 server error
		h.appErrors.ServerError(w, r, err)
		return
	}
	// get the body from the request
	var input CreateUpdateGoalInput

	decoder := json.NewDecoder(r.Body)
	// disable unknown fields
	decoder.DisallowUnknownFields()

	// Decode the body into the input struct
	err = decoder.Decode(&input)

	if err != nil {
		h.appErrors.BadRequest(w, err)
		return
	}

	// get the context
	ctx := r.Context()
	idParam := chi.URLParam(r, "id")
	goalId, err := uuid.Parse(idParam)

	if err != nil {
		h.appErrors.BadRequest(w, errors.New("invalid goal id"))
		return
	}

	// Trim and validate required fields
	windowStart := strings.TrimSpace(input.WindowStart)
	windowEnd := strings.TrimSpace(input.WindowEnd)

	if windowStart == "" {
		h.appErrors.BadRequest(w, errors.New("windowStart is required"))
		return
	}

	if windowEnd == "" {
		h.appErrors.BadRequest(w, errors.New("windowEnd is required"))
		return
	}

	err = h.service.UpdateGoal(ctx, goalId, userId, CreateUpdateGoalInput{
		WindowStart: windowStart,
		WindowEnd: windowEnd,
	})

	if err != nil {
		// Check if there is a duplicated goal already
		if errors.Is(err, apperrors.ErrAlreadyExists) {
			h.appErrors.Conflict(w, "goal already exists")
			return
		}
		// For any other error, return a 500 server error
		h.appErrors.ServerError(w, r, err)
		return
	}

	// Return the updated goal
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(Goal{
		ID: goalId,
		UserID: userId,
		WindowStart: windowStart,
		WindowEnd: windowEnd,
	})
}

func (h *Handler) DeleteGoal(w http.ResponseWriter, r *http.Request) {
	// Get the userId from the cookies
	userId, err := helpers.AuthenticateRequest(w, r)

	if err != nil {
		if errors.Is(err, apperrors.ErrNotAuthenticated) {
			h.appErrors.Unauthorized(w, "not authenticated")
			return
		} else if errors.Is(err, apperrors.ErrInvalidToken) {
			h.appErrors.Unauthorized(w, "invalid or expired token")
			return
		}

		// For any other error, return a 500 server error
		h.appErrors.ServerError(w, r, err)
		return
	}

	ctx := r.Context()
	idParam := chi.URLParam(r, "id")
	goalId, err := uuid.Parse(idParam)

	if err != nil {
		h.appErrors.BadRequest(w, errors.New("invalid goal id"))
		return
	}

	err = h.service.DeleteGoal(ctx, goalId, userId)
	if err != nil {
		h.appErrors.ServerError(w, r, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}