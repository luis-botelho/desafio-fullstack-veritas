import { useEffect, useState } from "react";

import "./App.css";

import { KanbanColumn } from "./components/KanbanColumn/KanbanColumn";
import { Modal } from "./components/Modal/Modal";
import { TaskForm } from "./components/TaskForm/TaskForm";
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
  const [isTaskFormOpen, setIsTaskFormOpen] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null);

  const [taskToDelete, setTaskToDelete] =
    useState<Task | null>(null);

  const [
    initialTaskStatus,
    setInitialTaskStatus,
  ] = useState<TaskStatus>("todo");

  const {
    tasks,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    clearError,
    clearSuccessMessage,
  } = useTasks();

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      clearSuccessMessage();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [successMessage, clearSuccessMessage]);

  function closeTaskForm() {
    setIsTaskFormOpen(false);
    setSelectedTask(null);
  }

  function moveTask(
    task: Task,
    status: TaskStatus,
  ) {
    if (
      task.status === status ||
      isSubmitting
    ) {
      return;
    }

    void updateTask(task.id, {
      title: task.title,
      description: task.description,
      status,
    });
  }

  function dropTask(
    taskId: string,
    status: TaskStatus,
  ) {
    const task = tasks.find(
      (currentTask) =>
        currentTask.id === taskId,
    );

    if (!task) {
      return;
    }

    moveTask(task, status);
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
            setInitialTaskStatus("todo");
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
      {successMessage && (
        <section
          className="success-feedback"
          role="status"
        >
          <p>{successMessage}</p>

          <button
            type="button"
            aria-label="Fechar mensagem"
            onClick={clearSuccessMessage}
          >
            ×
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
            onOpenTask={(task) => {
              setSelectedTask(task);
              setIsTaskFormOpen(true);
            }}
            onDropTask={dropTask}
            onCreateTask={(status) => {
              setSelectedTask(null);
              setInitialTaskStatus(status);
              setIsTaskFormOpen(true);
            }}
          />
        ))}
      </section>

      {isTaskFormOpen && (
        <Modal
          eyebrow={
            selectedTask
              ? "Editar tarefa"
              : "Nova tarefa"
          }
          title={
            selectedTask
              ? "Atualizar tarefa"
              : "Adicionar ao quadro"
          }
          onClose={closeTaskForm}
          headerActions={
            selectedTask ? (
              <button
                type="button"
                className="danger-button"
                disabled={isSubmitting}
                onClick={() => {
                  setTaskToDelete(selectedTask);
                  closeTaskForm();
                }}
              >
                Excluir
              </button>
            ) : undefined
          }
        >
          <TaskForm
            key={
              selectedTask?.id ??
              "new-task"
            }
            task={
              selectedTask ?? undefined
            }
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
            initialStatus={initialTaskStatus}
          />
        </Modal>
      )}

      {taskToDelete && (
        <Modal
          eyebrow="Excluir tarefa"
          title="Confirmar exclusão"
          onClose={() => {
            setTaskToDelete(null);
          }}
        >
          <p>
            Tem certeza que deseja excluir{" "}
            <strong>
              {taskToDelete.title}
            </strong>
            ?
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
                const success =
                  await deleteTask(
                    taskToDelete,
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
        </Modal>
      )}
    </main>
  );
}

export default App;
