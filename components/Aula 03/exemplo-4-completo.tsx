import { View, Text, StyleSheet, ScrollView } from "react-native";

/**
 * EXEMPLO 4: Exemplo Completo
 * 
 * Combinando JSX + Componentes + Props em um exemplo prático
 * de uma lista de tarefas simples.
 */

type TarefaProps = {
  titulo: string;
  concluida: boolean;
  prioridade: "alta" | "media" | "baixa";
};

function Tarefa({ titulo, concluida, prioridade }: TarefaProps) {
  const corPrioridade = {
    alta: "#F44336",
    media: "#FF9800",
    baixa: "#4CAF50",
  };

  const iconePrioridade = {
    alta: "🔴",
    media: "🟡",
    baixa: "🟢",
  };

  return (
    <View style={styles.tarefa}>
      <View style={styles.tarefaHeader}>
        <Text style={styles.prioridadeIcone}>
          {iconePrioridade[prioridade]}
        </Text>
        <Text 
          style={[
            styles.tarefaTitulo,
            concluida && styles.tarefaConcluida
          ]}
        >
          {titulo}
        </Text>
      </View>
      <View 
        style={[
          styles.prioridadeBarra,
          { backgroundColor: corPrioridade[prioridade] }
        ]} 
      />
      <Text style={styles.tarefaStatus}>
        {concluida ? "✅ Concluída" : "⏳ Pendente"}
      </Text>
    </View>
  );
}

type EstatisticasProps = {
  total: number;
  concluidas: number;
};

function Estatisticas({ total, concluidas }: EstatisticasProps) {
  const percentual = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  return (
    <View style={styles.estatisticas}>
      <Text style={styles.estatisticasTitulo}>📊 Estatísticas</Text>
      <Text style={styles.estatisticasTexto}>
        Total: {total} tarefas
      </Text>
      <Text style={styles.estatisticasTexto}>
        Concluídas: {concluidas} ({percentual}%)
      </Text>
      <Text style={styles.estatisticasTexto}>
        Pendentes: {total - concluidas}
      </Text>
    </View>
  );
}

export default function ExemploCompleto() {
  const tarefas = [
    { titulo: "Estudar React Native", concluida: true, prioridade: "alta" as const },
    { titulo: "Fazer exercícios de JSX", concluida: true, prioridade: "alta" as const },
    { titulo: "Criar componentes", concluida: false, prioridade: "media" as const },
    { titulo: "Praticar Props", concluida: false, prioridade: "media" as const },
    { titulo: "Revisar conteúdo", concluida: false, prioridade: "baixa" as const },
  ];

  const totalTarefas = tarefas.length;
  const tarefasConcluidas = tarefas.filter(t => t.concluida).length;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🎯 Exemplo 4: Aplicação Completa</Text>
      
      <Estatisticas total={totalTarefas} concluidas={tarefasConcluidas} />
      
      <Text style={styles.subtitulo}>Lista de Tarefas:</Text>
      
      {tarefas.map((tarefa, index) => (
        <Tarefa
          key={index}
          titulo={tarefa.titulo}
          concluida={tarefa.concluida}
          prioridade={tarefa.prioridade}
        />
      ))}
    </View>
  );
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
  estatisticas: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#2196F3",
  },
  estatisticasTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 10,
  },
  estatisticasTexto: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  tarefa: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tarefaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  prioridadeIcone: {
    fontSize: 16,
    marginRight: 8,
  },
  tarefaTitulo: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  tarefaConcluida: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  prioridadeBarra: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  tarefaStatus: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
});
