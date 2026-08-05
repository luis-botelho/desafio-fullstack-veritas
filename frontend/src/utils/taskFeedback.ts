import type {
  Task,
  TaskStatus,
} from "../types/task";

const statusLabels: Record<TaskStatus, string> = {
  todo: "A Fazer",
  in_progress: "Em Progresso",
  done: "Concluídas",
};

export function getTaskCreatedMessage(
  task: Task,
): string {
  return `Tarefa "${task.title}" criada com sucesso.`;
}

export function getTaskUpdatedMessage(
  previousTask: Task,
  updatedTask: Task,
): string {
  const titleChanged =
    previousTask.title !== updatedTask.title;

  const statusChanged =
    previousTask.status !== updatedTask.status;

  if (titleChanged && statusChanged) {
    return `Tarefa "${previousTask.title}" renomeada para "${updatedTask.title}" e movida de "${statusLabels[previousTask.status]}" para "${statusLabels[updatedTask.status]}".`;
  }

  if (titleChanged) {
    return `Tarefa "${previousTask.title}" renomeada para "${updatedTask.title}".`;
  }

  if (statusChanged) {
    return `Tarefa "${updatedTask.title}" movida de "${statusLabels[previousTask.status]}" para "${statusLabels[updatedTask.status]}".`;
  }

  return `Tarefa "${updatedTask.title}" atualizada com sucesso.`;
}

export function getTaskDeletedMessage(
  task: Task,
): string {
  return `Tarefa "${task.title}" excluída com sucesso.`;
}