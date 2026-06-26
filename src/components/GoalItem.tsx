import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { Radius } from "../theme/radius";
import { Shadows } from "../theme/shadows";
import { Goal } from "../types";

interface GoalItemProps {
  goal: Goal;
  onToggle: (id: string) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function GoalItem({
  goal,
  onToggle,
  onEdit,
  onDelete,
}: GoalItemProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

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
          shadowColor: colors.textPrimary,
        },
        goal.isCompleted && styles.completedContainer,
      ]}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={(e) => {
            e.stopPropagation();
            onToggle(goal.id);
          }}
        >
          <Ionicons
            name={goal.isCompleted ? "checkmark-circle" : "ellipse-outline"}
            size={26}
            color={goal.isCompleted ? colors.success : colors.textMuted}
          />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { color: colors.textPrimary },
              goal.isCompleted && styles.completedText,
            ]}
            numberOfLines={expanded ? undefined : 2}
          >
            {goal.title}
          </Text>
          {goal.description ? (
            <Text
              style={[
                styles.description,
                { color: colors.textSecondary },
              ]}
              numberOfLines={expanded ? undefined : 2}
            >
              {goal.description}
            </Text>
          ) : null}
        </View>

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.textMuted}
          style={styles.chevron}
        />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaLeft}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.date, { color: colors.textMuted }]}>
            {new Date(goal.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </Text>
          {goal.dueDate && (
            <View
              style={[
                styles.dueBadge,
                {
                  backgroundColor:
                    goal.dueDate < Date.now() && !goal.isCompleted
                      ? colors.error + "20"
                      : colors.warning + "20",
                },
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={12}
                color={
                  goal.dueDate < Date.now() && !goal.isCompleted
                    ? colors.error
                    : colors.warning
                }
              />
              <Text
                style={[
                  styles.dueBadgeText,
                  {
                    color:
                      goal.dueDate < Date.now() && !goal.isCompleted
                        ? colors.error
                        : colors.warning,
                  },
                ]}
              >
                {new Date(goal.dueDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.surfaceAlt }]}
            onPress={(e) => {
              e.stopPropagation();
              onEdit(goal);
            }}
          >
            <Ionicons name="pencil" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.surfaceAlt }]}
            onPress={(e) => {
              e.stopPropagation();
              onDelete(goal.id);
            }}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  chevron: {
    marginLeft: Spacing.sm,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  completedContainer: {
    opacity: 0.75,
  },
  checkbox: {
    marginRight: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
    marginBottom: 2,
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  description: {
    fontSize: Typography.bodySmall.fontSize,
    marginBottom: 4,
  },
  date: {
    fontSize: Typography.caption.fontSize,
  },
  metaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  dueBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  dueBadgeText: {
    fontSize: Typography.caption.fontSize,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  actionBtn: {
    padding: Spacing.xs,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
