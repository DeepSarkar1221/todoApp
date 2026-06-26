import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { Radius } from "../theme/radius";
import { useGoals, useTimerTasks } from "../hooks/TaskContext";
import GoalItem from "../components/GoalItem";
import TimerTaskItem from "../components/TimerTaskItem";
import { Goal, TimerTask } from "../types";

type GoalFilter = "all" | "pending" | "completed";
type TaskFilter = "all" | "pending" | "active" | "completed";

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { goals, toggleGoal, editGoal, deleteGoal } = useGoals();
  const {
    tasks,
    startTask,
    pauseTask,
    resetTask,
    editTask,
    deleteTask,
  } = useTimerTasks();
  const [refreshing, setRefreshing] = useState(false);

  // Goal modal state
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [goalFilter, setGoalFilter] = useState<GoalFilter>("all");
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editGoalModalVisible, setEditGoalModalVisible] = useState(false);

  // Task modal state
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const pendingGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);
  const pendingTasks = tasks.filter((t) => !t.isCompleted && !t.failed && !t.isRunning && t.lastStartedAt === null);
  const activeTasks = tasks.filter((t) => !t.isCompleted && !t.failed && (t.isRunning || t.lastStartedAt !== null));
  const completedTasks = tasks.filter((t) => t.isCompleted);

  const today = new Date();
  const greeting = today.getHours()<4?"Good Night" : today.getHours() < 12 ? "Good Morning" : today.getHours() < 17 ? "Good Afternoon" : "Good Evening";

  const goalProgress =
    goals.length > 0
      ? Math.round((completedGoals.length / goals.length) * 100)
      : 0;

  const taskProgress =
    tasks.length > 0
      ? Math.round((completedTasks.length / tasks.length) * 100)
      : 0;

  // Goal filter handlers
  const openGoalFilter = (filter: GoalFilter) => {
    setGoalFilter(filter);
    setGoalModalVisible(true);
  };

  const filteredGoals =
    goalFilter === "all"
      ? goals
      : goalFilter === "pending"
        ? pendingGoals
        : completedGoals;

  const handleGoalEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setEditGoalModalVisible(true);
  };

  // Task filter handlers
  const openTaskFilter = (filter: TaskFilter) => {
    setTaskFilter(filter);
    setTaskModalVisible(true);
  };

  const filteredTasks =
    taskFilter === "all"
      ? tasks
      : taskFilter === "pending"
        ? pendingTasks
        : taskFilter === "active"
          ? activeTasks
          : completedTasks;

  const handleTaskEdit = (task: TimerTask) => {
    // We don't have an edit modal in dashboard, so we just navigate
    // For now, we'll just show the task list without inline editing
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    >
      {/* Greeting */}
      <View style={styles.greetingSection}>
        <Text style={[styles.greeting, { color: colors.textPrimary }]}>
          {greeting}! 👋
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Here's your daily overview
        </Text>
      </View>

      {/* Goals Stats */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
        GOALS
      </Text>
      <View style={styles.statsGrid}>
        <TouchableOpacity
          style={[
            styles.statCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderLight,
            },
          ]}
          onPress={() => openGoalFilter("all")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.statIcon,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Ionicons name="flag" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {goals.length}
          </Text>
          <Text style={[styles.statDesc, { color: colors.textSecondary }]}>
            Total Goals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderLight,
            },
          ]}
          onPress={() => openGoalFilter("pending")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.statIcon,
              { backgroundColor: colors.warning + "20" },
            ]}
          >
            <Ionicons name="hourglass" size={24} color={colors.warning} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {pendingGoals.length}
          </Text>
          <Text style={[styles.statDesc, { color: colors.textSecondary }]}>
            Pending Goals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderLight,
            },
          ]}
          onPress={() => openGoalFilter("completed")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.statIcon,
              { backgroundColor: colors.success + "20" },
            ]}
          >
            <Ionicons name="checkmark-done" size={24} color={colors.success} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {completedGoals.length}
          </Text>
          <Text style={[styles.statDesc, { color: colors.textSecondary }]}>
            Completed Goals
          </Text>
        </TouchableOpacity>
      </View>

      {/* Timer Tasks Stats */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
        TIMER TASKS
      </Text>
      <View style={styles.statsGrid}>
        <TouchableOpacity
          style={[
            styles.statCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderLight,
            },
          ]}
          onPress={() => openTaskFilter("all")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.statIcon,
              { backgroundColor: colors.info + "20" },
            ]}
          >
            <Ionicons name="timer" size={24} color={colors.info} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {tasks.length}
          </Text>
          <Text style={[styles.statDesc, { color: colors.textSecondary }]}>
            Total Timer Tasks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderLight,
            },
          ]}
          onPress={() => openTaskFilter("pending")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.statIcon,
              { backgroundColor: colors.warning + "20" },
            ]}
          >
            <Ionicons name="hourglass" size={24} color={colors.warning} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {pendingTasks.length}
          </Text>
          <Text style={[styles.statDesc, { color: colors.textSecondary }]}>
            Pending Timer Tasks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderLight,
            },
          ]}
          onPress={() => openTaskFilter("active")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.statIcon,
              { backgroundColor: colors.info + "20" },
            ]}
          >
            <Ionicons name="play-circle" size={24} color={colors.info} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {activeTasks.length}
          </Text>
          <Text style={[styles.statDesc, { color: colors.textSecondary }]}>
            Active Timer Tasks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderLight,
            },
          ]}
          onPress={() => openTaskFilter("completed")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.statIcon,
              { backgroundColor: colors.success + "20" },
            ]}
          >
            <Ionicons name="checkmark-done" size={24} color={colors.success} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {completedTasks.length}
          </Text>
          <Text style={[styles.statDesc, { color: colors.textSecondary }]}>
            Completed Timer Tasks
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Cards */}
      <View style={styles.progressSection}>
        <View
          style={[
            styles.progressCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>
            Goals Progress
          </Text>
          <View style={styles.progressBarContainer}>
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
                    backgroundColor: colors.primary,
                    width: `${goalProgress}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressPercent, { color: colors.primary }]}>
              {goalProgress}%
            </Text>
          </View>
          <Text style={[styles.progressDetail, { color: colors.textMuted }]}>
            {completedGoals.length} of {goals.length} goals completed
          </Text>
        </View>

        <View
          style={[
            styles.progressCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>
            Timer Tasks Progress
          </Text>
          <View style={styles.progressBarContainer}>
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
                    backgroundColor: colors.info,
                    width: `${taskProgress}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressPercent, { color: colors.info }]}>
              {taskProgress}%
            </Text>
          </View>
          <Text style={[styles.progressDetail, { color: colors.textMuted }]}>
            {completedTasks.length} of {tasks.length} tasks completed
          </Text>
        </View>
      </View>

      {/* Quick Tips */}
      <View
        style={[
          styles.tipCard,
          { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight },
        ]}
      >
        <View style={styles.tipHeader}>
          <Ionicons name="bulb-outline" size={22} color={colors.warning} />
          <Text style={[styles.tipTitle, { color: colors.textPrimary }]}>
            Quick Tips
          </Text>
        </View>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          • Use {"Goals"} to set your daily objectives{"\n"}
          • Use {"Timer Tasks"} to track focused work sessions{"\n"}
          • Toggle theme in Settings for dark/light mode
        </Text>
      </View>

      {/* Filtered Goals Modal */}
      <Modal
        visible={goalModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setGoalModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.background,
                borderColor: colors.borderLight,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {goalFilter === "all"
                  ? "All Goals"
                  : goalFilter === "pending"
                    ? "Pending Goals"
                    : "Completed Goals"}
              </Text>
              <TouchableOpacity onPress={() => setGoalModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {filteredGoals.length === 0 ? (
              <View style={styles.modalEmpty}>
                <Ionicons name="flag-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.modalEmptyText, { color: colors.textMuted }]}>
                  No goals found
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredGoals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <GoalItem
                    goal={item}
                    onToggle={toggleGoal}
                    onEdit={handleGoalEdit}
                    onDelete={deleteGoal}
                  />
                )}
                contentContainerStyle={styles.modalList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Edit Goal Modal inside Dashboard */}
      <Modal
        visible={editGoalModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditGoalModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.editOverlay}
          activeOpacity={1}
          onPress={() => {
            setEditGoalModalVisible(false);
            setEditingGoal(null);
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={[
              styles.editModalContent,
              {
                backgroundColor: colors.surfaceSecondary,
                borderColor: colors.borderLight,
              },
            ]}
          >
            <View style={styles.editModalHeader}>
              <Text style={[styles.editModalTitle, { color: colors.textPrimary }]}>
                Edit Goal
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setEditGoalModalVisible(false);
                  setEditingGoal(null);
                }}
              >
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                styles.editInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.textPrimary,
                },
              ]}
              placeholder="Title"
              placeholderTextColor={colors.inputPlaceholder}
              value={editingGoal?.title || ""}
              onChangeText={(text) =>
                setEditingGoal((prev) => (prev ? { ...prev, title: text } : null))
              }
            />
            <TextInput
              style={[
                styles.editInput,
                styles.editTextArea,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.textPrimary,
                },
              ]}
              placeholder="Description"
              placeholderTextColor={colors.inputPlaceholder}
              value={editingGoal?.description || ""}
              onChangeText={(text) =>
                setEditingGoal((prev) =>
                  prev ? { ...prev, description: text } : null
                )
              }
              multiline
            />
            <TouchableOpacity
              style={[
                styles.editSaveBtn,
                { backgroundColor: colors.primary },
              ]}
              onPress={() => {
                if (editingGoal) {
                  editGoal(editingGoal.id, editingGoal.title, editingGoal.description);
                }
                setEditGoalModalVisible(false);
                setEditingGoal(null);
              }}
            >
              <Text style={[styles.editSaveText, { color: colors.textInverse }]}>
                Save
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Filtered Timer Tasks Modal */}
      <Modal
        visible={taskModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTaskModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.background,
                borderColor: colors.borderLight,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {taskFilter === "all"
                  ? "All Timer Tasks"
                  : taskFilter === "pending"
                    ? "Pending Timer Tasks"
                    : taskFilter === "active"
                      ? "Active Timer Tasks"
                      : "Completed Timer Tasks"}
              </Text>
              <TouchableOpacity onPress={() => setTaskModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {filteredTasks.length === 0 ? (
              <View style={styles.modalEmpty}>
                <Ionicons name="timer-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.modalEmptyText, { color: colors.textMuted }]}>
                  No timer tasks found
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
                    onEdit={handleTaskEdit}
                    onDelete={deleteTask}
                  />
                )}
                contentContainerStyle={styles.modalList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  greetingSection: {
    marginBottom: Spacing.xl,
  },
  greeting: {
    fontSize: Typography.h2.fontSize,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: Typography.body.fontSize,
    marginTop: Spacing.xs,
  },
  sectionLabel: {
    fontSize: Typography.caption.fontSize,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  statCard: {
    width: 115,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: Typography.h2.fontSize,
    fontWeight: "700",
  },
  statDesc: {
    fontSize: Typography.caption.fontSize,
    marginTop: 2,
  },
  progressSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  progressCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  progressTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: Typography.h3.fontSize,
    fontWeight: "700",
    minWidth: 48,
    textAlign: "right",
  },
  progressDetail: {
    fontSize: Typography.caption.fontSize,
    marginTop: Spacing.xs,
  },
  tipCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tipTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
  },
  tipText: {
    fontSize: Typography.bodySmall.fontSize,
    lineHeight: 22,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    maxHeight: "80%",
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: Spacing.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: "700",
  },
  modalList: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  modalEmpty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xxxl,
  },
  modalEmptyText: {
    fontSize: Typography.body.fontSize,
    marginTop: Spacing.sm,
  },
  // Edit modal styles
  editOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  editModalContent: {
    width: "90%",
    maxWidth: 400,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
  },
  editModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  editModalTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: "600",
  },
  editInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: Typography.body.fontSize,
    marginBottom: Spacing.md,
  },
  editTextArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  editSaveBtn: {
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  editSaveText: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
  },
});