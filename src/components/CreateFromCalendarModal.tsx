import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { Radius } from "../theme/radius";

interface CreateFromCalendarModalProps {
  visible: boolean;
  selectedDate: Date | null;
  onSelectGoal: () => void;
  onSelectTimerTask: () => void;
  onClose: () => void;
}

export default function CreateFromCalendarModal({
  visible,
  selectedDate,
  onSelectGoal,
  onSelectTimerTask,
  onClose,
}: CreateFromCalendarModalProps) {
  const { colors } = useTheme();

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={[
            styles.content,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.dateBadge}>
              <Ionicons name="calendar" size={18} color={colors.primary} />
              <Text style={[styles.dateText, { color: colors.textPrimary }]}>
                {formattedDate}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Create for this date
          </Text>

          <View style={styles.options}>
            <TouchableOpacity
              style={[
                styles.optionBtn,
                { backgroundColor: colors.card, borderColor: colors.borderLight },
              ]}
              onPress={onSelectGoal}
              activeOpacity={0.7}
            >
              <View
                style={[styles.optionIcon, { backgroundColor: colors.primary + "20" }]}
              >
                <Ionicons name="flag" size={24} color={colors.primary} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>
                  Goal
                </Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                  Set a daily objective
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionBtn,
                { backgroundColor: colors.card, borderColor: colors.borderLight },
              ]}
              onPress={onSelectTimerTask}
              activeOpacity={0.7}
            >
              <View
                style={[styles.optionIcon, { backgroundColor: colors.info + "20" }]}
              >
                <Ionicons name="timer" size={24} color={colors.info} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>
                  Timer Task
                </Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                  Track focused work session
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  content: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  dateText: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
  },
  title: {
    fontSize: Typography.h3.fontSize,
    fontWeight: "700",
    marginBottom: Spacing.lg,
  },
  options: {
    gap: Spacing.md,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: Typography.bodySmall.fontSize,
  },
});