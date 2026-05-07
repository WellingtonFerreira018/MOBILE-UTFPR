import { useState, useEffect, useCallback } from "react";
import { sqliteService, Task } from "../services/sqlite-service";

type Filter = "all" | "pending" | "done";

type UseTasksState = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
};

type UseTasksReturn = UseTasksState & {
  filter: Filter;
  setFilter: (f: Filter) => void;
  filteredTasks: Task[];
  addTask: (title: string) => Promise<void>;
  toggleTask: (id: number, done: boolean) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  totalCount: number;
  doneCount: number;
};

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  // Carrega todas as tarefas do banco na montagem do componente
  const loadTasks = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const rows = await sqliteService.getTasks();
      setTasks(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = useCallback(
    async (title: string): Promise<void> => {
      await sqliteService.addTask(title);
      await loadTasks(); // re-select para manter consistência com o banco
    },
    [loadTasks]
  );

  const toggleTask = useCallback(
    async (id: number, done: boolean): Promise<void> => {
      // Atualização otimista: reflete imediatamente na UI
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: done ? 1 : 0 } : t))
      );
      try {
        await sqliteService.toggleTask(id, done);
      } catch (e) {
        // Reverte em caso de erro
        await loadTasks();
        setError(e instanceof Error ? e.message : "Erro ao atualizar");
      }
    },
    [loadTasks]
  );

  const deleteTask = useCallback(
    async (id: number): Promise<void> => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      try {
        await sqliteService.deleteTask(id);
      } catch (e) {
        await loadTasks();
        setError(e instanceof Error ? e.message : "Erro ao remover");
      }
    },
    [loadTasks]
  );

  const filteredTasks =
    filter === "pending"
      ? tasks.filter((t) => t.done === 0)
      : filter === "done"
      ? tasks.filter((t) => t.done === 1)
      : tasks;

  return {
    tasks,
    loading,
    error,
    filter,
    setFilter,
    filteredTasks,
    addTask,
    toggleTask,
    deleteTask,
    totalCount: tasks.length,
    doneCount: tasks.filter((t) => t.done === 1).length,
  };
}
