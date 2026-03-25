import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useEffect } from "react";
import { useFetch } from "../hooks/use-fetch";
import { apiService, Post } from "../services/api";
import { analyticsService } from "../services/analytics-service";
import { Card } from "../components/card";
import { Loading } from "../components/loading";
import { ErrorMessage } from "../components/error-message";

export function HomeScreen() {
  const { data: posts, loading, error, refetch } = useFetch<Post[]>(
    () => apiService.getPosts(),
    []
  );

  useEffect(() => {
    analyticsService.logScreenView("home_screen");
  }, []);

  const handlePostPress = (post: Post): void => {
    analyticsService.logUserAction("post_clicked", {
      post_id: post.id,
      post_title: post.title,
    });
    console.log("Post selecionado:", post.title);
  };

  if (loading) {
    return <Loading message="Carregando posts..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📱 Posts da API</Text>
        <Text style={styles.subtitle}>
          {posts?.length || 0} posts carregados
        </Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            subtitle={`Post #${item.id} - Usuário ${item.userId}`}
            onPress={() => handlePostPress(item)}
          >
            <Text style={styles.body} numberOfLines={3}>
              {item.body}
            </Text>
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
  body: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});
