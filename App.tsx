import { StatusBar } from "expo-status-bar"
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native"
import ExemploJSX from "./components/Aula 03/exemplo-1-jsx"
import ExemploComponentes from "./components/Aula 03/exemplo-2-componentes"
import ExemploProps from "./components/Aula 03/exemplo-3-props"
import ExemploCompleto from "./components/Aula 03/exemplo-4-completo"

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.titulo}>🎓 Fundamentos do React Native</Text>
          <Text style={styles.subtitulo}>
            JSX, Componentes Funcionais e Props
          </Text>

          <ExemploJSX />
          <ExemploComponentes />
          <ExemploProps />
          <ExemploCompleto />

          <View style={styles.rodape}>
            <Text style={styles.rodapeTexto}>
              UTFPR - Desenvolvimento Mobile 2026
            </Text>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  rodape: {
    marginTop: 20,
    marginBottom: 40,
    padding: 15,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  rodapeTexto: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
  },
})
