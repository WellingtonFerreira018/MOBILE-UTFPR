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
import { useTasks } from "../hooks/use-tasks";
import { Task } from "../services/sqlite-service";
import { analyticsService } from "../services/analytics-service";
import { Loading } from "../components/loading";
import { ErrorMessage } from "../components/error-message";
import { Button } from "../components/button";

type FilterTab = { key: "all" | "pending" | "done"; label: string };

const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendentes" },
  { key: "done", label: "Concluídas" },
];

export function SqliteLessonScreen() {
  const {
    loading,
    error,
    filter,
    setFilter,
    filteredTasks,
    addTask,
    toggleTask,
    deleteTask,
    totalCount,
    doneCount,
  } = useTasks();

  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    analyticsService.logScreenView("sqlite_lesson_screen");
  }, []);

  const handleAdd = async (): Promise<void> => {
    const title = input.trim();
    if (!title) return;
    setAdding(true);
    await addTask(title);
    setInput("");
    setAdding(false);
  };

  const handleDelete = (task: Task): void => {
    Alert.alert("Remover tarefa", `Remover "${task.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => deleteTask(task.id),
      },
    ]);
  };

  if (loading) {
    return <Loading message="Abrindo banco de dados..." />;
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
        <Text style={styles.title}>🗄️ SQLite</Text>
        <Text style={styles.subtitle}>Banco de dados local estruturado</Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: "#FF9500" }]}>
              {totalCount - doneCount}
            </Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: "#34C759" }]}>
              {doneCount}
            </Text>
            <Text style={styles.statLabel}>Concluídas</Text>
          </View>
        </View>
      </View>

      {/* Formulário de inserção */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nova tarefa..."
          value={input}
          onChangeText={setInput}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
          editable={!adding}
        />
        <Button
          title="+ Adicionar"
          onPress={handleAdd}
          variant="primary"
          loading={adding}
        />
      </View>

      {/* Abas de filtro */}
      <View style={styles.tabs}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, filter === tab.key && styles.tabActive]}
            onPress={() => setFilter(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                filter === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de tarefas */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            {/* Checkbox */}
            <TouchableOpacity
              style={[styles.checkbox, item.done === 1 && styles.checkboxDone]}
              onPress={() => toggleTask(item.id, item.done === 0)}
            >
              {item.done === 1 && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            {/* Conteúdo */}
            <View style={styles.taskBody}>
              <Text
                style={[
                  styles.taskTitle,
                  item.done === 1 && styles.taskTitleDone,
                ]}
              >
                {item.title}
              </Text>
              <Text style={styles.taskDate}>
                ID: {item.id} · {item.created_at?.slice(0, 16).replace("T", " ")}
              </Text>
            </View>

            {/* Botão remover */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item)}
            >
              <Text style={styles.deleteBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhuma tarefa aqui.</Text>
            <Text style={styles.emptyHint}>
              Adicione uma tarefa acima.{"\n"}Feche o app e reabra — os dados
              persistem no banco SQLite! 🗄️
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
    backgroundColor: "#f0f4f8",
  },
  header: {
    backgroundColor: "#1a7f4b",
    padding: 20,
    paddingTop: 60,
    gap: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  stats: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    gap: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  form: {
    backgroundColor: "white",
    padding: 16,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#fafafa",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#1a7f4b",
  },
  tabText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#1a7f4b",
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  taskCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: {
    backgroundColor: "#34C759",
    borderColor: "#34C759",
  },
  checkmark: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  taskBody: {
    flex: 1,
    gap: 3,
  },
  taskTitle: {
    fontSize: 15,
    color: "#222",
  },
  taskTitleDone: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  taskDate: {
    fontSize: 11,
    color: "#bbb",
  },
  deleteBtn: {
    padding: 6,
  },
  deleteBtnText: {
    fontSize: 16,
    color: "#FF3B30",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
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
