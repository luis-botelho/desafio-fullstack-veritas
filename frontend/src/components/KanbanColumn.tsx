import { TaskCard } from "./TaskCard";

import type {
  Task,
  TaskStatus,
} from "../types/task";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export function KanbanColumn({
  title,
  status,
  tasks,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const columnTasks = tasks.filter(
    (task) => task.status === status,
  );

  return (
    <article className="kanban-column">
      <header>
        <h2>{title}</h2>
        <span>{columnTasks.length}</span>
      </header>

      <div>
        {columnTasks.length === 0 ? (
          <p>Nenhuma tarefa nesta coluna.</p>
        ) : (
          columnTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </article>
  );
}