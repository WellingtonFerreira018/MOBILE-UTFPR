import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../context/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Tema Atual: {theme === "light" ? "☀️ Claro" : "🌙 Escuro"}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.toggleButton, { backgroundColor: colors.primary }]}
        onPress={toggleTheme}
        activeOpacity={0.8}
      >
        <Text style={styles.toggleIcon}>
          {theme === "light" ? "🌙" : "☀️"}
        </Text>
        <Text style={styles.toggleText}>
          Mudar para {theme === "light" ? "Escuro" : "Claro"}
        </Text>
      </TouchableOpacity>

      <View style={[styles.infoBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>
          🎨 Cores do Tema Atual:
        </Text>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: colors.background }]} />
          <Text style={[styles.colorLabel, { color: colors.text }]}>Background</Text>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: colors.text }]} />
          <Text style={[styles.colorLabel, { color: colors.text }]}>Text</Text>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: colors.primary }]} />
          <Text style={[styles.colorLabel, { color: colors.text }]}>Primary</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  toggleIcon: {
    fontSize: 24,
  },
  toggleText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  colorLabel: {
    fontSize: 14,
  },
});
