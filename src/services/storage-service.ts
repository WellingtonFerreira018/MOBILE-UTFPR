import AsyncStorage from "@react-native-async-storage/async-storage";
import { analyticsService } from "./analytics-service";

// Prefixo padrão para evitar colisão de chaves
const PREFIX = "@my-app:";

export type Note = {
  id: string;
  text: string;
  createdAt: string;
};

const KEYS = {
  notes: `${PREFIX}notes`,
  userName: `${PREFIX}user:name`,
};

export const storageService = {
  // ─── Notas (objeto/array → JSON) ────────────────────────────────────────

  async saveNotes(notes: Note[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.notes, JSON.stringify(notes));
      analyticsService.logEvent("storage_save_notes", { count: notes.length });
    } catch (e) {
      analyticsService.logError(String(e), "storage_save_notes");
      throw new Error("Erro ao salvar notas");
    }
  },

  async getNotes(): Promise<Note[]> {
    try {
      const value = await AsyncStorage.getItem(KEYS.notes);
      if (value === null) return [];
      return JSON.parse(value) as Note[];
    } catch (e) {
      analyticsService.logError(String(e), "storage_get_notes");
      throw new Error("Erro ao carregar notas");
    }
  },

  async clearNotes(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.notes);
      analyticsService.logEvent("storage_clear_notes");
    } catch (e) {
      analyticsService.logError(String(e), "storage_clear_notes");
      throw new Error("Erro ao limpar notas");
    }
  },

  // ─── Nome do usuário (string simples) ───────────────────────────────────

  async saveUserName(name: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.userName, name);
    } catch (e) {
      throw new Error("Erro ao salvar nome");
    }
  },

  async getUserName(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.userName);
    } catch (e) {
      throw new Error("Erro ao carregar nome");
    }
  },
};
