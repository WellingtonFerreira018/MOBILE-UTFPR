import { StyleSheet, Text, View } from "react-native"

/**
 * EXEMPLO 3: Props (Propriedades)
 *
 * Props permitem passar dados de um componente pai para um componente filho.
 * São como parâmetros de função.
 */

type CartaoAlunoProps = {
  nome: string
  curso: string
  semestre: number
}

function CartaoAluno({ nome, curso, semestre }: CartaoAlunoProps) {
  return (
    <View style={styles.cartao}>
      <Text style={styles.cartaoNome}>👤 {nome}</Text>
      <Text style={styles.cartaoInfo}>Curso: {curso}</Text>
      <Text style={styles.cartaoInfo}>Semestre: {semestre}º</Text>
    </View>
  )
}

type BotaoProps = {
  texto: string
  cor: string
}

function Botao({ texto, cor }: BotaoProps) {
  return (
    <View style={[styles.botao, { backgroundColor: cor }]}>
      <Text style={styles.botaoTexto}>{texto}</Text>
    </View>
  )
}

type MensagemProps = {
  titulo: string
  descricao: string
  icone?: string
}

function Mensagem({ titulo, descricao, icone = "📌" }: MensagemProps) {
  return (
    <View style={styles.mensagem}>
      <Text style={styles.mensagemTitulo}>
        {icone} {titulo}
      </Text>
      <Text style={styles.mensagemDescricao}>{descricao}</Text>
    </View>
  )
}

export default function ExemploProps() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🎯 Exemplo 3: Props</Text>

      <Text style={styles.subtitulo}>Cartões de Alunos:</Text>
      <CartaoAluno
        nome="João Silva"
        curso="Engenharia de Software"
        semestre={5}
      />
      <CartaoAluno
        nome="Maria Santos"
        curso="Ciência da Computação"
        semestre={3}
      />

      <Text style={styles.subtitulo}>Botões com cores diferentes:</Text>
      <Botao texto="Salvar" cor="#4CAF50" />
      <Botao texto="Cancelar" cor="#F44336" />
      <Botao texto="Editar" cor="#2196F3" />

      <Text style={styles.subtitulo}>Mensagens:</Text>
      <Mensagem titulo="Bem-vindo" descricao="Este é um exemplo de props" />
      <Mensagem
        titulo="Atenção"
        descricao="Props com valor padrão (icone)"
        icone="⚠️"
      />
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
  subtitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#555",
  },
  cartao: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#9C27B0",
  },
  cartaoNome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  cartaoInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  botao: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  botaoTexto: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  mensagem: {
    backgroundColor: "#FFF9C4",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#FBC02D",
  },
  mensagemTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  mensagemDescricao: {
    fontSize: 14,
    color: "#666",
  },
})
