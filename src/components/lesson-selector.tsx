import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native";
import { useState } from "react";

export type Lesson = {
  id: string;
  number: number;
  title: string;
  description: string;
};

type LessonSelectorProps = {
  lessons: Lesson[];
  selectedLessonId: string;
  onLessonChange: (lessonId: string) => void;
  backgroundColor?: string;
  textColor?: string;
};

export function LessonSelector({ 
  lessons, 
  selectedLessonId, 
  onLessonChange,
  backgroundColor = "#fff",
  textColor = "#333"
}: LessonSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLesson = lessons.find(l => l.id === selectedLessonId);

  const handleSelectLesson = (lessonId: string): void => {
    onLessonChange(lessonId);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.selector, { backgroundColor }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.selectorContent}>
          <Text style={[styles.label, { color: textColor }]}>Aula Selecionada:</Text>
          <View style={styles.selectedInfo}>
            <Text style={[styles.lessonNumber, { color: textColor }]}>
              Aula {selectedLesson?.number}
            </Text>
            <Text style={[styles.lessonTitle, { color: textColor }]} numberOfLines={1}>
              {selectedLesson?.title}
            </Text>
          </View>
        </View>
        <Text style={[styles.arrow, { color: textColor }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione a Aula</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.lessonList}>
              {lessons.map((lesson) => {
                const isSelected = lesson.id === selectedLessonId;
                return (
                  <TouchableOpacity
                    key={lesson.id}
                    style={[
                      styles.lessonItem,
                      isSelected && styles.lessonItemSelected
                    ]}
                    onPress={() => handleSelectLesson(lesson.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.lessonItemContent}>
                      <View style={[
                        styles.lessonNumberBadge,
                        isSelected && styles.lessonNumberBadgeSelected
                      ]}>
                        <Text style={[
                          styles.lessonNumberBadgeText,
                          isSelected && styles.lessonNumberBadgeTextSelected
                        ]}>
                          {lesson.number}
                        </Text>
                      </View>
                      <View style={styles.lessonInfo}>
                        <Text style={[
                          styles.lessonItemTitle,
                          isSelected && styles.lessonItemTitleSelected
                        ]}>
                          {lesson.title}
                        </Text>
                        <Text style={[
                          styles.lessonItemDescription,
                          isSelected && styles.lessonItemDescriptionSelected
                        ]} numberOfLines={2}>
                          {lesson.description}
                        </Text>
                      </View>
                      {isSelected && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectorContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.7,
  },
  selectedInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  lessonNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  lessonTitle: {
    fontSize: 16,
    flex: 1,
  },
  arrow: {
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666",
  },
  lessonList: {
    padding: 16,
  },
  lessonItem: {
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  lessonItemSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#E3F2FD",
  },
  lessonItemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  lessonNumberBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  lessonNumberBadgeSelected: {
    backgroundColor: "#007AFF",
  },
  lessonNumberBadgeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
  },
  lessonNumberBadgeTextSelected: {
    color: "white",
  },
  lessonInfo: {
    flex: 1,
  },
  lessonItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  lessonItemTitleSelected: {
    color: "#007AFF",
  },
  lessonItemDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  lessonItemDescriptionSelected: {
    color: "#555",
  },
  checkmark: {
    fontSize: 24,
    color: "#007AFF",
    fontWeight: "bold",
  },
});
