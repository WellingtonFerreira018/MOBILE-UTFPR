import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

type LoadingProps = {
  message?: string;
  size?: "small" | "large";
  color?: string;
};

export function Loading({ 
  message = "Carregando...", 
  size = "large",
  color = "#007AFF" 
}: LoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
});
