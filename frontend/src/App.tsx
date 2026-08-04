import { useState } from "react";

import "./App.css";

import { KanbanColumn } from "./components/KanbanColumn";
import { TaskForm } from "./components/TaskForm";
import { useTasks } from "./hooks/useTasks";

import type {
  Task,
  TaskStatus,
} from "./types/task";

interface KanbanColumnConfig {
  title: string;
  status: TaskStatus;
}

const columns: KanbanColumnConfig[] = [
  {
    title: "A Fazer",
    status: "todo",
  },
  {
    title: "Em Progresso",
    status: "in_progress",
  },
  {
    title: "Concluídas",
    status: "done",
  },
];

function App() {
  const [taskToDelete, setTaskToDelete] =
    useState<Task | null>(null);

  const [isTaskFormOpen, setIsTaskFormOpen] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null);

  const {
    tasks,
    isLoading,
    isSubmitting,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    clearError,
  } = useTasks();

  function closeTaskForm() {
    setIsTaskFormOpen(false);
    setSelectedTask(null);
  }

  if (isLoading) {
    return (
      <main>
        <p>Carregando tarefas...</p>
      </main>
    );
  }

  return (
    <main>
      <header>
        <div>
          <p>Desafio Full Stack Veritas</p>
          <h1>Mini Kanban</h1>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedTask(null);
            setIsTaskFormOpen(true);
          }}
        >
          Nova tarefa
        </button>
      </header>

      {error && (
        <section role="alert">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => {
              clearError();
              void loadTasks();
            }}
          >
            Tentar novamente
          </button>
        </section>
      )}

      <section aria-label="Quadro Kanban">
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            title={column.title}
            status={column.status}
            tasks={tasks}
            onEditTask={(task) => {
              setSelectedTask(task);
              setIsTaskFormOpen(true);
            }}
            onDeleteTask={(task) => {
              setTaskToDelete(task);
            }}
          />
        ))}
      </section>

      {isTaskFormOpen && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-form-title"
          >
            <header>
              <div>
                <p>
                  {selectedTask
                    ? "Editar tarefa"
                    : "Nova tarefa"}
                </p>

                <h2 id="task-form-title">
                  {selectedTask
                    ? "Atualizar tarefa"
                    : "Adicionar ao quadro"}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Fechar formulário"
                onClick={closeTaskForm}
              >
                ×
              </button>
            </header>

            <TaskForm
              key={selectedTask?.id ?? "new-task"}
              task={selectedTask ?? undefined}
              isSubmitting={isSubmitting}
              onSubmit={async (input) => {
                const success = selectedTask
                  ? await updateTask(
                    selectedTask.id,
                    input,
                  )
                  : await createTask(input);

                if (success) {
                  closeTaskForm();
                }

                return success;
              }}
              onCancel={closeTaskForm}
            />
          </section>
        </div>
      )}
      {taskToDelete && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-task-title"
          >
            <header>
              <div>
                <p>Excluir tarefa</p>
                <h2 id="delete-task-title">
                  Confirmar exclusão
                </h2>
              </div>

              <button
                type="button"
                aria-label="Fechar confirmação"
                onClick={() => {
                  setTaskToDelete(null);
                }}
              >
                ×
              </button>
            </header>

            <p>
              Tem certeza que deseja excluir{" "}
              <strong>{taskToDelete.title}</strong>?
            </p>

            <div className="delete-dialog__actions">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setTaskToDelete(null);
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="danger-button"
                disabled={isSubmitting}
                onClick={async () => {
                  const success = await deleteTask(
                    taskToDelete.id,
                  );

                  if (success) {
                    setTaskToDelete(null);
                  }
                }}
              >
                {isSubmitting
                  ? "Excluindo..."
                  : "Excluir tarefa"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;