package repository

import (
	"testing"
	"time"

	"github.com/luis-botelho/desafio-fullstack-veritas/backend/internal/domain"
)

func createTestTask(t *testing.T, id string) domain.Task {
	t.Helper()

	task, err := domain.NewTask(
		id,
		"Estudar Go",
		"Entender o repository",
		domain.TaskStatusTodo,
	)

	if err != nil {
		t.Fatalf("failed to create test task: %v", err)
	}

	return *task
}

func TestMemoryTaskRepositorySaveAndFindByID(t *testing.T) {
	repository := NewMemoryTaskRepository()
	task := createTestTask(t, "task-1")

	repository.Save(task)

	savedTask, err := repository.FindByID("task-1")

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if savedTask.ID != task.ID {
		t.Errorf("expected ID %q, got %q", task.ID, savedTask.ID)
	}

	if savedTask.Title != task.Title {
		t.Errorf("expected title %q, got %q", task.Title, savedTask.Title)
	}
}

func TestMemoryTaskRepositoryList(t *testing.T) {
	repository := NewMemoryTaskRepository()

	newestTask := createTestTask(t, "task-newest")
	newestTask.CreatedAt = time.Date(2026, time.January, 3, 12, 0, 0, 0, time.UTC)

	oldestTask := createTestTask(t, "task-oldest")
	oldestTask.CreatedAt = time.Date(2026, time.January, 1, 12, 0, 0, 0, time.UTC)

	middleTask := createTestTask(t, "task-middle")
	middleTask.CreatedAt = time.Date(2026, time.January, 2, 12, 0, 0, 0, time.UTC)

	repository.Save(newestTask)
	repository.Save(oldestTask)
	repository.Save(middleTask)

	tasks := repository.List()

	if len(tasks) != 3 {
		t.Fatalf("expected 3 tasks, got %d", len(tasks))
	}

	expectedIDs := []string{"task-oldest", "task-middle", "task-newest"}

	for i, expectedID := range expectedIDs {
		if tasks[i].ID != expectedID {
			t.Errorf("expected task at position %d to have ID %q, got %q", i, expectedID, tasks[i].ID)
		}
	}
}

func TestMemoryTaskRepositoryFindByIDReturnsError(t *testing.T) {
	repository := NewMemoryTaskRepository()

	_, err := repository.FindByID("missing-task")

	if err != ErrTaskNotFound {
		t.Errorf("expected error %v, got %v", ErrTaskNotFound, err)
	}
}

func TestMemoryTaskRepositoryDelete(t *testing.T) {
	repository := NewMemoryTaskRepository()
	task := createTestTask(t, "task-1")

	repository.Save(task)

	err := repository.Delete(task.ID)

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	_, err = repository.FindByID(task.ID)

	if err != ErrTaskNotFound {
		t.Errorf("expected error %v, got %v", ErrTaskNotFound, err)
	}
}
