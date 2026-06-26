import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
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

type FilterType = "all" | "not_attempted" | "completed" | "failed" | "upcoming";

const FILTERS: {
  key: FilterType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "all", label: "All", icon: "list" },
  { key: "not_attempted", label: "Not Attempted", icon: "hourglass" },
  { key: "completed", label: "Completed", icon: "checkmark-circle" },
  { key: "failed", label: "Failed", icon: "close-circle" },
  { key: "upcoming", label: "Upcoming", icon: "calendar" },
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
  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = (
    title: string,
    description: string,
    totalTimeSeconds: number,
    dueDate: number | null,
  ) => {
    if (editingTask) {
      editTask(editingTask.id, title, description, totalTimeSeconds, dueDate);
    } else {
      addTask(title, description, totalTimeSeconds, dueDate);
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

  const filterApplied =
    activeFilter === "all"
      ? tasks
      : activeFilter === "not_attempted"
        ? notAttemptedTasks
        : activeFilter === "completed"
          ? completedTasks
          : activeFilter === "failed"
            ? failedTasks
            : tasks.filter((t) => !!t.dueDate && !t.isCompleted && !t.failed);

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return filterApplied;
    const q = searchQuery.toLowerCase().trim();
    return filterApplied.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }, [filterApplied, searchQuery]);

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
                    {
                      color: isActive
                        ? colors.textInverse
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
            },
          ]}
        >
          <Ionicons name="search" size={22} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search tasks..."
            placeholderTextColor={colors.inputPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={22}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Task List */}
        <FlatList
          style={{ flex: 1 }}
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="timer-outline"
                size={48}
                color={colors.textMuted}
              />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No tasks found
              </Text>
            </View>
          }
        />

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
    paddingBottom: 0,
    gap: Spacing.sm,
  },

  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    height: 40,
    width: 110,
    borderRadius: 20,
    borderWidth: 1,
  },

  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 0,
  },

  list: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 4,
    paddingBottom: 100,
  },

  emptyContainer: {
    paddingTop: Spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
  },

  emptyText: {
    fontSize: Typography.body.fontSize,
    marginTop: Spacing.sm,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.lg,
    marginBottom: 8,
    paddingHorizontal: Spacing.lg,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 52,
    paddingTop: 0,
    paddingBottom: 0,
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