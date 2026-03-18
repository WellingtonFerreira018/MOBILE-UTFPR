import { StyleSheet, Text, View } from "react-native"

/**
 * EXEMPLO 2: Componentes Funcionais
 *
 * Componentes são blocos reutilizáveis de código.
 * Componentes funcionais são funções que retornam JSX.
 */

function Cabecalho() {
  return (
    <View style={styles.cabecalho}>
      <Text style={styles.cabecalhoTexto}>🎓 Cabeçalho</Text>
    </View>
  )
}

function Conteudo() {
  return (
    <View style={styles.conteudo}>
      <Text style={styles.conteudoTexto}>Este é um componente de conteúdo</Text>
    </View>
  )
}

function Rodape() {
  return (
    <View style={styles.rodape}>
      <Text style={styles.rodapeTexto}>© 2026 - Rodapé UTFPR</Text>
    </View>
  )
}

export default function ExemploComponentes() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📦 Exemplo 2: Componentes Funcionais</Text>

      <Cabecalho />
      <Conteudo />
      <Rodape />

      <Text style={styles.explicacao}>
        ✨ Cada seção acima é um componente separado!
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
  cabecalho: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  cabecalhoTexto: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  conteudo: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  conteudoTexto: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  rodape: {
    backgroundColor: "#FF9800",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  rodapeTexto: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  explicacao: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginTop: 10,
    textAlign: "center",
  },
})
