import type { Task } from "../types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
}: TaskCardProps) {
  return (
    <article className="task-card">
      <div className="task-card__content">
        <h3>{task.title}</h3>

        {task.description && (
          <p>{task.description}</p>
        )}
      </div>

      <div className="task-card__actions">
        <button
          type="button"
          className="task-card__edit"
          onClick={() => {
            onEdit(task);
          }}
        >
          Editar
        </button>

        <button
          type="button"
          className="task-card__delete"
          onClick={() => {
            onDelete(task);
          }}
        >
          Excluir
        </button>
      </div>
    </article>
  );
}