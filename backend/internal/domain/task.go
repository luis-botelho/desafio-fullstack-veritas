package domain

import (
	"errors"
	"strings"
	"time"
)

type TaskStatus string

const (
	TaskStatusTodo       TaskStatus = "todo"
	TaskStatusInProgress TaskStatus = "in_progress"
	TaskStatusDone       TaskStatus = "done"
)

var (
	ErrTaskTitleRequired = errors.New("task title is required")
	ErrInvalidTaskStatus = errors.New("invalid task status")
)

type Task struct {
	ID          string     `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Status      TaskStatus `json:"status"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

func NewTask(
	id string,
	title string,
	description string,
	status TaskStatus,
) (*Task, error) {
	task := &Task{
		ID:          id,
		Title:       strings.TrimSpace(title),
		Description: strings.TrimSpace(description),
		Status:      status,
		CreatedAt:   time.Now().UTC(),
		UpdatedAt:   time.Now().UTC(),
	}

	if err := task.Validate(); err != nil {
		return nil, err
	}

	return task, nil
}

func (t *Task) Validate() error {
	// Keep normalization in the domain so every entry point persists the same
	// representation, regardless of whether the task came from HTTP or elsewhere.
	t.Title = strings.TrimSpace(t.Title)
	t.Description = strings.TrimSpace(t.Description)

	if t.Title == "" {
		return ErrTaskTitleRequired
	}

	if !t.Status.IsValid() {
		return ErrInvalidTaskStatus
	}

	return nil
}

// Update updates the task with the provided information.
func (t *Task) Update(
	title string,
	description string,
	status TaskStatus,
) error {
	t.Title = strings.TrimSpace(title)
	t.Description = strings.TrimSpace(description)
	t.Status = status

	if err := t.Validate(); err != nil {
		return err
	}

	t.UpdatedAt = time.Now().UTC()

	return nil
}

func (s TaskStatus) IsValid() bool {
	switch s {
	case TaskStatusTodo,
		TaskStatusInProgress,
		TaskStatusDone:
		return true
	default:
		return false
	}
}
