import { useState, useEffect, useCallback } from "react";
import { storageService, Note } from "../services/storage-service";

type UseStorageState = {
  notes: Note[];
  userName: string;
  loading: boolean;
  error: string | null;
};

type UseStorageReturn = UseStorageState & {
  addNote: (text: string) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
  clearAllNotes: () => Promise<void>;
  saveUserName: (name: string) => Promise<void>;
};

export function useStorage(): UseStorageReturn {
  const [state, setState] = useState<UseStorageState>({
    notes: [],
    userName: "",
    loading: true,
    error: null,
  });

  // Hidratação inicial: carrega dados persistidos ao montar
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const [notes, userName] = await Promise.all([
          storageService.getNotes(),
          storageService.getUserName(),
        ]);
        setState({
          notes,
          userName: userName ?? "",
          loading: false,
          error: null,
        });
      } catch (e) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: e instanceof Error ? e.message : "Erro ao carregar dados",
        }));
      }
    };

    loadData();
  }, []);

  const addNote = useCallback(async (text: string): Promise<void> => {
    const newNote: Note = {
      id: Date.now().toString(),
      text,
      createdAt: new Date().toLocaleString("pt-BR"),
    };

    setState((prev) => {
      const updated = [newNote, ...prev.notes];
      storageService.saveNotes(updated).catch((e) =>
        setState((s) => ({ ...s, error: e.message }))
      );
      return { ...prev, notes: updated };
    });
  }, []);

  const removeNote = useCallback(async (id: string): Promise<void> => {
    setState((prev) => {
      const updated = prev.notes.filter((n) => n.id !== id);
      storageService.saveNotes(updated).catch((e) =>
        setState((s) => ({ ...s, error: e.message }))
      );
      return { ...prev, notes: updated };
    });
  }, []);

  const clearAllNotes = useCallback(async (): Promise<void> => {
    try {
      await storageService.clearNotes();
      setState((prev) => ({ ...prev, notes: [] }));
    } catch (e) {
      setState((prev) => ({
        ...prev,
        error: e instanceof Error ? e.message : "Erro ao limpar notas",
      }));
    }
  }, []);

  const saveUserName = useCallback(async (name: string): Promise<void> => {
    try {
      await storageService.saveUserName(name);
      setState((prev) => ({ ...prev, userName: name }));
    } catch (e) {
      setState((prev) => ({
        ...prev,
        error: e instanceof Error ? e.message : "Erro ao salvar nome",
      }));
    }
  }, []);

  return {
    ...state,
    addNote,
    removeNote,
    clearAllNotes,
    saveUserName,
  };
}
