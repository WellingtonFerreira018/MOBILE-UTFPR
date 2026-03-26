import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { Button } from "./button";

type CounterProps = {
  initialValue?: number;
  step?: number;
};

export function Counter({ initialValue = 0, step = 1 }: CounterProps) {
  const [count, setCount] = useState<number>(initialValue);

  const increment = (): void => {
    setCount((prevCount) => prevCount + step);
  };

  const decrement = (): void => {
    setCount((prevCount) => prevCount - step);
  };

  const reset = (): void => {
    setCount(initialValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contador com useState</Text>
      
      <View style={styles.displayContainer}>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.label}>valor atual</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="-" onPress={decrement} variant="secondary" />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Reset" onPress={reset} variant="outline" />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="+" onPress={increment} variant="primary" />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>📊 Incremento: {step}</Text>
        <Text style={styles.infoText}>🎯 Valor inicial: {initialValue}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  displayContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  count: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#007AFF",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  buttonWrapper: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
  },
});
