import { useEffect } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { FlexboxDemo } from "../components/flexbox-demo"
import { LayoutExamples } from "../components/layout-examples"
import { useTheme } from "../context/theme-context"
import { analyticsService } from "../services/analytics-service"

export function LayoutLessonScreen() {
  const { colors } = useTheme()

  useEffect(() => {
    analyticsService.logScreenView("layout_lesson_screen")
  }, [])

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        <Text style={[styles.mainTitle, { color: colors.text }]}>
          🎯 Layout Mobile com Flexbox
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Componentes Básicos e Estruturação Visual
        </Text>

        {/* Introdução ao Layout Mobile */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            📱 O que é Layout Mobile?
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            Layout é a organização visual dos elementos na tela. No React
            Native, usamos Flexbox para criar interfaces responsivas e bem
            estruturadas.
          </Text>
          <View
            style={[styles.highlightBox, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.highlightText}>
              💡 Layout bem estruturado melhora usabilidade e experiência do
              usuário
            </Text>
          </View>
        </View>

        {/* Flexbox Demo */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            🎨 Demonstração Interativa do Flexbox
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            Experimente as propriedades do Flexbox para entender como funcionam:
          </Text>
          <FlexboxDemo />
        </View>

        {/* Componentes Básicos */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            🧩 Componentes Básicos do React Native
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            Interfaces são compostas por poucos componentes reutilizáveis:
          </Text>
          <LayoutExamples />
        </View>

        {/* Boas Práticas */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            ✨ Boas Práticas de Layout
          </Text>
          <View style={styles.practicesList}>
            <Text style={[styles.practiceItem, { color: colors.text }]}>
              • Evitar layouts complexos desnecessários
            </Text>
            <Text style={[styles.practiceItem, { color: colors.text }]}>
              • Usar flex ao invés de valores fixos
            </Text>
            <Text style={[styles.practiceItem, { color: colors.text }]}>
              • Manter consistência visual
            </Text>
            <Text style={[styles.practiceItem, { color: colors.text }]}>
              • Separar layout de lógica
            </Text>
            <Text style={[styles.practiceItem, { color: colors.text }]}>
              • Pensar em responsividade
            </Text>
          </View>
        </View>

        {/* Estrutura Típica */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            🏗️ Estrutura Típica de Tela
          </Text>
          <View
            style={[
              styles.codeExample,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.codeTitle, { color: colors.text }]}>
              📝 Estrutura Recomendada:
            </Text>
            <Text style={[styles.code, { color: colors.text }]}>
              {`<View style={{ flex: 1 }}>
  {/* Header */}
  <View style={styles.header}>
    <Text>Título</Text>
  </View>
  
  {/* Content */}
  <ScrollView style={styles.content}>
    {/* Conteúdo principal */}
  </ScrollView>
  
  {/* Footer */}
  <View style={styles.footer}>
    <Text>Rodapé</Text>
  </View>
</View>`}
            </Text>
          </View>
        </View>

        {/* Exemplo Prático */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            🎯 Exemplo Prático: Tela de Perfil
          </Text>
          <View
            style={[
              styles.profileExample,
              { backgroundColor: colors.background },
            ]}
          >
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <View
                style={[styles.avatar, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.avatarText}>👤</Text>
              </View>
              <Text style={[styles.profileName, { color: colors.text }]}>
                João Silva
              </Text>
            </View>

            {/* Info Cards */}
            <View style={styles.infoContainer}>
              <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                <Text style={[styles.infoLabel, { color: colors.text }]}>
                  📧 Email
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  joao@exemplo.com
                </Text>
              </View>
              <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                <Text style={[styles.infoLabel, { color: colors.text }]}>
                  📱 Telefone
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  (11) 99999-9999
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsContainer}>
              <View
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.actionButtonText}>Editar Perfil</Text>
              </View>
              <View
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Text style={styles.actionButtonText}>Configurações</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Revisão */}
        <View style={[styles.conceptBox, { backgroundColor: colors.primary }]}>
          <Text style={styles.conceptTitle}>📚 Revisão da Aula</Text>
          <Text style={styles.conceptText}>
            • Flexbox controla posicionamento e distribuição
          </Text>
          <Text style={styles.conceptText}>
            • View agrupa e estrutura elementos
          </Text>
          <Text style={styles.conceptText}>• Text exibe conteúdo textual</Text>
          <Text style={styles.conceptText}>
            • Pressable detecta interações do usuário
          </Text>
          <Text style={styles.conceptText}>
            • ScrollView permite rolagem de conteúdo
          </Text>
          <Text style={styles.conceptText}>
            • Layout bem estruturado melhora UX
          </Text>
        </View>

        {/* Footer */}
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
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  highlightBox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  highlightText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  practicesList: {
    gap: 8,
  },
  practiceItem: {
    fontSize: 16,
    lineHeight: 24,
  },
  codeExample: {
    padding: 16,
    borderRadius: 8,
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
  profileExample: {
    padding: 20,
    borderRadius: 8,
    gap: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 32,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  infoContainer: {
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
    fontSize: 16,
    color: "white",
    marginBottom: 6,
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
