package goal

import (
	"github.com/google/uuid"
)

type Goal struct {
	ID                     uuid.UUID `json:"id"`
	UserID                 uuid.UUID `json:"userId"`
	Title				   string    `json:"title"`
	WindowStart            string    `json:"windowStart"`
	WindowEnd              string    `json:"windowEnd"`
	CreatedAt              string    `json:"createdAt"`
	UpdatedAt              string    `json:"updatedAt"`
}

type CreateUpdateGoalInput struct {
	Title				   string    `json:"title"`
	WindowStart            string    `json:"windowStart"`
	WindowEnd              string    `json:"windowEnd"`
}
