package main

import (
	"encoding/json"
	"log"
	"net/http"

	httpapi "github.com/luis-botelho/desafio-fullstack-veritas/backend/internal/http"
	"github.com/luis-botelho/desafio-fullstack-veritas/backend/internal/repository"
)

type HealthResponse struct {
	Status  string `json:"status"`
	Service string `json:"service"`
}

func healthHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	if r.Method != http.MethodGet {
		http.Error(
			w,
			"method not allowed",
			http.StatusMethodNotAllowed,
		)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	response := HealthResponse{
		Status:  "ok",
		Service: "veritas-kanban-api",
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf(
			"failed to encode health response: %v",
			err,
		)
	}
}

func main() {
	taskRepository := repository.NewMemoryTaskRepository()
	taskHandler := httpapi.NewTaskHandler(taskRepository)

	mux := http.NewServeMux()

	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/tasks", taskHandler.Tasks)

	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	log.Println("API running at http://localhost:8080")

	if err := server.ListenAndServe(); err != nil &&
		err != http.ErrServerClosed {
		log.Fatalf("failed to start server: %v", err)
	}
}