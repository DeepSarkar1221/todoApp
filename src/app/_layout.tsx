import { Stack } from "expo-router";
import { ThemeProvider } from "../theme/ThemeContext";
import { TaskProvider } from "../hooks/TaskContext";
import { TimerProvider } from "../hooks/TimerContext";
import { ToastProvider } from "../components/Toast";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <TimerProvider>
          <ToastProvider>
            <StatusBar style="auto" />
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
          </ToastProvider>
        </TimerProvider>
      </TaskProvider>
    </ThemeProvider>
  );
}