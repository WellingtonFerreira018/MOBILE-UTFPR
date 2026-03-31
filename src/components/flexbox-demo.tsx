import { useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useTheme } from "../context/theme-context"

type FlexDirection = "row" | "column"
type JustifyContent =
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around"
  | "space-evenly"
type AlignItems = "flex-start" | "center" | "flex-end" | "stretch"

export function FlexboxDemo() {
  const { colors } = useTheme()
  const [flexDirection, setFlexDirection] = useState<FlexDirection>("row")
  const [justifyContent, setJustifyContent] =
    useState<JustifyContent>("flex-start")
  const [alignItems, setAlignItems] = useState<AlignItems>("flex-start")

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        🎨 Demonstração Flexbox
      </Text>

      {/* Controls */}
      <View style={[styles.controls, { backgroundColor: colors.background }]}>
        <View style={styles.controlGroup}>
          <Text style={[styles.controlLabel, { color: colors.text }]}>
            flexDirection:
          </Text>
          <View style={styles.buttonGroup}>
            <Pressable
              style={[
                styles.button,
                flexDirection === "row" && styles.buttonActive,
                {
                  backgroundColor:
                    flexDirection === "row" ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setFlexDirection("row")}
            >
              <Text
                style={[
                  styles.buttonText,
                  flexDirection === "row" && styles.buttonTextActive,
                ]}
              >
                row
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                flexDirection === "column" && styles.buttonActive,
                {
                  backgroundColor:
                    flexDirection === "column" ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setFlexDirection("column")}
            >
              <Text
                style={[
                  styles.buttonText,
                  flexDirection === "column" && styles.buttonTextActive,
                ]}
              >
                column
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.controlGroup}>
          <Text style={[styles.controlLabel, { color: colors.text }]}>
            justifyContent:
          </Text>
          <View style={styles.buttonGroup}>
            {["flex-start", "center", "space-between", "space-around"].map(
              (value) => (
                <Pressable
                  key={value}
                  style={[
                    styles.buttonSmall,
                    justifyContent === value && styles.buttonActive,
                    {
                      backgroundColor:
                        justifyContent === value
                          ? colors.primary
                          : colors.border,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setJustifyContent(value as JustifyContent)}
                >
                  <Text
                    style={[
                      styles.buttonTextSmall,
                      justifyContent === value && styles.buttonTextActive,
                    ]}
                  >
                    {value.replace("-", "\n")}
                  </Text>
                </Pressable>
              ),
            )}
          </View>
        </View>

        <View style={styles.controlGroup}>
          <Text style={[styles.controlLabel, { color: colors.text }]}>
            alignItems:
          </Text>
          <View style={styles.buttonGroup}>
            {["flex-start", "center", "flex-end"].map((value) => (
              <Pressable
                key={value}
                style={[
                  styles.buttonSmall,
                  alignItems === value && styles.buttonActive,
                  {
                    backgroundColor:
                      alignItems === value ? colors.primary : colors.border,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setAlignItems(value as AlignItems)}
              >
                <Text
                  style={[
                    styles.buttonTextSmall,
                    alignItems === value && styles.buttonTextActive,
                  ]}
                >
                  {value.replace("-", "\n")}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Demo Area */}
      <View style={[styles.demoArea, { backgroundColor: colors.background }]}>
        <Text style={[styles.demoLabel, { color: colors.text }]}>
          Resultado:
        </Text>
        <View
          style={[
            styles.demoBox,
            {
              flexDirection,
              justifyContent,
              alignItems,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={[styles.box, { backgroundColor: "#FF6B6B" }]}>
            <Text style={styles.boxText}>1</Text>
          </View>
          <View style={[styles.box, { backgroundColor: "#4ECDC4" }]}>
            <Text style={styles.boxText}>2</Text>
          </View>
          <View style={[styles.box, { backgroundColor: "#45B7D1" }]}>
            <Text style={styles.boxText}>3</Text>
          </View>
        </View>
      </View>

      {/* Code Display */}
      <View
        style={[styles.codeDisplay, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.codeTitle, { color: colors.text }]}>
          📝 Código CSS:
        </Text>
        <Text style={[styles.code, { color: colors.text }]}>
          {`container: {
  flexDirection: '${flexDirection}',
  justifyContent: '${justifyContent}',
  alignItems: '${alignItems}',
}`}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  controls: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    gap: 16,
  },
  controlGroup: {
    gap: 8,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  buttonSmall: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 80,
  },
  buttonActive: {
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  buttonTextSmall: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  buttonTextActive: {
    color: "white",
  },
  demoArea: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  demoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  demoBox: {
    height: 200,
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
  },
  box: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  boxText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  codeDisplay: {
    padding: 16,
    borderRadius: 8,
  },
  codeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  code: {
    fontFamily: "monospace",
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 6,
  },
})
