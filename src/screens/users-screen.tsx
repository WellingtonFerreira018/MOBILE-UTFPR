import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useEffect } from "react";
import { useFetch } from "../hooks/use-fetch";
import { apiService, User } from "../services/api";
import { analyticsService } from "../services/analytics-service";
import { Card } from "../components/card";
import { Loading } from "../components/loading";
import { ErrorMessage } from "../components/error-message";

export function UsersScreen() {
  const { data: users, loading, error, refetch } = useFetch<User[]>(
    () => apiService.getUsers(),
    []
  );

  useEffect(() => {
    analyticsService.logScreenView("users_screen");
  }, []);

  const handleUserPress = (user: User): void => {
    analyticsService.logUserAction("user_clicked", {
      user_id: user.id,
      user_name: user.name,
    });
    console.log("Usuário selecionado:", user.name);
  };

  if (loading) {
    return <Loading message="Carregando usuários..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👥 Usuários da API</Text>
        <Text style={styles.subtitle}>
          {users?.length || 0} usuários cadastrados
        </Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            title={item.name}
            subtitle={`@${item.username}`}
            onPress={() => handleUserPress(item)}
          >
            <View style={styles.userInfo}>
              <Text style={styles.infoText}>📧 {item.email}</Text>
              <Text style={styles.infoText}>📱 {item.phone}</Text>
              <Text style={styles.infoText}>🌐 {item.website}</Text>
            </View>
          </Card>
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  list: {
    padding: 16,
  },
  userInfo: {
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
  },
});
