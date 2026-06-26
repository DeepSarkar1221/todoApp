import { Stack } from "expo-router";
import { ThemeProvider } from "../theme/ThemeContext";
import { TaskProvider } from "../hooks/TaskContext";
import { TimerProvider } from "../hooks/TimerContext";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <TimerProvider>
          <StatusBar style="auto" />
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </TimerProvider>
      </TaskProvider>
    </ThemeProvider>
  );
}
