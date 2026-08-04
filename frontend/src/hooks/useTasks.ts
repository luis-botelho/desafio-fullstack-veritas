import { useCallback, useEffect, useState } from "react";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/taskApi";

import type { CreateTaskInput, Task, UpdateTaskInput } from "../types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const newTask = await createTask(input);

      setTasks((currentTasks) => [...currentTasks, newTask]);

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

      const updatedTask = await updateTask(id, input);

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? updatedTask : task)),
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

  async function handleDeleteTask(id: string): Promise<boolean> {
    try {
      setIsSubmitting(true);
      setError(null);

      await deleteTask(id);

      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));

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

  return {
    tasks,
    isLoading,
    isSubmitting,
    error,
    loadTasks,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    clearError,
  };
}
