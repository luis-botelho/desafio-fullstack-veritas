package repository

import (
	"errors"
	"sync"

	"github.com/luis-botelho/desafio-fullstack-veritas/backend/internal/domain"
)

var ErrTaskNotFound = errors.New("task not found")

type MemoryTaskRepository struct {
	mu    sync.RWMutex
	tasks map[string]domain.Task
}

func NewMemoryTaskRepository() *MemoryTaskRepository {
	return &MemoryTaskRepository{
		tasks: make(map[string]domain.Task),
	}
}

func (r *MemoryTaskRepository) List() []domain.Task {
	r.mu.RLock()
	defer r.mu.RUnlock()

	tasks := make([]domain.Task, 0, len(r.tasks))

	for _, task := range r.tasks {
		tasks = append(tasks, task)
	}

	return tasks
}

func (r *MemoryTaskRepository) FindByID(id string) (domain.Task, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	task, exists := r.tasks[id]

	if !exists {
		return domain.Task{}, ErrTaskNotFound
	}

	return task, nil
}

func (r *MemoryTaskRepository) Save(task domain.Task) {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.tasks[task.ID] = task
}

func (r *MemoryTaskRepository) Delete(id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.tasks[id]; !exists {
		return ErrTaskNotFound
	}

	delete(r.tasks, id)

	return nil
}
