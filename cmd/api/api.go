package main

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"github.com/Zurisaday01/FastTrack/internal/apperrors"
	"github.com/Zurisaday01/FastTrack/internal/auth"
	"github.com/Zurisaday01/FastTrack/internal/goal"
)

// Dependencies holds all shared dependencies for the app
type application struct {
	logger  *slog.Logger
	addr    string
	auth       *auth.AuthModel
	goal       *goal.GoalModel
	appErrors *apperrors.AppErrors
}


func (app *application) mount() http.Handler {

	// start chi router
	r := chi.NewRouter()

	// Cors middleware
	r.Use(cors.Handler(cors.Options{
		// TODO: For development, allow the front end url. In production, specify a different origin.
		AllowedOrigins:   []string{"http://localhost:5173"}, // NOTE: For now, allow all origins. Adjust later for security.
		AllowedMethods:   []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300, // 300 seconds = 5 minutes to cache preflight request
	}))

	// Chi’s Recoverer middleware
	r.Use(middleware.Recoverer)

	// Set a timeout value for all requests to complete within 60 seconds.
	// If a request takes longer than 60 seconds, it will be canceled
	// and the client will receive a timeout response.
	r.Use(middleware.Timeout(60 * time.Second))

	// Healthcheck endpoint
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// Home endpoint
	// w http.ResponseWriter – where you write the response.
	// r *http.Request – the incoming request.
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Server", "Go")
		w.Write([]byte("Hello from FastTrack API!"))
	})

	// Group all API routes together with JSON middleware
	r.Group(func (r chi.Router) {
		// Only apply JSON content type middleware to API routes
		r.Use(app.setJSONContentType)

		// Custom error responder
		appErrors := &apperrors.AppErrors{
			Logger: app.logger,
		}

		authService := auth.NewService(app.auth)
		authHandler := auth.NewHandler(authService, appErrors)

		goalService := goal.NewService(app.goal)
		goalHandler := goal.NewHandler(goalService, appErrors)
		r.Route("/api", func(r chi.Router) {
			r.Post("/auth/login", authHandler.Login)
			r.Post("/auth/refresh", authHandler.Refresh)
			r.Post("/auth/register", authHandler.Register)
			r.Post("/auth/logout", authHandler.Logout)
			r.Get("/auth/me", authHandler.Me)

			r.Post("/goals", goalHandler.CreateGoal)
			r.Get("/goals", goalHandler.ListGoals)
			r.Get("/goals/{id}", goalHandler.GetGoalById)
			r.Patch("/goals/{id}", goalHandler.UpdateGoal)
			r.Delete("/goals/{id}", goalHandler.DeleteGoal)
		})
	})
	
	return r
}

func (app *application) run()	 error {
	srv := &http.Server{
		Addr:         app.addr,
		Handler:      app.mount(),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  time.Minute,
	}

	// Send a message about the server listening
	app.logger.Info("starting server", "addr", app.addr)

	// start the server
	return srv.ListenAndServe()
}


// setJSONContentType middleware sets Content-Type header to application/json for all responses
func (app *application) setJSONContentType(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}