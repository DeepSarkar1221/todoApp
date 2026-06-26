export interface Goal {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  completedAt: number | null;
  isCompleted: boolean;
  dueDate: number | null;
}

export interface TimerTask {
  id: string;
  title: string;
  description: string;
  totalTimeSeconds: number;
  remainingTimeSeconds: number;
  createdAt: number;
  isRunning: boolean;
  isCompleted: boolean;
  completedAt: number | null;
  lastStartedAt: number | null;
  failed: boolean;
  failedAt: number | null;
  dueDate: number | null;
}

export type TabName = "dashboard" | "goals" | "timertasks" | "settings";