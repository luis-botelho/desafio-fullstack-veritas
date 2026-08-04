import type {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from "../types/task";

//Decisão de não utilizar .env para armazenar a URL da API, pois o projeto é apenas um protótipo e não será publicado em produção.
const API_URL = "http://localhost:8080";

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = "Não foi possível concluir a operação.";

    try {
      const body = (await response.json()) as {
        error?: string;
      };

      if (body.error) {
        message = body.error;
      }
    } catch {
      // Mantém a mensagem padrão quando a resposta não contém JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getTasks(): Promise<Task[]> {
  return request<Task[]>("/tasks");
}

export function createTask(
  input: CreateTaskInput,
): Promise<Task> {
  return request<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTask(
  id: string,
  input: UpdateTaskInput,
): Promise<Task> {
  return request<Task>(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteTask(id: string): Promise<void> {
  return request<void>(`/tasks/${id}`, {
    method: "DELETE",
  });
}