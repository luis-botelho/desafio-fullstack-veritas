package domain

import "testing"

func TestNewTaskCreatesValidTask(t *testing.T) {
	task, err := NewTask(
		"task-1",
		"  Criar interface do Kanban  ",
		"  Implementar as três colunas  ",
		TaskStatusTodo,
	)

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if task.Title != "Criar interface do Kanban" {
		t.Errorf("expected trimmed title, got %q", task.Title)
	}

	if task.Description != "Implementar as três colunas" {
		t.Errorf("expected trimmed description, got %q", task.Description)
	}

	if task.Status != TaskStatusTodo {
		t.Errorf("expected status %q, got %q", TaskStatusTodo, task.Status)
	}
}

func TestNewTaskRejectsEmptyTitle(t *testing.T) {
	_, err := NewTask(
		"task-1",
		"   ",
		"Descrição",
		TaskStatusTodo,
	)

	if err != ErrTaskTitleRequired {
		t.Errorf("expected error %v, got %v", ErrTaskTitleRequired, err)
	}
}

func TestNewTaskRejectsInvalidStatus(t *testing.T) {
	_, err := NewTask(
		"task-1",
		"Tarefa válida",
		"Descrição",
		TaskStatus("banana"),
	)

	if err != ErrInvalidTaskStatus {
		t.Errorf("expected error %v, got %v", ErrInvalidTaskStatus, err)
	}
}

func TestTaskUpdateChangesFields(t *testing.T) {
	task, err := NewTask(
		"task-1",
		"Título antigo",
		"Descrição antiga",
		TaskStatusTodo,
	)

	if err != nil {
		t.Fatalf("failed to create task: %v", err)
	}

	oldUpdatedAt := task.UpdatedAt

	err = task.Update(
		"Título atualizado",
		"Descrição atualizada",
		TaskStatusInProgress,
	)

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if task.Title != "Título atualizado" {
		t.Errorf("expected updated title, got %q", task.Title)
	}

	if task.Status != TaskStatusInProgress {
		t.Errorf("expected status %q, got %q", TaskStatusInProgress, task.Status)
	}

	if task.UpdatedAt.Before(oldUpdatedAt) {
		t.Error("expected UpdatedAt to be refreshed")
	}
}
