import { useCallback, useEffect, useState } from "react";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/taskApi";

import type { CreateTaskInput, Task, UpdateTaskInput } from "../types/task";

import {
  getTaskCreatedMessage,
  getTaskDeletedMessage,
  getTaskUpdatedMessage,
} from "../utils/taskFeedback";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getTasks();

      setTasks(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar as tarefas.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function fetchInitialTasks() {
      try {
        const data = await getTasks();

        if (!isCancelled) {
          setTasks(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível carregar as tarefas.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchInitialTasks();

    return () => {
      isCancelled = true;
    };
  }, []);

  async function handleCreateTask(input: CreateTaskInput): Promise<boolean> {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const newTask = await createTask(input);

      setTasks((currentTasks) => [...currentTasks, newTask]);

      setSuccessMessage(getTaskCreatedMessage(newTask));

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível criar a tarefa.",
      );

      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateTask(
    id: string,
    input: UpdateTaskInput,
  ): Promise<boolean> {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const updatedTask = await updateTask(id, input);
      const previousTask = tasks.find((task) => task.id === id);

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? updatedTask : task)),
      );

      setSuccessMessage(
        previousTask
          ? getTaskUpdatedMessage(previousTask, updatedTask)
          : `Tarefa "${updatedTask.title}" atualizada com sucesso.`,
      );

      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível atualizar a tarefa.",
      );

      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteTask(task: Task): Promise<boolean> {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      await deleteTask(task.id);

      setTasks((currentTasks) =>
        currentTasks.filter((currentTask) => currentTask.id !== task.id),
      );

      setSuccessMessage(getTaskDeletedMessage(task));

      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível excluir a tarefa.",
      );

      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearError() {
    setError(null);
  }

  function clearSuccessMessage() {
    setSuccessMessage(null);
  }

  return {
    tasks,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    loadTasks,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    clearError,
    clearSuccessMessage,
  };
}
