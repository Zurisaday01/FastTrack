package goal

import (
	"context"

	"github.com/google/uuid"
)

type Service interface {
	CreateGoal(ctx context.Context, userId uuid.UUID, input CreateUpdateGoalInput) (uuid.UUID, error)
	GetGoalsByUserId(ctx context.Context, userId uuid.UUID) ([]Goal, error)
	GetGoalById(ctx context.Context, id uuid.UUID, userId uuid.UUID) (Goal, error)
	UpdateGoal(ctx context.Context, id uuid.UUID, userId uuid.UUID, input CreateUpdateGoalInput) error
	DeleteGoal(ctx context.Context, id uuid.UUID, userId uuid.UUID) error
}

type svc struct {
	model *GoalModel
}

func NewService(model *GoalModel) Service {
	return &svc{model: model}
}

func (s *svc) CreateGoal(ctx context.Context, userId uuid.UUID, input CreateUpdateGoalInput) (uuid.UUID, error) {
	return s.model.CreateGoal(ctx, userId, input)
}

func (s *svc) GetGoalsByUserId(ctx context.Context, userId uuid.UUID) ([]Goal, error) {
	return s.model.GetGoalsByUserId(ctx, userId)
}

func (s *svc) GetGoalById(ctx context.Context, id uuid.UUID, userId uuid.UUID) (Goal, error) {
	return s.model.GetGoalById(ctx, id, userId)
}

func (s *svc) UpdateGoal(ctx context.Context, id uuid.UUID, userId uuid.UUID, input CreateUpdateGoalInput) error {
	return s.model.UpdateGoal(ctx, id, userId, input)
}

func (s *svc) DeleteGoal(ctx context.Context, id uuid.UUID, userId uuid.UUID) error {
	return s.model.DeleteGoal(ctx, id, userId)
}