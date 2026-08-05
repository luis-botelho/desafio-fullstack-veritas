import {
  useState,
  type DragEvent,
} from "react";

import "./KanbanColumn.css";

import { TaskCard } from "../TaskCard/TaskCard";

import type {
  Task,
  TaskStatus,
} from "../../types/task";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onOpenTask: (task: Task) => void;
  onDropTask: (
    taskId: string,
    status: TaskStatus,
  ) => void;
  onCreateTask: (
    status: TaskStatus,
  ) => void;
}

const emptyMessages: Record<TaskStatus, string> = {
  todo: "Nenhuma tarefa pendente por aqui.",
  in_progress: "Nada em andamento no momento.",
  done: "Nenhuma tarefa concluída ainda.",
};

export function KanbanColumn({
  title,
  status,
  tasks,
  onOpenTask,
  onDropTask,
  onCreateTask
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] =
    useState(false);

  const columnTasks = tasks.filter(
    (task) => task.status === status,
  );

  function handleDragOver(
    event: DragEvent<HTMLElement>,
  ) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  }

  function handleDragLeave(
    event: DragEvent<HTMLElement>,
  ) {
    const nextTarget = event.relatedTarget;

    if (
      nextTarget instanceof Node &&
      event.currentTarget.contains(nextTarget)
    ) {
      return;
    }

    setIsDragOver(false);
  }

  function handleDrop(
    event: DragEvent<HTMLElement>,
  ) {
    event.preventDefault();

    const taskId = event.dataTransfer.getData(
      "text/plain",
    );

    setIsDragOver(false);

    if (taskId) {
      onDropTask(taskId, status);
    }
  }

  return (
    <article
      className={`kanban-column kanban-column--${status} ${isDragOver
          ? "kanban-column--drag-over"
          : ""
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header>
        <div className="kanban-column__title">
          <span
            className="kanban-column__indicator"
            aria-hidden="true"
          />

          <h2>{title}</h2>
        </div>

        <span className="kanban-column__count">
          {columnTasks.length}
        </span>
      </header>

      <div className="kanban-column__tasks">
        {columnTasks.length === 0 ? (
          <div className="kanban-column__empty">
            <button
              type="button"
              className="kanban-column__add-button"
              aria-label={`Criar tarefa em ${title}`}
              title={`Criar tarefa em ${title}`}
              onClick={() => {
                onCreateTask(status);
              }}
            >
              ＋
            </button>

            <p>{emptyMessages[status]}</p>
          </div>
        ) : (
          columnTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onOpen={onOpenTask}
            />
          ))
        )}
      </div>
    </article>
  );
}