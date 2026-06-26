import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo } from "react";
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
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "upcoming">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = (title: string, description: string, dueDate: number | null) => {
    if (editingGoal) {
      editGoal(editingGoal.id, title, description, dueDate);
    } else {
      addGoal(title, description, dueDate);
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

  const filterApplied = goals.filter((g) => {
    if (filter === "all") return true;
    if (filter === "pending") return !g.isCompleted;
    if (filter === "completed") return g.isCompleted;
    if (filter === "upcoming") return !!g.dueDate && !g.isCompleted;
    return true;
  });

  const filteredGoals = useMemo(() => {
    if (!searchQuery.trim()) return filterApplied;
    const q = searchQuery.toLowerCase().trim();
    return filterApplied.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
    );
  }, [filterApplied, searchQuery]);

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

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {(["all", "pending", "completed", "upcoming"] as const).map((f) => {
          const isActive = filter === f;
          return (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? colors.primary : colors.card,
                  borderColor: isActive ? colors.primary : colors.borderLight,
                },
              ]}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  f === "all"
                    ? "list"
                    : f === "pending"
                      ? "hourglass"
                      : f === "completed"
                        ? "checkmark-circle"
                        : "calendar"
                }
                size={14}
                color={isActive ? colors.textInverse : colors.textSecondary}
              />
              <Text
                style={[
                  styles.filterLabel,
                  { color: isActive ? colors.textInverse : colors.textSecondary },
                ]}
              >
                {f === "upcoming" ? "Upcoming" : f.charAt(0).toUpperCase() + f.slice(1)}
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
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search goals..."
          placeholderTextColor={colors.inputPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={filteredGoals}
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
        ListEmptyComponent={
          goals.length === 0 ? (
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
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                No goals match your search
              </Text>
            </View>
          )
        }
      />

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
  filterRow: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    marginTop: -490,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: 44,
    paddingTop: 0,
    paddingBottom: 0,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 4,
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