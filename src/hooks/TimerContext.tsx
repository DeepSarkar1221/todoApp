import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Vibration,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../theme/ThemeContext";
import { TimerTask } from "../types";
import { useTimerTasks } from "./TaskContext";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { Radius } from "../theme/radius";

interface TimerContextValue {
  timeUpTask: TimerTask | null;
  timeUpModalVisible: boolean;
  handleTimeUpDone: () => void;
  handleTimeUpFailed: () => void;
}

const TimerContext = createContext<TimerContextValue>({
  timeUpTask: null,
  timeUpModalVisible: false,
  handleTimeUpDone: () => {},
  handleTimeUpFailed: () => {},
});

export function useTimerContext() {
  return useContext(TimerContext);
}

export function TimerProvider({ children }: { children: ReactNode }) {
  const { tasks, updateTaskTime, pauseTask, markTaskCompleted, markTaskFailed } = useTimerTasks();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const previousTimeUpRef = useRef<Set<string>>(new Set());
  const vibrationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [timeUpTask, setTimeUpTask] = useState<TimerTask | null>(null);
  const [timeUpModalVisible, setTimeUpModalVisible] = useState(false);

  // Start strong continuous vibration
  const startVibration = useCallback(() => {
    // Clear any existing vibration
    if (vibrationIntervalRef.current) {
      clearInterval(vibrationIntervalRef.current);
    }
    Vibration.cancel();

    // 1. Fire strong initial haptics
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // 2. Continuous repeating vibration — max strength
    // Pattern: vibrate 2000ms, pause 100ms (repeats forever)
    Vibration.vibrate([0, 2000, 100], true);
  }, []);

  // Stop all vibration
  const stopVibration = useCallback(() => {
    Vibration.cancel();
    if (vibrationIntervalRef.current) {
      clearInterval(vibrationIntervalRef.current);
      vibrationIntervalRef.current = null;
    }
  }, []);

  // Global countdown effect — runs on every screen
  useEffect(() => {
    const runningTasks = tasks.filter(
      (task) => task.isRunning && !task.isCompleted && !task.failed,
    );

    if (runningTasks.length > 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        runningTasks.forEach((task) => {
          const newRemaining = Math.max(0, task.remainingTimeSeconds - 1);
          updateTaskTime(task.id, newRemaining);
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Detect newly timed-out tasks (hit 0 but not yet completed or failed)
    tasks.forEach((task) => {
      const wasTimeUp = previousTimeUpRef.current.has(task.id);
      const justTimedOut =
        task.remainingTimeSeconds <= 0 &&
        !task.isCompleted &&
        !task.failed &&
        !wasTimeUp;

      if (justTimedOut) {
        // Start vibration
        startVibration();

        // Show popup
        setTimeUpTask(task);
        setTimeUpModalVisible(true);
        previousTimeUpRef.current.add(task.id);
      }
    });

    // Clean up tracking for tasks no longer at 0
    tasks.forEach((task) => {
      if (task.remainingTimeSeconds > 0 || task.isCompleted || task.failed) {
        previousTimeUpRef.current.delete(task.id);
      }
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Clean up vibration on unmount
      Vibration.cancel();
      if (vibrationIntervalRef.current) {
        clearInterval(vibrationIntervalRef.current);
      }
    };
  }, [tasks, updateTaskTime, startVibration]);

  const handleTimeUpDone = useCallback(async () => {
    stopVibration();
    if (timeUpTask) {
      // Mark task as completed — user confirms they finished it in time
      await pauseTask(timeUpTask.id);
      await markTaskCompleted(timeUpTask.id);
    }
    setTimeUpModalVisible(false);
    setTimeUpTask(null);
  }, [timeUpTask, pauseTask, markTaskCompleted, stopVibration]);

  const handleTimeUpFailed = useCallback(async () => {
    stopVibration();
    if (timeUpTask) {
      // Mark task as failed — user did not complete it in time
      await pauseTask(timeUpTask.id);
      await markTaskFailed(timeUpTask.id);
    }
    setTimeUpModalVisible(false);
    setTimeUpTask(null);
  }, [timeUpTask, pauseTask, markTaskFailed, stopVibration]);

  return (
    <TimerContext.Provider
      value={{
        timeUpTask,
        timeUpModalVisible,
        handleTimeUpDone,
        handleTimeUpFailed,
      }}
    >
      {children}
      {/* Global Time-Up Popup */}
      <TimeUpModal />
    </TimerContext.Provider>
  );
}

function TimeUpModal() {
  const { colors } = useTheme();
  const {
    timeUpTask,
    timeUpModalVisible,
    handleTimeUpDone,
    handleTimeUpFailed,
  } = useTimerContext();

  return (
    <Modal
      visible={timeUpModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View
          style={[
            styles.content,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="alarm" size={56} color={colors.warning} />
          </View>

          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Time's Up!
          </Text>

          {timeUpTask && (
            <Text
              style={[styles.taskName, { color: colors.textSecondary }]}
            >
              "{timeUpTask.title}"
            </Text>
          )}

          <Text style={[styles.question, { color: colors.textMuted }]}>
            If you done this work?
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.btnDone, { backgroundColor: colors.success }]}
              onPress={handleTimeUpDone}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
              <Text style={styles.btnText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnFailed, { backgroundColor: colors.error }]}
              onPress={handleTimeUpFailed}
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle" size={22} color="#fff" />
              <Text style={styles.btnText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "85%",
    maxWidth: 360,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.h2.fontSize,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  taskName: {
    fontSize: Typography.body.fontSize,
    fontWeight: "500",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  question: {
    fontSize: Typography.bodySmall.fontSize,
    marginBottom: Spacing.xl,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
    width: "100%",
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  btnDone: {},
  btnFailed: {},
  btnText: {
    color: "#fff",
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
  },
});