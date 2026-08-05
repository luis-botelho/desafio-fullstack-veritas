import { useState } from "react";

import "./TaskForm.css";

import type {
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "../../types/task";

interface TaskFormProps {
  task?: Task;
  initialStatus?: TaskStatus;
  isSubmitting: boolean;
  onSubmit: (
    input: UpdateTaskInput,
  ) => Promise<boolean>;
  onCancel: () => void;
}

export function TaskForm({
  task,
  initialStatus = "todo",
  isSubmitting,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(
    task?.title ?? "",
  );

  const [description, setDescription] =
    useState(task?.description ?? "");

  const [status, setStatus] =
    useState<TaskStatus>(
      task?.status ?? initialStatus,
    );

  const [
    validationError,
    setValidationError,
  ] = useState<string | null>(null);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setValidationError(
        "Informe o título da tarefa.",
      );
      return;
    }

    setValidationError(null);

    const success = await onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
    });

    if (success && !task) {
      setTitle("");
      setDescription("");
      setStatus(initialStatus);
    }
  }

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="task-title">
          Título
        </label>

        <input
          id="task-title"
          type="text"
          value={title}
          maxLength={120}
          disabled={isSubmitting}
          placeholder="Ex.: Implementar tela inicial"
          autoFocus
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
      </div>

      <div>
        <label htmlFor="task-description">
          Descrição
        </label>

        <textarea
          id="task-description"
          value={description}
          maxLength={500}
          disabled={isSubmitting}
          placeholder="Detalhes da tarefa"
          rows={4}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        />
      </div>

      <div>
        <label htmlFor="task-status">
          Coluna
        </label>

        <select
          id="task-status"
          value={status}
          disabled={isSubmitting}
          onChange={(event) => {
            setStatus(
              event.target.value as TaskStatus,
            );
          }}
        >
          <option value="todo">
            A Fazer
          </option>

          <option value="in_progress">
            Em Progresso
          </option>

          <option value="done">
            Concluídas
          </option>
        </select>
      </div>

      {validationError && (
        <p role="alert">
          {validationError}
        </p>
      )}

      <div className="task-form__actions">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Salvando..."
            : task
              ? "Salvar alterações"
              : "Criar tarefa"}
        </button>
      </div>
    </form>
  );
}