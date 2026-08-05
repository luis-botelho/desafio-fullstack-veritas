import {
  useRef,
  type DragEvent,
  type KeyboardEvent,
} from "react";

import "./TaskCard.css";

import type { Task } from "../../types/task";

interface TaskCardProps {
  task: Task;
  onOpen: (task: Task) => void;
}

export function TaskCard({
  task,
  onOpen,
}: TaskCardProps) {
  const wasDragged = useRef(false);

  function handleDragStart(
    event: DragEvent<HTMLElement>,
  ) {
    wasDragged.current = true;

    event.dataTransfer.setData(
      "text/plain",
      task.id,
    );

    event.dataTransfer.effectAllowed = "move";

    event.currentTarget.classList.add(
      "task-card--dragging",
    );
  }

  function handleDragEnd(
    event: DragEvent<HTMLElement>,
  ) {
    event.currentTarget.classList.remove(
      "task-card--dragging",
    );

    window.setTimeout(() => {
      wasDragged.current = false;
    }, 0);
  }

  function handleOpen() {
    if (wasDragged.current) {
      return;
    }

    onOpen(task);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLElement>,
  ) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      onOpen(task);
    }
  }

  return (
    <article
      className="task-card"
      role="button"
      tabIndex={0}
      draggable
      aria-label={`Abrir tarefa: ${task.title}`}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-card__content">
        <h3>{task.title}</h3>

        {task.description && (
          <p>{task.description}</p>
        )}
      </div>
    </article>
  );
}
