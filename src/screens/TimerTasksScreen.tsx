import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../theme/ThemeContext";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { Radius } from "../theme/radius";
import { useTimerTasks } from "../hooks/TaskContext";
import TimerTaskItem from "../components/TimerTaskItem";
import TimerTaskModal from "../components/TimerTaskModal";
import { TimerTask } from "../types";

type FilterType = "all" | "active" | "completed" | "failed" | "not_attempted";

const FILTERS: { key: FilterType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "all", label: "All", icon: "list" },
  { key: "active", label: "Active", icon: "play-circle" },
  { key: "completed", label: "Completed", icon: "checkmark-circle" },
  { key: "failed", label: "Failed", icon: "close-circle" },
  { key: "not_attempted", label: "Not Attempted", icon: "hourglass" },
];

export default function TimerTasksScreen() {
  const { colors } = useTheme();

  const {
    tasks,
    loading,
    addTask,
    startTask,
    pauseTask,
    resetTask,
    editTask,
    deleteTask,
  } = useTimerTasks();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<TimerTask | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const handleSave = (
    title: string,
    description: string,
    totalTimeSeconds: number,
  ) => {
    if (editingTask) {
      editTask(editingTask.id, title, description, totalTimeSeconds);
    } else {
      addTask(title, description, totalTimeSeconds);
    }
  };

  const handleEdit = (task: TimerTask) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  const activeTasks = tasks.filter((t) => !t.isCompleted && !t.failed);
  const completedTasks = tasks.filter((t) => t.isCompleted);
  const failedTasks = tasks.filter((t) => t.failed);
  const notAttemptedTasks = tasks.filter((t) => !t.isCompleted && !t.failed && !t.isRunning && t.lastStartedAt === null);

  const filteredTasks =
    activeFilter === "all"
      ? tasks
      : activeFilter === "active"
        ? activeTasks
        : activeFilter === "completed"
          ? completedTasks
          : activeFilter === "failed"
            ? failedTasks
            : notAttemptedTasks;

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textMuted }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View
          style={[
            styles.statBox,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {tasks.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Total
          </Text>
        </View>

        <View
          style={[
            styles.statBox,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <Text style={[styles.statNumber, { color: colors.warning }]}>
            {activeTasks.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Active
          </Text>
        </View>

        <View
          style={[
            styles.statBox,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {completedTasks.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Done
          </Text>
        </View>

        <View
          style={[
            styles.statBox,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <Text style={[styles.statNumber, { color: colors.error }]}>
            {failedTasks.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Failed
          </Text>
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? colors.primary : colors.card,
                  borderColor: isActive ? colors.primary : colors.borderLight,
                },
              ]}
              onPress={() => setActiveFilter(filter.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={filter.icon}
                size={16}
                color={isActive ? colors.textInverse : colors.textSecondary}
              />
              <Text
                style={[
                  styles.filterLabel,
                  { color: isActive ? colors.textInverse : colors.textSecondary },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="timer-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No tasks found
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TimerTaskItem
              task={item}
              onStart={startTask}
              onPause={pauseTask}
              onReset={resetTask}
              onEdit={handleEdit}
              onDelete={deleteTask}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleAdd}
      >
        <Ionicons name="add" size={28} color={colors.textInverse} />
      </TouchableOpacity>

      <TimerTaskModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        onSave={handleSave}
        editingTask={editingTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 12,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },

  statBox: {
    width: 82,
    height: 70,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  statNumber: {
    fontSize: Typography.h2.fontSize,
    fontWeight: "700",
  },

  statLabel: {
    fontSize: Typography.caption.fontSize,
    marginTop: 2,
  },

  filtersRow: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: 8,
  },

  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    width: 82,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
  },

  filterLabel: {
    fontSize: Typography.caption.fontSize,
    fontWeight: "600",
    marginTop: 0,
  },

  list: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
  },

  emptyText: {
    fontSize: Typography.body.fontSize,
    marginTop: Spacing.sm,
  },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});