import "./App.css";

import { useTasks } from "./hooks/useTasks";

import type { TaskStatus } from "./types/task";

interface KanbanColumn {
  title: string;
  status: TaskStatus;
}

const columns: KanbanColumn[] = [
  {
    title: "A Fazer",
    status: "todo",
  },
  {
    title: "Em Progresso",
    status: "in_progress",
  },
  {
    title: "Concluídas",
    status: "done",
  },
];

function App() {
  const {
    tasks,
    isLoading,
    error,
    loadTasks,
    clearError,
  } = useTasks();

  if (isLoading) {
    return (
      <main>
        <p>Carregando tarefas...</p>
      </main>
    );
  }

  return (
    <main>
      <header>
        <div>
          <p>Desafio Full Stack Veritas</p>
          <h1>Mini Kanban</h1>
        </div>

        <button type="button">
          Nova tarefa
        </button>
      </header>

      {error && (
        <section role="alert">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => {
              clearError();
              void loadTasks();
            }}
          >
            Tentar novamente
          </button>
        </section>
      )}

      <section aria-label="Quadro Kanban">
        {columns.map((column) => {
          const columnTasks = tasks.filter(
            (task) => task.status === column.status,
          );

          return (
            <article key={column.status}>
              <header>
                <h2>{column.title}</h2>
                <span>{columnTasks.length}</span>
              </header>

              <div>
                {columnTasks.length === 0 ? (
                  <p>Nenhuma tarefa nesta coluna.</p>
                ) : (
                  columnTasks.map((task) => (
                    <article key={task.id}>
                      <h3>{task.title}</h3>

                      {task.description && (
                        <p>{task.description}</p>
                      )}
                    </article>
                  ))
                )}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default App;