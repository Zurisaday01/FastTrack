package main

import (
	"fmt"
	"log/slog"
	"os"

	"github.com/Zurisaday01/FastTrack/internal/auth"
	"github.com/Zurisaday01/FastTrack/internal/config"
	"github.com/Zurisaday01/FastTrack/internal/database"
	"github.com/Zurisaday01/FastTrack/internal/goal"
)

func main() {
	// Use the slog.New() function to initialize a new structured logger, which
	// writes to the standard out stream and uses the default settings.
	// add calling location to the log output
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		AddSource: true,
	}))

	cfg, err := config.New()
	if err != nil {
		logger.Error("loading config failed", "error", err)
		os.Exit(1)
	}

	db, err := database.OpenDB(cfg)
	if err != nil {
		logger.Error("failed to open database", "error", err)
		os.Exit(1)
	}

	defer db.Close()

	fmt.Println("Database connected successfully")

	// Load the application with its dependencies
	app := &application{
		logger:  logger,
		addr:     ":8080",
		auth:      &auth.AuthModel{DB: db},
		goal:      &goal.GoalModel{DB: db},
	}


	// Start the HTTP server
	err = app.run()

	// we use the Error() method to log any error message returned by
	// http.ListenAndServe() at Error severity (with no additional attributes),
	// and then call os.Exit(1) to terminate the application with exit code 1.	
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}
}

