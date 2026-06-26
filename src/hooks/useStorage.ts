import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Goal, TimerTask } from "../types";

const GOALS_KEY = "@daily_routine_goals";
const TIMER_TASKS_KEY = "@daily_routine_timer_tasks";

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await AsyncStorage.getItem(GOALS_KEY);
      if (data) {
        setGoals(JSON.parse(data));
      }
    } catch (e) {
      console.error("Failed to load goals", e);
    } finally {
      setLoading(false);
    }
  };

  const saveGoals = async (updatedGoals: Goal[]) => {
    try {
      await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals));
    } catch (e) {
      console.error("Failed to save goals", e);
    }
  };

  const addGoal = useCallback(
    async (title: string, description: string, dueDate: number | null) => {
      const newGoal: Goal = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title,
        description,
        createdAt: Date.now(),
        completedAt: null,
        isCompleted: false,
        dueDate,
      };
      const updated = [newGoal, ...goals];
      setGoals(updated);
      await saveGoals(updated);
      return newGoal;
    },
    [goals]
  );

  const toggleGoal = useCallback(
    async (id: string) => {
      const updated = goals.map((g) =>
        g.id === id
          ? {
              ...g,
              isCompleted: !g.isCompleted,
              completedAt: !g.isCompleted ? Date.now() : null,
            }
          : g
      );
      setGoals(updated);
      await saveGoals(updated);
    },
    [goals]
  );

  const editGoal = useCallback(
    async (id: string, title: string, description: string, dueDate: number | null) => {
      const updated = goals.map((g) =>
        g.id === id ? { ...g, title, description, dueDate } : g
      );
      setGoals(updated);
      await saveGoals(updated);
    },
    [goals]
  );

  const deleteGoal = useCallback(
    async (id: string) => {
      const updated = goals.filter((g) => g.id !== id);
      setGoals(updated);
      await saveGoals(updated);
    },
    [goals]
  );

  return { goals, loading, addGoal, toggleGoal, editGoal, deleteGoal };
}

export function useTimerTasks() {
  const [tasks, setTasks] = useState<TimerTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await AsyncStorage.getItem(TIMER_TASKS_KEY);
      if (data) {
        setTasks(JSON.parse(data));
      }
    } catch (e) {
      console.error("Failed to load timer tasks", e);
    } finally {
      setLoading(false);
    }
  };

  const saveTasks = async (updatedTasks: TimerTask[]) => {
    try {
      await AsyncStorage.setItem(
        TIMER_TASKS_KEY,
        JSON.stringify(updatedTasks)
      );
    } catch (e) {
      console.error("Failed to save timer tasks", e);
    }
  };

  const addTask = useCallback(
    async (title: string, description: string, totalTimeSeconds: number, dueDate: number | null) => {
      const newTask: TimerTask = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title,
        description,
        totalTimeSeconds,
        remainingTimeSeconds: totalTimeSeconds,
        createdAt: Date.now(),
        isRunning: false,
        isCompleted: false,
        completedAt: null,
        lastStartedAt: null,
        failed: false,
        failedAt: null,
        dueDate,
      };
      const updated = [newTask, ...tasks];
      setTasks(updated);
      await saveTasks(updated);
      return newTask;
    },
    [tasks]
  );

  const updateTaskTime = useCallback(
    async (id: string, remainingTimeSeconds: number) => {
      const updated = tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              remainingTimeSeconds,
              isCompleted: remainingTimeSeconds <= 0,
            }
          : t
      );
      setTasks(updated);
      await saveTasks(updated);
    },
    [tasks]
  );

  const startTask = useCallback(
    async (id: string) => {
      const updated = tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              isRunning: true,
              lastStartedAt: Date.now(),
            }
          : t
      );
      setTasks(updated);
      await saveTasks(updated);
    },
    [tasks]
  );

  const pauseTask = useCallback(
    async (id: string) => {
      const updated = tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              isRunning: false,
              lastStartedAt: null,
            }
          : t
      );
      setTasks(updated);
      await saveTasks(updated);
    },
    [tasks]
  );

  const resetTask = useCallback(
    async (id: string) => {
      const updated = tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              remainingTimeSeconds: t.totalTimeSeconds,
              isRunning: false,
              isCompleted: false,
              lastStartedAt: null,
              failed: false,
              failedAt: null,
            }
          : t
      );
      setTasks(updated);
      await saveTasks(updated);
    },
    [tasks]
  );

  const markTaskFailed = useCallback(
    async (id: string) => {
      const updated = tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              isRunning: false,
              isCompleted: false,
              failed: true,
              failedAt: Date.now(),
              lastStartedAt: null,
            }
          : t
      );
      setTasks(updated);
      await saveTasks(updated);
    },
    [tasks]
  );

  const editTask = useCallback(
    async (
      id: string,
      title: string,
      description: string,
      totalTimeSeconds: number,
      dueDate: number | null
    ) => {
      const updated = tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              title,
              description,
              totalTimeSeconds,
              remainingTimeSeconds: totalTimeSeconds,
              isCompleted: false,
              failed: false,
              failedAt: null,
              dueDate,
            }
          : t
      );
      setTasks(updated);
      await saveTasks(updated);
    },
    [tasks]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const updated = tasks.filter((t) => t.id !== id);
      setTasks(updated);
      await saveTasks(updated);
    },
    [tasks]
  );

  return {
    tasks,
    loading,
    addTask,
    updateTaskTime,
    startTask,
    pauseTask,
    resetTask,
    markTaskFailed,
    editTask,
    deleteTask,
  };
}