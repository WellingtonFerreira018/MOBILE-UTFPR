import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useStorage } from "../hooks/use-storage";
import { Note } from "../services/storage-service";
import { analyticsService } from "../services/analytics-service";
import { Loading } from "../components/loading";
import { ErrorMessage } from "../components/error-message";
import { Button } from "../components/button";

export function StorageLessonScreen() {
  const { notes, userName, loading, error, addNote, removeNote, clearAllNotes, saveUserName } =
    useStorage();

  const [noteInput, setNoteInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    analyticsService.logScreenView("storage_lesson_screen");
  }, []);

  // Preenche o campo de nome com o valor já persistido
  useEffect(() => {
    if (userName) setNameInput(userName);
  }, [userName]);

  const handleAddNote = async (): Promise<void> => {
    if (!noteInput.trim()) return;
    await addNote(noteInput.trim());
    setNoteInput("");
  };

  const handleSaveName = async (): Promise<void> => {
    if (!nameInput.trim()) return;
    setSavingName(true);
    await saveUserName(nameInput.trim());
    setSavingName(false);
  };

  const handleRemoveNote = (note: Note): void => {
    Alert.alert("Remover nota", `Deseja remover: "${note.text}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => removeNote(note.id),
      },
    ]);
  };

  const handleClearAll = (): void => {
    Alert.alert("Limpar tudo", "Remover TODAS as notas salvas?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Limpar", style: "destructive", onPress: clearAllNotes },
    ]);
  };

  if (loading) {
    return <Loading message="Carregando dados do storage..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>💾 AsyncStorage</Text>
        <Text style={styles.subtitle}>Persistência Local de Dados</Text>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Seção 1: string simples */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                📝 setItem / getItem – String Simples
              </Text>
              <Text style={styles.hint}>
                Salva e recupera um valor de texto direto no AsyncStorage.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome..."
                value={nameInput}
                onChangeText={setNameInput}
                returnKeyType="done"
                onSubmitEditing={handleSaveName}
              />
              <Button
                title={savingName ? "Salvando..." : "Salvar nome"}
                onPress={handleSaveName}
                variant="primary"
                loading={savingName}
              />
              {userName ? (
                <View style={styles.savedBadge}>
                  <Text style={styles.savedBadgeText}>
                    ✅ Nome salvo: <Text style={styles.bold}>{userName}</Text>
                  </Text>
                  <Text style={styles.savedBadgeHint}>
                    Feche e reabra o app — o nome persiste!
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Seção 2: objeto/array JSON */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                🗂️ JSON.stringify / parse – Objetos
              </Text>
              <Text style={styles.hint}>
                Converte o array de notas em JSON para persistir no AsyncStorage.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Nova nota..."
                value={noteInput}
                onChangeText={setNoteInput}
                returnKeyType="done"
                onSubmitEditing={handleAddNote}
              />
              <Button title="Adicionar nota" onPress={handleAddNote} variant="secondary" />
            </View>

            {/* Contador + botão limpar */}
            {notes.length > 0 && (
              <View style={styles.notesHeader}>
                <Text style={styles.notesCount}>
                  {notes.length} nota{notes.length !== 1 ? "s" : ""} salva
                  {notes.length !== 1 ? "s" : ""}
                </Text>
                <TouchableOpacity onPress={handleClearAll}>
                  <Text style={styles.clearText}>Limpar tudo</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.noteCard}
            onLongPress={() => handleRemoveNote(item)}
            activeOpacity={0.7}
          >
            <View style={styles.noteBody}>
              <Text style={styles.noteText}>{item.text}</Text>
              <Text style={styles.noteDate}>{item.createdAt}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => handleRemoveNote(item)}
            >
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhuma nota salva ainda.</Text>
            <Text style={styles.emptyHint}>
              Adicione uma nota acima e feche o app.{"\n"}Ao voltar, os dados
              estarão aqui! 🎉
            </Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#5856D6",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  hint: {
    fontSize: 13,
    color: "#888",
    lineHeight: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#fafafa",
  },
  savedBadge: {
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
    padding: 10,
    gap: 2,
  },
  savedBadgeText: {
    fontSize: 14,
    color: "#2e7d32",
  },
  savedBadgeHint: {
    fontSize: 12,
    color: "#4caf50",
  },
  bold: {
    fontWeight: "bold",
  },
  notesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  notesCount: {
    fontSize: 13,
    color: "#555",
    fontWeight: "600",
  },
  clearText: {
    fontSize: 13,
    color: "#FF3B30",
    fontWeight: "600",
  },
  noteCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  noteBody: {
    flex: 1,
    gap: 4,
  },
  noteText: {
    fontSize: 15,
    color: "#222",
  },
  noteDate: {
    fontSize: 11,
    color: "#aaa",
  },
  removeBtn: {
    padding: 6,
    marginLeft: 8,
  },
  removeBtnText: {
    fontSize: 16,
    color: "#FF3B30",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "600",
  },
  emptyHint: {
    fontSize: 13,
    color: "#aaa",
    textAlign: "center",
    lineHeight: 20,
  },
});
