import { useEffect } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { Counter } from "../components/counter"
import { ThemeToggle } from "../components/theme-toggle"
import { useTheme } from "../context/theme-context"
import { analyticsService } from "../services/analytics-service"

export function StateLessonScreen() {
  const { colors } = useTheme()

  useEffect(() => {
    analyticsService.logScreenView("state_lesson_screen")
  }, [])

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        <Text style={[styles.mainTitle, { color: colors.text }]}>
          🎯 Gerenciamento de Estado
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          useState e Context API
        </Text>

        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            📌 Exemplo 1: useState
          </Text>
          <Text style={[styles.description, { color: colors.text }]}>
            O hook useState permite adicionar estado a componentes funcionais.
            Cada componente mantém seu próprio estado independente.
          </Text>
        </View>

        <Counter initialValue={0} step={1} />
        <Counter initialValue={10} step={5} />

        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            📌 Exemplo 2: Context API
          </Text>
          <Text style={[styles.description, { color: colors.text }]}>
            Context API permite compartilhar estado entre múltiplos componentes
            sem passar props manualmente em cada nível (prop drilling).
          </Text>
        </View>

        <ThemeToggle />

        <View style={[styles.conceptBox, { backgroundColor: colors.primary }]}>
          <Text style={styles.conceptTitle}>💡 Conceitos-chave</Text>
          <Text style={styles.conceptText}>
            • useState: Estado local do componente
          </Text>
          <Text style={styles.conceptText}>
            • Context: Estado global compartilhado
          </Text>
          <Text style={styles.conceptText}>• Provider: Fornece o contexto</Text>
          <Text style={styles.conceptText}>
            • useContext: Consome o contexto
          </Text>
        </View>

        <View
          style={[
            styles.codeExample,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.codeTitle, { color: colors.text }]}>
            📝 Código do useState:
          </Text>
          <Text style={[styles.code, { color: colors.text }]}>
            {`const [count, setCount] = useState(0);

const increment = () => {
  setCount(count + 1);
};`}
          </Text>
        </View>

        <View
          style={[
            styles.codeExample,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.codeTitle, { color: colors.text }]}>
            📝 Código do Context:
          </Text>
          <Text style={[styles.code, { color: colors.text }]}>
            {`const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const { theme } = useContext(ThemeContext);`}
          </Text>
        </View>

        <View style={[styles.footer, { backgroundColor: colors.card }]}>
          <Text style={[styles.footerText, { color: colors.text }]}>
            UTFPR - Desenvolvimento Mobile 2026
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 60,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    opacity: 0.8,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  conceptBox: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  conceptTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
  },
  conceptText: {
    fontSize: 14,
    color: "white",
    marginBottom: 6,
    lineHeight: 20,
  },
  codeExample: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  codeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  code: {
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
    marginBottom: 40,
    padding: 15,
    borderRadius: 8,
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
  },
})
