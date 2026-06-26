import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { Radius } from "../theme/radius";
import { TimerTask } from "../types";

interface TimerTaskItemProps {
  task: TimerTask;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onEdit: (task: TimerTask) => void;
  onDelete: (id: string) => void;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TimerTaskItem({
  task,
  onStart,
  onPause,
  onReset,
  onEdit,
  onDelete,
}: TimerTaskItemProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const progress =
    task.totalTimeSeconds > 0
      ? 1 - task.remainingTimeSeconds / task.totalTimeSeconds
      : 0;

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={toggleExpanded}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.borderLight,
        },
        task.isCompleted && styles.completedContainer,
        task.failed && styles.failedContainer,
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary },
            task.isCompleted && styles.completedText,
          ]}
          numberOfLines={expanded ? undefined : 1}
        >
          {task.title}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
          >
            <Ionicons name="pencil" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {task.description ? (
        <Text
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={expanded ? undefined : 2}
        >
          {task.description}
        </Text>
      ) : null}

      <View style={styles.timerSection}>
        <View style={styles.timeDisplay}>
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <Text style={[styles.timerText, { color: colors.textPrimary }]}>
            {formatTime(task.remainingTimeSeconds)}
          </Text>
          <Text style={[styles.totalTime, { color: colors.textMuted }]}>
            / {formatTime(task.totalTimeSeconds)}
          </Text>
        </View>

        <View
          style={[
            styles.progressBar,
            { backgroundColor: colors.borderLight },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: task.isCompleted ? colors.success : colors.primary,
                width: `${Math.min(progress * 100, 100)}%`,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.controls}>
        {task.isCompleted ? (
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: colors.surfaceAlt }]}
            onPress={(e) => {
              e.stopPropagation();
              onReset(task.id);
            }}
          >
            <Ionicons name="refresh" size={20} color={colors.warning} />
            <Text style={[styles.controlText, { color: colors.warning }]}>
              Restart
            </Text>
          </TouchableOpacity>
        ) : task.isRunning ? (
          <TouchableOpacity
            style={[
              styles.controlBtn,
              { backgroundColor: colors.error + "20" },
            ]}
            onPress={(e) => {
              e.stopPropagation();
              onPause(task.id);
            }}
          >
            <Ionicons name="pause" size={20} color={colors.error} />
            <Text style={[styles.controlText, { color: colors.error }]}>
              Pause
            </Text>
          </TouchableOpacity>
        ) : task.failed ? (
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: colors.surfaceAlt }]}
            onPress={(e) => {
              e.stopPropagation();
              onReset(task.id);
            }}
          >
            <Ionicons name="refresh" size={20} color={colors.warning} />
            <Text style={[styles.controlText, { color: colors.warning }]}>
              Restart
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.controlBtn,
              { backgroundColor: colors.primary + "20" },
            ]}
            onPress={(e) => {
              e.stopPropagation();
              onStart(task.id);
            }}
          >
            <Ionicons name="play" size={20} color={colors.primary} />
            <Text style={[styles.controlText, { color: colors.primary }]}>
              Start
            </Text>
          </TouchableOpacity>
        )}

        {!task.isCompleted && !task.isRunning && task.remainingTimeSeconds < task.totalTimeSeconds && (
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: colors.surfaceAlt }]}
            onPress={(e) => {
              e.stopPropagation();
              onReset(task.id);
            }}
          >
            <Ionicons name="refresh" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {task.failed && (
        <View style={[styles.failedBadge, { backgroundColor: colors.error + "20" }]}>
          <Ionicons name="close-circle" size={16} color={colors.error} />
          <Text style={[styles.failedLabel, { color: colors.error }]}>
            Failed
          </Text>
        </View>
      )}

      {task.isCompleted && !task.failed && (
        <View style={[styles.completedBadge, { backgroundColor: colors.success + "20" }]}>
          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          <Text style={[styles.completedLabel, { color: colors.success }]}>
            Completed
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  completedContainer: {
    opacity: 0.8,
  },
  failedContainer: {
    borderColor: "#ba1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
    flex: 1,
    marginRight: Spacing.sm,
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  description: {
    fontSize: Typography.bodySmall.fontSize,
    marginBottom: Spacing.sm,
  },
  timerSection: {
    marginBottom: Spacing.sm,
  },
  timeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  timerText: {
    fontSize: Typography.h3.fontSize,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  totalTime: {
    fontSize: Typography.bodySmall.fontSize,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  controls: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  controlBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.full,
  },
  controlText: {
    fontSize: Typography.bodySmall.fontSize,
    fontWeight: "600",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    alignSelf: "flex-start",
    marginTop: Spacing.xs,
  },
  completedLabel: {
    fontSize: Typography.caption.fontSize,
    fontWeight: "600",
  },
  failedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    alignSelf: "flex-start",
    marginTop: Spacing.xs,
  },
  failedLabel: {
    fontSize: Typography.caption.fontSize,
    fontWeight: "600",
  },
});