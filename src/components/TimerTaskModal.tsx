import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { Radius } from "../theme/radius";
import { TimerTask } from "../types";
import { useState, useEffect } from "react";

interface TimerTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, totalTimeSeconds: number, dueDate: number | null) => void;
  editingTask?: TimerTask | null;
  prefillDate?: number | null;
}

export default function TimerTaskModal({
  visible,
  onClose,
  onSave,
  editingTask,
  prefillDate,
}: TimerTaskModalProps) {
  const { colors } = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [seconds, setSeconds] = useState("0");
  const [dueDate, setDueDate] = useState<number | null>(null);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDueDate(editingTask.dueDate || null);
      const h = Math.floor(editingTask.totalTimeSeconds / 3600);
      const m = Math.floor((editingTask.totalTimeSeconds % 3600) / 60);
      const s = editingTask.totalTimeSeconds % 60;
      setHours(h.toString());
      setMinutes(m.toString());
      setSeconds(s.toString());
    } else {
      setTitle("");
      setDescription("");
      setDueDate(prefillDate || null);
      setHours("0");
      setMinutes("0");
      setSeconds("0");
    }
  }, [editingTask, visible, prefillDate]);

  const handleSave = () => {
    if (!title.trim()) return;
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;
    if (totalSeconds <= 0) return;
    onSave(title.trim(), description.trim(), totalSeconds, dueDate);
    onClose();
  };

  const clearDate = () => setDueDate(null);

  const totalSecondsCalc =
    (parseInt(hours) || 0) * 3600 +
    (parseInt(minutes) || 0) * 60 +
    (parseInt(seconds) || 0);

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
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
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
                  {editingTask ? "Edit Timer Task" : "New Timer Task"}
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
                  placeholder="Enter task title..."
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
                  numberOfLines={2}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  Total Time
                </Text>
                <View style={styles.timeInputRow}>
                  <View style={styles.timeInputGroup}>
                    <TextInput
                      style={[
                        styles.timeInput,
                        {
                          backgroundColor: colors.inputBackground,
                          borderColor: colors.inputBorder,
                          color: colors.textPrimary,
                        },
                      ]}
                      placeholder="0"
                      placeholderTextColor={colors.inputPlaceholder}
                      value={hours}
                      onChangeText={(t) => setHours(t.replace(/[^0-9]/g, ""))}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                    <Text style={[styles.timeLabel, { color: colors.textMuted }]}>
                      Hours
                    </Text>
                  </View>
                  <Text style={[styles.timeSeparator, { color: colors.textMuted }]}>
                    :
                  </Text>
                  <View style={styles.timeInputGroup}>
                    <TextInput
                      style={[
                        styles.timeInput,
                        {
                          backgroundColor: colors.inputBackground,
                          borderColor: colors.inputBorder,
                          color: colors.textPrimary,
                        },
                      ]}
                      placeholder="0"
                      placeholderTextColor={colors.inputPlaceholder}
                      value={minutes}
                      onChangeText={(t) =>
                        setMinutes(t.replace(/[^0-9]/g, ""))
                      }
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                    <Text style={[styles.timeLabel, { color: colors.textMuted }]}>
                      Mins
                    </Text>
                  </View>
                  <Text style={[styles.timeSeparator, { color: colors.textMuted }]}>
                    :
                  </Text>
                  <View style={styles.timeInputGroup}>
                    <TextInput
                      style={[
                        styles.timeInput,
                        {
                          backgroundColor: colors.inputBackground,
                          borderColor: colors.inputBorder,
                          color: colors.textPrimary,
                        },
                      ]}
                      placeholder="0"
                      placeholderTextColor={colors.inputPlaceholder}
                      value={seconds}
                      onChangeText={(t) =>
                        setSeconds(t.replace(/[^0-9]/g, ""))
                      }
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                    <Text style={[styles.timeLabel, { color: colors.textMuted }]}>
                      Secs
                    </Text>
                  </View>
                </View>
              </View>

              {/* Due Date Display */}
              {dueDate && (
                <View
                  style={[
                    styles.dateDisplay,
                    { backgroundColor: colors.info + "15", borderColor: colors.info + "30" },
                  ]}
                >
                  <Ionicons name="calendar" size={18} color={colors.info} />
                  <Text style={[styles.dateText, { color: colors.info }]}>
                    {new Date(dueDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                  {!editingTask && (
                    <TouchableOpacity onPress={clearDate}>
                      <Ionicons name="close-circle" size={18} color={colors.info} />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {totalSecondsCalc > 0 && (
                <View
                  style={[
                    styles.preview,
                    { backgroundColor: colors.surfaceAlt },
                  ]}
                >
                  <Ionicons name="timer-outline" size={18} color={colors.primary} />
                  <Text style={[styles.previewText, { color: colors.textPrimary }]}>
                    Total:{" "}
                    {totalSecondsCalc >= 3600
                      ? `${Math.floor(totalSecondsCalc / 3600)}h ${Math.floor((totalSecondsCalc % 3600) / 60)}m`
                      : totalSecondsCalc >= 60
                        ? `${Math.floor(totalSecondsCalc / 60)}m ${totalSecondsCalc % 60}s`
                        : `${totalSecondsCalc}s`}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  {
                    backgroundColor: colors.primary,
                    opacity:
                      title.trim() && totalSecondsCalc > 0 ? 1 : 0.5,
                  },
                ]}
                onPress={handleSave}
                disabled={!title.trim() || totalSecondsCalc <= 0}
              >
                <Text
                  style={[styles.saveText, { color: colors.textInverse }]}
                >
                  {editingTask ? "Update Task" : "Create Task"}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </ScrollView>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  overlayTouchable: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  scrollContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xxl,
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
    minHeight: 60,
    textAlignVertical: "top",
  },
  timeInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  timeInputGroup: {
    flex: 1,
    alignItems: "center",
  },
  timeInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: Typography.h2.fontSize,
    fontWeight: "700",
    textAlign: "center",
    width: "100%",
    fontVariant: ["tabular-nums"],
  },
  timeLabel: {
    fontSize: Typography.caption.fontSize,
    marginTop: 4,
  },
  timeSeparator: {
    fontSize: Typography.h2.fontSize,
    fontWeight: "700",
    marginTop: -Spacing.lg,
  },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  previewText: {
    fontSize: Typography.body.fontSize,
    fontWeight: "500",
  },
  dateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  dateText: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    fontWeight: "500",
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