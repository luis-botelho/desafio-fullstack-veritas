package httpapi

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"

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

type ErrorResponse struct {
	Error string `json:"error"`
}

func NewTaskHandler(
	taskRepository *repository.MemoryTaskRepository,
) *TaskHandler {
	return &TaskHandler{
		repository: taskRepository,
	}
}

func (h *TaskHandler) ListTasks(
	w http.ResponseWriter,
	r *http.Request,
) {
	tasks := h.repository.List()

	writeJSON(w, http.StatusOK, tasks)
}

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