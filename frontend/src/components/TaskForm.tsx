import { useState } from "react";

import type {
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "../types/task";

interface TaskFormProps {
  task?: Task;
  isSubmitting: boolean;
  onSubmit: (
    input: UpdateTaskInput,
  ) => Promise<boolean>;
  onCancel: () => void;
}

export function TaskForm({
  task,
  isSubmitting,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(
    task?.description ?? "",
  );
  const [status, setStatus] = useState<TaskStatus>(
    task?.status ?? "todo",
  );
  const [validationError, setValidationError] = useState<
    string | null
  >(null);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setValidationError("Informe o título da tarefa.");
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
      setStatus("todo");
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
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
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          placeholder="Ex.: Implementar tela inicial"
          autoFocus
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
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          placeholder="Detalhes da tarefa"
          rows={4}
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
            setStatus(event.target.value as TaskStatus);
          }}
        >
          <option value="todo">A Fazer</option>
          <option value="in_progress">
            Em Progresso
          </option>
          <option value="done">Concluídas</option>
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