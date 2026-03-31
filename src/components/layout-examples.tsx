import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { useTheme } from "../context/theme-context"

export function LayoutExamples() {
  const { colors } = useTheme()

  return (
    <View style={styles.container}>
      {/* View Example */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          🟦 View - Container
        </Text>
        <View style={styles.row}>
          <View style={[styles.box, { backgroundColor: "#FF6B6B" }]} />
          <View style={[styles.box, { backgroundColor: "#4ECDC4" }]} />
          <View style={[styles.box, { backgroundColor: "#45B7D1" }]} />
        </View>
      </View>

      {/* Text Example */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          🟩 Text - Conteúdo
        </Text>
        <Text style={[styles.heading1, { color: colors.text }]}>
          Título Principal
        </Text>
        <Text style={[styles.bodyText, { color: colors.text }]}>
          Texto normal para conteúdo do aplicativo.
        </Text>
      </View>

      {/* Image Example */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          🍛 Image - Imagens
        </Text>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://picsum.photos/seed/react-native/200/150.jpg",
            }}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={[styles.imageCaption, { color: colors.text }]}>
            Imagem da internet com resizeMode="cover"
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: "https://picsum.photos/seed/mobile/100/100.jpg" }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
          <Text style={[styles.imageCaption, { color: colors.text }]}>
            Avatar circular 100x100px
          </Text>
        </View>
      </View>

      {/* Pressable Example */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          � Pressable - Interação
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.pressableButton,
            { backgroundColor: pressed ? colors.secondary : colors.primary },
          ]}
          onPress={() => console.log("Botão pressionado!")}
        >
          <Text style={styles.pressableText}>Pressione-me</Text>
        </Pressable>
      </View>

      {/* ScrollView Example */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          🟪 ScrollView - Rolagem
        </Text>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.scrollContent}>
            <Text style={[styles.scrollItem, { color: colors.text }]}>
              Item 1
            </Text>
            <Text style={[styles.scrollItem, { color: colors.text }]}>
              Item 2
            </Text>
            <Text style={[styles.scrollItem, { color: colors.text }]}>
              Item 3
            </Text>
            <Text style={[styles.scrollItem, { color: colors.text }]}>
              Item 4
            </Text>
            <Text style={[styles.scrollItem, { color: colors.text }]}>
              Item 5
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  box: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  heading1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  imageCaption: {
    fontSize: 14,
    textAlign: "center",
  },
  pressableButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  pressableText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollView: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  scrollContent: {
    padding: 16,
    gap: 8,
  },
  scrollItem: {
    fontSize: 16,
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 4,
  },
})
