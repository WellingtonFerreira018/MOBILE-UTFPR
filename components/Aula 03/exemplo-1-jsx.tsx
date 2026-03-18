import { StyleSheet, Text, View } from "react-native"

/**
 * EXEMPLO 1:
 * Fundamentos do JSX
 * JSX permite escrever código que parece HTML dentro do JavaScript.
 * É uma sintaxe que facilita a criação de interfaces.
 */
export default function ExemploJSX() {
  const nome = "UTFPR"
  const ano = 2026
  const disciplina = "Desenvolvimento Mobile"

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📱 Exemplo 1: JSX</Text>

      <Text style={styles.texto}>Olá, {nome}!</Text>

      <Text style={styles.texto}>Ano: {ano}</Text>

      <Text style={styles.texto}>Disciplina: {disciplina}</Text>

      <Text style={styles.texto}>Cálculo: 2 + 2 = {2 + 2}</Text>

      <Text style={styles.destaque}>
        {ano > 2025 ? "Estamos no futuro! 🚀" : "Ainda não chegamos lá"}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 15,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  texto: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  destaque: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 10,
  },
})
