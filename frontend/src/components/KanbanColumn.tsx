import {
  useState,
  type DragEvent,
} from "react";

import { TaskCard } from "./TaskCard";

import type {
  Task,
  TaskStatus,
} from "../types/task";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onOpenTask: (task: Task) => void;
  onDropTask: (
    taskId: string,
    status: TaskStatus,
  ) => void;
}

export function KanbanColumn({
  title,
  status,
  tasks,
  onOpenTask,
  onDropTask,
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
      className={`kanban-column ${
        isDragOver
          ? "kanban-column--drag-over"
          : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header>
        <h2>{title}</h2>
        <span>{columnTasks.length}</span>
      </header>

      <div className="kanban-column__tasks">
        {columnTasks.length === 0 ? (
          <p className="kanban-column__empty">
            Nenhuma tarefa nesta coluna.
          </p>
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