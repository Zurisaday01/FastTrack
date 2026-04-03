package goal

import (
	"context"
	"database/sql"
	"errors"

	"github.com/Zurisaday01/FastTrack/internal/apperrors"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

type GoalModel struct {
	DB        *sql.DB
	appErrors *apperrors.AppErrors
}

func (gm *GoalModel) CreateGoal(ctx context.Context, userId uuid.UUID, input CreateUpdateGoalInput) (uuid.UUID, error) {
	// create uuid for the new goal
	id := uuid.New()
	
	// insert the new goal into the database
	stmt := `INSERT INTO fasting_goals (id, user_id, title, window_start, window_end) VALUES ($1, $2, $3, $4, $5)`

	_, err := gm.DB.ExecContext(ctx, stmt, id, userId, input.Title, input.WindowStart, input.WindowEnd)

	if err != nil {
		// Check pgsql error code for unique violation
		var pgErr *pq.Error
		if errors.As(err, &pgErr) {
			if pgErr.Code == "23505" {
				return uuid.Nil, apperrors.ErrAlreadyExists
			}
		}

		// If it's not a unique violation, return the error
		return uuid.Nil, err
	}

	return id, nil
}

// There are many to one between goals and users, so we can have multiple goals for a single user, but also one user might choose only one
func (gm *GoalModel) GetGoalsByUserId(ctx context.Context, userId uuid.UUID) ([]Goal, error) {
	stmt := `SELECT id, user_id, title, window_start, window_end, created_at FROM fasting_goals WHERE user_id = $1`

	rows, err := gm.DB.QueryContext(ctx, stmt, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	goals := []Goal{}
	for rows.Next() {
		var goal Goal
		err := rows.Scan(
			&goal.ID,
			&goal.UserID,
			&goal.Title,
			&goal.WindowStart,
			&goal.WindowEnd,
			&goal.CreatedAt,
		); 

		if err != nil {
			return nil, err
		}

		goals = append(goals, goal)
	}

	return goals, nil
}

func (gm *GoalModel) GetGoalById(ctx context.Context, id uuid.UUID, userId uuid.UUID) (Goal, error) {
	// Check that this goal belongs to the user
	stmt := `SELECT id, user_id, title, window_start, window_end, created_at FROM fasting_goals WHERE id = $1 AND user_id = $2`
	
	var goal Goal
	err := gm.DB.QueryRowContext(ctx, stmt, id, userId).Scan(
		&goal.ID,
		&goal.UserID,
		&goal.Title,
		&goal.WindowStart,
		&goal.WindowEnd,
		&goal.CreatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return Goal{}, apperrors.ErrRecordNotFound
		}
		return Goal{}, err
	}

	return goal, nil
}


func (gm *GoalModel) UpdateGoal(ctx context.Context, id uuid.UUID, userId uuid.UUID, input CreateUpdateGoalInput) error {
	// Check that this goal belongs to the user and update it
	stmt := `UPDATE fasting_goals SET title = $1, window_start = $2, window_end = $3, updated_at = NOW() WHERE id = $4 AND user_id = $5`
	result, err := gm.DB.ExecContext(ctx, stmt, input.Title, input.WindowStart, input.WindowEnd, id, userId)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return apperrors.ErrRecordNotFound
	}

	return nil
}

func (gm *GoalModel) DeleteGoal(ctx context.Context, id uuid.UUID, userId uuid.UUID) error {
	// Check that this goal belongs to the user and delete it
	stmt := `DELETE FROM fasting_goals WHERE id = $1 AND user_id = $2`
	result, err := gm.DB.ExecContext(ctx, stmt, id, userId)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return apperrors.ErrRecordNotFound
	}

	return nil
}