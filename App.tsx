import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import { SafeAreaView, StyleSheet, View } from "react-native"
import { LessonSelector } from "./src/components/lesson-selector"
import { lessons } from "./src/config/lessons"
import { ThemeProvider, useTheme } from "./src/context/theme-context"
import { ExamplesScreen } from "./src/screens/examples-screen"
import { HomeScreen } from "./src/screens/home-screen"
import { LayoutLessonScreen } from "./src/screens/layout-lesson-screen"
import { StateLessonScreen } from "./src/screens/state-lesson-screen"
import { CameraLessonScreen } from "./src/screens/camera-lesson-screen"
import { GpsLessonScreen } from "./src/screens/gps-lesson-screen"
import { SqliteLessonScreen } from "./src/screens/sqlite-lesson-screen"
import { StorageLessonScreen } from "./src/screens/storage-lesson-screen"
import { UsersScreen } from "./src/screens/users-screen"
import { analyticsService } from "./src/services/analytics-service"

function AppContent() {
  const [selectedLessonId, setSelectedLessonId] = useState<string>("lesson-1")
  const { colors } = useTheme()

  useEffect(() => {
    analyticsService.logEvent("app_started")
    console.log(" App iniciado com arquitetura profissional!")
  }, [])

  const handleLessonChange = (lessonId: string): void => {
    setSelectedLessonId(lessonId)
    const lesson = lessons.find((l) => l.id === lessonId)
    analyticsService.logUserAction("lesson_changed", {
      lesson_id: lessonId,
      lesson_number: lesson?.number ?? 0,
    })
  }

  const renderScreen = () => {
    switch (selectedLessonId) {
      case "lesson-1":
        return <ExamplesScreen />
      case "lesson-2":
        return <UsersScreen />
      case "lesson-3":
        return <HomeScreen />
      case "lesson-4":
        return <StateLessonScreen />
      case "lesson-5":
        return <LayoutLessonScreen />
      case "lesson-6":
        return <StorageLessonScreen />
      case "lesson-7":
        return <SqliteLessonScreen />
      case "lesson-8":
        return <GpsLessonScreen />
      case "lesson-9":
        return <CameraLessonScreen />
      default:
        return <ExamplesScreen />
    }
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <LessonSelector
          lessons={lessons}
          selectedLessonId={selectedLessonId}
          onLessonChange={handleLessonChange}
          backgroundColor={colors.card}
          textColor={colors.text}
        />
      </View>
      <View style={styles.content}>{renderScreen()}</View>
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  content: {
    flex: 1,
  },
})
