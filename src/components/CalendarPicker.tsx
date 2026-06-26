import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { Radius } from "../theme/radius";

interface CalendarPickerProps {
  onDateSelect: (date: number) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export default function CalendarPicker({ onDateSelect }: CalendarPickerProps) {
  const { colors } = useTheme();
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const goToPrevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  const goToNextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }, [currentMonth]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const calendarDays: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const handleDayPress = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (dateStart < todayStart) return; // prevent past dates
    setSelectedDate(date);
    onDateSelect(date.getTime());
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.borderLight },
      ]}
    >
      {/* Month Header */}
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={goToPrevMonth} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.monthTitle, { color: colors.textPrimary }]}>
          {MONTHS[currentMonth]} {currentYear}
        </Text>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navBtn}>
          <Ionicons name="chevron-forward" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Day Headers */}
      <View style={styles.weekRow}>
        {DAYS.map((d) => (
          <View key={d} style={styles.dayCell}>
            <Text style={[styles.dayHeader, { color: colors.textMuted }]}>
              {d}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.grid}>
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return <View key={`empty-${idx}`} style={styles.dayCell} />;
          }

          const date = new Date(currentYear, currentMonth, day);
          const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          const isToday = isSameDay(date, today);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isPast = dateStart < todayStart;
          const isDisabled = isPast;

          return (
            <TouchableOpacity
              key={`day-${day}`}
              style={styles.dayCell}
              onPress={() => handleDayPress(day)}
              disabled={isDisabled}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.dayCircle,
                  isToday && !isSelected && { backgroundColor: colors.primary + "20" },
                  isSelected && { backgroundColor: colors.primary },
                  isDisabled && styles.disabledDay,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: colors.textPrimary },
                    isSelected && { color: colors.textInverse },
                    isDisabled && { color: colors.textMuted, opacity: 0.3 },
                    isToday && !isSelected && { color: colors.primary, fontWeight: "700" },
                  ]}
                >
                  {day}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  navBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  monthTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: "700",
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: Spacing.xs,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
  },
  dayHeader: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledDay: {
    backgroundColor: "transparent",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
  },
});