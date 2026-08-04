package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"

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
	response := HealthResponse{
		Status:  "ok",
		Service: "veritas-kanban-api",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("failed to encode health response: %v", err)
	}
}

func main() {
	taskRepository := repository.NewMemoryTaskRepository()
	taskHandler := httpapi.NewTaskHandler(taskRepository)

	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:5173",
		},
		AllowedMethods: []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodPut,
			http.MethodDelete,
			http.MethodOptions,
		},
		AllowedHeaders: []string{
			"Accept",
			"Content-Type",
		},
		MaxAge: 300,
	}))

	router.Get("/health", healthHandler)
	router.Get("/tasks", taskHandler.ListTasks)
	router.Post("/tasks", taskHandler.CreateTask)
	router.Put("/tasks/{id}", taskHandler.UpdateTask)
	router.Delete("/tasks/{id}", taskHandler.DeleteTask)

	server := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	log.Println("API running at http://localhost:8080")

	if err := server.ListenAndServe(); err != nil &&
		err != http.ErrServerClosed {
		log.Fatalf("failed to start server: %v", err)
	}
}
