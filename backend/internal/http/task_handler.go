package httpapi

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/luis-botelho/desafio-fullstack-veritas/backend/internal/domain"
	"github.com/luis-botelho/desafio-fullstack-veritas/backend/internal/repository"
)

type TaskHandler struct {
	repository *repository.MemoryTaskRepository
}

type CreateTaskRequest struct {
	Title       string            `json:"title"`
	Description string            `json:"description"`
	Status      domain.TaskStatus `json:"status"`
}

type UpdateTaskRequest struct {
	Title       string            `json:"title"`
	Description string            `json:"description"`
	Status      domain.TaskStatus `json:"status"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

// NewTaskHandler creates a new instance of TaskHandler with the provided task repository.
func NewTaskHandler(
	taskRepository *repository.MemoryTaskRepository,
) *TaskHandler {
	return &TaskHandler{
		repository: taskRepository,
	}
}

// ListTasks handles the HTTP GET request to list all tasks.
func (h *TaskHandler) ListTasks(
	w http.ResponseWriter,
	r *http.Request,
) {
	tasks := h.repository.List()

	writeJSON(w, http.StatusOK, tasks)
}

// CreateTask handles the HTTP POST request to create a new task.
func (h *TaskHandler) CreateTask(
	w http.ResponseWriter,
	r *http.Request,
) {
	var request CreateTaskRequest

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&request); err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			"invalid request body",
		)
		return
	}

	if request.Status == "" {
		request.Status = domain.TaskStatusTodo
	}

	id := strconv.FormatInt(time.Now().UnixNano(), 10)

	task, err := domain.NewTask(
		id,
		request.Title,
		request.Description,
		request.Status,
	)

	if err != nil {
		switch {
		case errors.Is(err, domain.ErrTaskTitleRequired):
			writeError(
				w,
				http.StatusBadRequest,
				"task title is required",
			)

		case errors.Is(err, domain.ErrInvalidTaskStatus):
			writeError(
				w,
				http.StatusBadRequest,
				"invalid task status",
			)

		default:
			writeError(
				w,
				http.StatusInternalServerError,
				"failed to create task",
			)
		}

		return
	}

	h.repository.Save(*task)

	writeJSON(w, http.StatusCreated, task)
}

// UpdateTask handles the HTTP PUT request to update an existing task.
func (h *TaskHandler) UpdateTask(
	w http.ResponseWriter,
	r *http.Request,
) {
	id := chi.URLParam(r, "id")

	task, err := h.repository.FindByID(id)

	if err != nil {
		if errors.Is(err, repository.ErrTaskNotFound) {
			writeError(
				w,
				http.StatusNotFound,
				"task not found",
			)
			return
		}

		writeError(
			w,
			http.StatusInternalServerError,
			"failed to find task",
		)
		return
	}

	var request UpdateTaskRequest

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&request); err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			"invalid request body",
		)
		return
	}

	if err := task.Update(
		request.Title,
		request.Description,
		request.Status,
	); err != nil {
		switch {
		case errors.Is(err, domain.ErrTaskTitleRequired):
			writeError(
				w,
				http.StatusBadRequest,
				"task title is required",
			)

		case errors.Is(err, domain.ErrInvalidTaskStatus):
			writeError(
				w,
				http.StatusBadRequest,
				"invalid task status",
			)

		default:
			writeError(
				w,
				http.StatusInternalServerError,
				"failed to update task",
			)
		}

		return
	}

	h.repository.Save(task)

	writeJSON(w, http.StatusOK, task)
}

// DeleteTask handles the HTTP DELETE request to delete an existing task.
func (h *TaskHandler) DeleteTask(
	w http.ResponseWriter,
	r *http.Request,
) {
	id := chi.URLParam(r, "id")

	if err := h.repository.Delete(id); err != nil {
		if errors.Is(err, repository.ErrTaskNotFound) {
			writeError(
				w,
				http.StatusNotFound,
				"task not found",
			)
			return
		}

		writeError(
			w,
			http.StatusInternalServerError,
			"failed to delete task",
		)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func writeJSON(
	w http.ResponseWriter,
	statusCode int,
	data any,
) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(
			w,
			"failed to encode response",
			http.StatusInternalServerError,
		)
	}
}

func writeError(
	w http.ResponseWriter,
	statusCode int,
	message string,
) {
	writeJSON(
		w,
		statusCode,
		ErrorResponse{
			Error: message,
		},
	)
}
