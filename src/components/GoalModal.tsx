import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { Radius } from "../theme/radius";
import { Goal } from "../types";
import { useState, useEffect } from "react";

interface GoalModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  editingGoal?: Goal | null;
}

export default function GoalModal({
  visible,
  onClose,
  onSave,
  editingGoal,
}: GoalModalProps) {
  const { colors } = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setDescription(editingGoal.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingGoal, visible]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), description.trim());
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.surfaceSecondary,
                borderColor: colors.borderLight,
              },
            ]}
          >
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {editingGoal ? "Edit Goal" : "New Goal"}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Title
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                    color: colors.textPrimary,
                  },
                ]}
                placeholder="Enter goal title..."
                placeholderTextColor={colors.inputPlaceholder}
                value={title}
                onChangeText={setTitle}
                autoFocus
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Description (optional)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                    color: colors.textPrimary,
                  },
                ]}
                placeholder="Enter description..."
                placeholderTextColor={colors.inputPlaceholder}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.saveBtn,
                {
                  backgroundColor: colors.primary,
                  opacity: title.trim() ? 1 : 0.5,
                },
              ]}
              onPress={handleSave}
              disabled={!title.trim()}
            >
              <Text style={[styles.saveText, { color: colors.textInverse }]}>
                {editingGoal ? "Update Goal" : "Create Goal"}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTouchable: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.h3.fontSize,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.bodySmall.fontSize,
    fontWeight: "500",
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: Typography.body.fontSize,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  saveBtn: {
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  saveText: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
  },
});