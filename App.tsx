import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import { SafeAreaView, StyleSheet } from "react-native"
import { TabNavigation } from "./src/components/tab-navigation"
import { ExamplesScreen } from "./src/screens/examples-screen"
import { HomeScreen } from "./src/screens/home-screen"
import { UsersScreen } from "./src/screens/users-screen"
import { analyticsService } from "./src/services/analytics-service"

type TabId = "examples" | "posts" | "users"

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("examples")

  useEffect(() => {
    analyticsService.logEvent("app_started")
    console.log("🚀 App iniciado com arquitetura profissional!")
  }, [])

  const handleTabChange = (tabId: string): void => {
    setActiveTab(tabId as TabId)
    analyticsService.logUserAction("tab_changed", { tab: tabId })
  }

  const renderScreen = (): React.ReactElement => {
    switch (activeTab) {
      case "examples":
        return <ExamplesScreen />
      case "posts":
        return <HomeScreen />
      case "users":
        return <UsersScreen />
      default:
        return <ExamplesScreen />
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderScreen()}
      <TabNavigation
        tabs={[
          { id: "examples", label: "Exemplos", icon: "🎓" },
          { id: "posts", label: "Posts", icon: "📱" },
          { id: "users", label: "Usuários", icon: "👥" },
        ]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
})
