import * as SQLite from "expo-sqlite";
import { analyticsService } from "./analytics-service";

// ─── Tipos ──────────────────────────────────────────────────────────────────

export type Task = {
  id: number;
  title: string;
  done: number; // 0 = pendente | 1 = concluída
  created_at: string;
};

// ─── Conexão singleton ──────────────────────────────────────────────────────

let db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync("tasks.db");

    // CREATE TABLE – roda uma única vez (IF NOT EXISTS)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        title      TEXT    NOT NULL,
        done       INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    analyticsService.logEvent("sqlite_db_opened");
  }
  return db;
}

// ─── Service ────────────────────────────────────────────────────────────────

export const sqliteService = {
  // SELECT * FROM tasks
  async getTasks(): Promise<Task[]> {
    try {
      const database = await getDb();
      const rows = await database.getAllAsync<Task>(
        "SELECT * FROM tasks ORDER BY id DESC;"
      );
      analyticsService.logEvent("sqlite_get_tasks", { count: rows.length });
      return rows;
    } catch (e) {
      analyticsService.logError(String(e), "sqlite_get_tasks");
      throw new Error("Erro ao buscar tarefas");
    }
  },

  // INSERT INTO tasks
  async addTask(title: string): Promise<number> {
    try {
      const database = await getDb();
      const result = await database.runAsync(
        "INSERT INTO tasks (title) VALUES (?);",
        title
      );
      analyticsService.logEvent("sqlite_add_task", {
        id: result.lastInsertRowId,
      });
      return result.lastInsertRowId;
    } catch (e) {
      analyticsService.logError(String(e), "sqlite_add_task");
      throw new Error("Erro ao adicionar tarefa");
    }
  },

  // UPDATE tasks SET done = ?
  async toggleTask(id: number, done: boolean): Promise<void> {
    try {
      const database = await getDb();
      await database.runAsync(
        "UPDATE tasks SET done = ? WHERE id = ?;",
        done ? 1 : 0,
        id
      );
      analyticsService.logEvent("sqlite_toggle_task", { id, done });
    } catch (e) {
      analyticsService.logError(String(e), "sqlite_toggle_task");
      throw new Error("Erro ao atualizar tarefa");
    }
  },

  // DELETE FROM tasks WHERE id = ?
  async deleteTask(id: number): Promise<void> {
    try {
      const database = await getDb();
      await database.runAsync("DELETE FROM tasks WHERE id = ?;", id);
      analyticsService.logEvent("sqlite_delete_task", { id });
    } catch (e) {
      analyticsService.logError(String(e), "sqlite_delete_task");
      throw new Error("Erro ao remover tarefa");
    }
  },
};
