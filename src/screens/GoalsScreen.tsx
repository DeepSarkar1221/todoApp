import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { Radius } from "../theme/radius";
import { useGoals } from "../hooks/TaskContext";
import GoalItem from "../components/GoalItem";
import GoalModal from "../components/GoalModal";
import { Goal } from "../types";

export default function GoalsScreen() {
  const { colors } = useTheme();
  const { goals, loading, addGoal, toggleGoal, editGoal, deleteGoal } = useGoals();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const handleSave = (title: string, description: string) => {
    if (editingGoal) {
      editGoal(editingGoal.id, title, description);
    } else {
      addGoal(title, description);
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditingGoal(null);
    setModalVisible(true);
  };

  const pendingGoals = goals.filter((g) => !g.isCompleted).length;
  const completedGoals = goals.filter((g) => g.isCompleted).length;

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[{ color: colors.textMuted }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Stats Header */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {goals.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Total Goals
          </Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>
            {pendingGoals}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Pending
          </Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {completedGoals}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Done
          </Text>
        </View>
      </View>

      {goals.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="flag-outline" size={64} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            No Goals Yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Create your first daily goal!
          </Text>
        </View>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GoalItem
              goal={item}
              onToggle={toggleGoal}
              onEdit={handleEdit}
              onDelete={deleteGoal}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleAdd}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={colors.textInverse} />
      </TouchableOpacity>

      <GoalModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingGoal(null);
        }}
        onSave={handleSave}
        editingGoal={editingGoal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  statBox: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: Typography.h2.fontSize,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: Typography.caption.fontSize,
    marginTop: 2,
  },
  list: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: "600",
    marginTop: Spacing.lg,
  },
  emptySubtitle: {
    fontSize: Typography.body.fontSize,
    marginTop: Spacing.xs,
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
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});