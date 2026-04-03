package goal

import (
	"github.com/google/uuid"
)

type Goal struct {
	ID                     uuid.UUID `json:"id"`
	UserID                 uuid.UUID `json:"userId"`
	WindowStart            string    `json:"windowStart"`
	WindowEnd              string    `json:"windowEnd"`
	CreatedAt              string    `json:"createdAt"`
	UpdatedAt              string    `json:"updatedAt"`
}

type CreateUpdateGoalInput struct {
	WindowStart            string    `json:"windowStart"`
	WindowEnd              string    `json:"windowEnd"`
}
