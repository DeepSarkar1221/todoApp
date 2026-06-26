import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState, useMemo } from "react";
import { useTheme } from "../theme/ThemeContext";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { Radius } from "../theme/radius";
import { useGoals, useTimerTasks } from "../hooks/TaskContext";
import GoalItem from "../components/GoalItem";
import TimerTaskItem from "../components/TimerTaskItem";
import GoalModal from "../components/GoalModal";
import TimerTaskModal from "../components/TimerTaskModal";
import CalendarPicker from "../components/CalendarPicker";
import CreateFromCalendarModal from "../components/CreateFromCalendarModal";
import { Goal, TimerTask } from "../types";

type GoalFilter = "all" | "pending" | "completed";
type TaskFilter = "all" | "pending" | "active" | "completed";

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { goals, addGoal, toggleGoal, editGoal, deleteGoal } = useGoals();
  const {
    tasks,
    addTask,
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

  // Calendar state
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

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

  const handleTaskEdit = (task: TimerTask) => {};

  // Calendar handlers
  const handleDateSelect = (date: number) => {
    setSelectedCalendarDate(new Date(date));
    setCalendarModalVisible(true);
  };

  const handleCreateGoalFromCalendar = () => {
    setCalendarModalVisible(false);
    setShowGoalModal(true);
  };

  const handleCreateTaskFromCalendar = () => {
    setCalendarModalVisible(false);
    setShowTaskModal(true);
  };

  const handleGoalSave = (title: string, description: string) => {
    const dueDate = selectedCalendarDate?.getTime() ?? Date.now();
    addGoal(title, description, dueDate);
    setShowGoalModal(false);
    setSelectedCalendarDate(null);
  };

  const handleTaskSave = (title: string, description: string, totalTimeSeconds: number) => {
    const dueDate = selectedCalendarDate?.getTime() ?? Date.now();
    addTask(title, description, totalTimeSeconds, dueDate);
    setShowTaskModal(false);
    setSelectedCalendarDate(null);
  };

  // Upcoming items grouped by date
  const upcomingItems = useMemo(() => {
    const items: { date: string; goals: Goal[]; tasks: TimerTask[] }[] = [];
    const now = Date.now();

    const upcomingGoals = goals.filter((g) => g.dueDate && !g.isCompleted && g.dueDate > now);
    const upcomingTasks = tasks.filter((t) => t.dueDate && !t.isCompleted && !t.failed && t.dueDate > now);

    const allDates = new Set<number>();
    upcomingGoals.forEach((g) => allDates.add(g.dueDate!));
    upcomingTasks.forEach((t) => allDates.add(t.dueDate!));

    const sortedDates = Array.from(allDates).sort();

    for (const date of sortedDates) {
      items.push({
        date: new Date(date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        goals: upcomingGoals.filter((g) => g.dueDate === date),
        tasks: upcomingTasks.filter((t) => t.dueDate === date),
      });
    }

    return items;
  }, [goals, tasks]);

  const isTomorrow = (dateStr: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return dateStr === tomorrow.toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });
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
          style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]}
          onPress={() => openGoalFilter("all")}
          activeOpacity={0.7}
        >
          <View style={[styles.statIcon, { backgroundColor: colors.primary + "20" }]}>
            <Ionicons name="flag" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>{goals.length}</Text>
          <Text style={[styles.statDesc, { color: colors.textSecondary }]}>Total Goals</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]}
          onPress={() => openGoalFilter("pending")}
          activeOpacity={0.7}
        >
          <View style={[styles.statIcon, { backgroundColor: colors.warning + "20" }]}>
            <Ionicons name="hourglass" size={24} color={colors.warning} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>{pendingGoals.length}</Text>
          <Text style={[styles.statDesc, { color: colors.textSecondary }]}>Pending Goals</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]}
          onPress={() => openGoalFilter("completed")}
          activeOpacity={0.7}
        >
          <View style={[styles.statIcon, { backgroundColor: colors.success + "20" }]}>
            <Ionicons name="checkmark-done" size={24} color={colors.success} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>{completedGoals.length}</Text>
          <Text style={[styles.statDesc, { color: colors.textSecondary }]}>Completed Goals</Text>
        </TouchableOpacity>
      </View>

      {/* Timer Tasks Stats */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
        TIMER TASKS
      </Text>
      <View style={styles.statsGrid}>
        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]}
          onPress={() => openTaskFilter("all")}
          activeOpacity={0.7}
        >
          <View style={[styles.statIcon, { backgroundColor: colors.info + "20" }]}>
            <Ionicons name="timer" size={24} color={colors.info} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>{tasks.length}</Text>
          <Text style={[styles.statDesc, { color: colors.textSecondary }]}>Total Timer Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]}
          onPress={() => openTaskFilter("pending")}
          activeOpacity={0.7}
        >
          <View style={[styles.statIcon, { backgroundColor: colors.warning + "20" }]}>
            <Ionicons name="hourglass" size={24} color={colors.warning} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>{pendingTasks.length}</Text>
          <Text style={[styles.statDesc, { color: colors.textSecondary }]}>Pending Timer Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]}
          onPress={() => openTaskFilter("active")}
          activeOpacity={0.7}
        >
          <View style={[styles.statIcon, { backgroundColor: colors.info + "20" }]}>
            <Ionicons name="play-circle" size={24} color={colors.info} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>{activeTasks.length}</Text>
          <Text style={[styles.statDesc, { color: colors.textSecondary }]}>Active Timer Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]}
          onPress={() => openTaskFilter("completed")}
          activeOpacity={0.7}
        >
          <View style={[styles.statIcon, { backgroundColor: colors.success + "20" }]}>
            <Ionicons name="checkmark-done" size={24} color={colors.success} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>{completedTasks.length}</Text>
          <Text style={[styles.statDesc, { color: colors.textSecondary }]}>Completed Timer Tasks</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
        SCHEDULE
      </Text>
      <CalendarPicker onDateSelect={handleDateSelect} />

      {/* Upcoming Tasks */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
        UPCOMING TASKS
      </Text>
      {upcomingItems.length === 0 ? (
        <View style={[styles.upcomingCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
          <Text style={[styles.upcomingEmpty, { color: colors.textMuted }]}>
            No upcoming tasks
          </Text>
        </View>
      ) : (
        upcomingItems.map((group) => (
          <View key={group.date} style={styles.upcomingGroup}>
            <Text style={[styles.upcomingDateHeader, { color: colors.textSecondary }]}>
              {isTomorrow(group.date) ? "Tomorrow" : group.date}
            </Text>
            {group.goals.map((g) => (
              <View key={g.id} style={[styles.upcomingItem, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
                <Ionicons name="flag" size={18} color={colors.primary} />
                <Text style={[styles.upcomingItemTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                  {g.title}
                </Text>
                <View style={[styles.upcomingType, { backgroundColor: colors.primary + "20" }]}>
                  <Text style={[styles.upcomingTypeText, { color: colors.primary }]}>Goal</Text>
                </View>
              </View>
            ))}
            {group.tasks.map((t) => (
              <View key={t.id} style={[styles.upcomingItem, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
                <Ionicons name="timer" size={18} color={colors.info} />
                <Text style={[styles.upcomingItemTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                  {t.title}
                </Text>
                <View style={[styles.upcomingType, { backgroundColor: colors.info + "20" }]}>
                  <Text style={[styles.upcomingTypeText, { color: colors.info }]}>Task</Text>
                </View>
              </View>
            ))}
          </View>
        ))
      )}

      {/* Progress Cards */}
      <View style={styles.progressSection}>
        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
          <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>Goals Progress</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.borderLight }]}>
              <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${goalProgress}%` }]} />
            </View>
            <Text style={[styles.progressPercent, { color: colors.primary }]}>{goalProgress}%</Text>
          </View>
          <Text style={[styles.progressDetail, { color: colors.textMuted }]}>
            {completedGoals.length} of {goals.length} goals completed
          </Text>
        </View>
        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
          <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>Timer Tasks Progress</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.borderLight }]}>
              <View style={[styles.progressFill, { backgroundColor: colors.info, width: `${taskProgress}%` }]} />
            </View>
            <Text style={[styles.progressPercent, { color: colors.info }]}>{taskProgress}%</Text>
          </View>
          <Text style={[styles.progressDetail, { color: colors.textMuted }]}>
            {completedTasks.length} of {tasks.length} tasks completed
          </Text>
        </View>
      </View>

      {/* Filtered Goals Modal */}
      <Modal visible={goalModalVisible} transparent animationType="slide" onRequestClose={() => setGoalModalVisible(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.borderLight }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {goalFilter === "all" ? "All Goals" : goalFilter === "pending" ? "Pending Goals" : "Completed Goals"}
              </Text>
              <TouchableOpacity onPress={() => setGoalModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            {filteredGoals.length === 0 ? (
              <View style={styles.modalEmpty}>
                <Ionicons name="flag-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.modalEmptyText, { color: colors.textMuted }]}>No goals found</Text>
              </View>
            ) : (
              <FlatList
                data={filteredGoals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <GoalItem goal={item} onToggle={toggleGoal} onEdit={handleGoalEdit} onDelete={deleteGoal} />
                )}
                contentContainerStyle={styles.modalList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Filtered Timer Tasks Modal */}
      <Modal visible={taskModalVisible} transparent animationType="slide" onRequestClose={() => setTaskModalVisible(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.borderLight }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {taskFilter === "all" ? "All Timer Tasks" : taskFilter === "pending" ? "Pending Timer Tasks" : taskFilter === "active" ? "Active Timer Tasks" : "Completed Timer Tasks"}
              </Text>
              <TouchableOpacity onPress={() => setTaskModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            {filteredTasks.length === 0 ? (
              <View style={styles.modalEmpty}>
                <Ionicons name="timer-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.modalEmptyText, { color: colors.textMuted }]}>No timer tasks found</Text>
              </View>
            ) : (
              <FlatList
                data={filteredTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TimerTaskItem task={item} onStart={startTask} onPause={pauseTask} onReset={resetTask} onEdit={handleTaskEdit} onDelete={deleteTask} />
                )}
                contentContainerStyle={styles.modalList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Create From Calendar Modal */}
      <CreateFromCalendarModal
        visible={calendarModalVisible}
        selectedDate={selectedCalendarDate}
        onSelectGoal={handleCreateGoalFromCalendar}
        onSelectTimerTask={handleCreateTaskFromCalendar}
        onClose={() => {
          setCalendarModalVisible(false);
          setSelectedCalendarDate(null);
        }}
      />

      {/* Goal Modal (from calendar) */}
      <GoalModal
        visible={showGoalModal}
        onClose={() => {
          setShowGoalModal(false);
          setSelectedCalendarDate(null);
        }}
        onSave={handleGoalSave}
        editingGoal={null}
        prefillDate={selectedCalendarDate?.getTime() ?? null}
      />

      {/* Timer Task Modal (from calendar) */}
      <TimerTaskModal
        visible={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedCalendarDate(null);
        }}
        onSave={handleTaskSave}
        editingTask={null}
        prefillDate={selectedCalendarDate?.getTime() ?? null}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  greetingSection: { marginBottom: Spacing.xl },
  greeting: { fontSize: Typography.h2.fontSize, fontWeight: "700" },
  subtitle: { fontSize: Typography.body.fontSize, marginTop: Spacing.xs },
  sectionLabel: { fontSize: Typography.caption.fontSize, fontWeight: "600", letterSpacing: 1, marginBottom: Spacing.sm, marginLeft: Spacing.xs },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm, marginBottom: Spacing.xl },
  statCard: { width: 115, padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1 },
  statIcon: { width: 44, height: 44, borderRadius: Radius.md, justifyContent: "center", alignItems: "center", marginBottom: Spacing.sm },
  statValue: { fontSize: Typography.h2.fontSize, fontWeight: "700" },
  statDesc: { fontSize: Typography.caption.fontSize, marginTop: 2 },
  progressSection: { gap: Spacing.sm, marginBottom: Spacing.xl },
  progressCard: { padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1 },
  progressTitle: { fontSize: Typography.body.fontSize, fontWeight: "600", marginBottom: Spacing.sm },
  progressBarContainer: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  progressBar: { flex: 1, height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  progressPercent: { fontSize: Typography.h3.fontSize, fontWeight: "700", minWidth: 48, textAlign: "right" },
  progressDetail: { fontSize: Typography.caption.fontSize, marginTop: Spacing.xs },
  upcomingCard: { padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1, marginBottom: Spacing.xl },
  upcomingEmpty: { fontSize: Typography.bodySmall.fontSize, textAlign: "center" },
  upcomingGroup: { marginBottom: Spacing.lg },
  upcomingDateHeader: { fontSize: Typography.bodySmall.fontSize, fontWeight: "700", marginBottom: Spacing.sm, textTransform: "uppercase", letterSpacing: 0.5 },
  upcomingItem: { flexDirection: "row", alignItems: "center", gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1, marginBottom: Spacing.xs },
  upcomingItemTitle: { flex: 1, fontSize: Typography.body.fontSize, fontWeight: "500" },
  upcomingType: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.sm },
  upcomingTypeText: { fontSize: Typography.caption.fontSize, fontWeight: "600" },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalContent: { maxHeight: "80%", borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, borderWidth: 1, borderBottomWidth: 0, paddingTop: Spacing.lg },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  modalTitle: { fontSize: Typography.h3.fontSize, fontWeight: "700" },
  modalList: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  modalEmpty: { alignItems: "center", justifyContent: "center", paddingVertical: Spacing.xxxl },
  modalEmptyText: { fontSize: Typography.body.fontSize, marginTop: Spacing.sm },
});