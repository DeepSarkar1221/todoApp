import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Themes, AppColors, ThemeKey } from "./colors";

const THEME_KEY = "@app_theme_key";
const MODE_KEY = "@app_mode_key";

export type AppMode = "system" | "light" | "dark";

type ThemeContextValue = {
  colors: AppColors;
  isDark: boolean;
  themeKey: ThemeKey;
  setThemeKey: (key: ThemeKey) => Promise<void>;
  mode: AppMode;
  setMode: (mode: AppMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue>({
  colors: Themes.green.light,
  isDark: false,
  themeKey: "green",
  setThemeKey: async () => {},
  mode: "system",
  setMode: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeKey, setThemeKeyState] = useState<ThemeKey>("green");
  const [mode, setModeState] = useState<AppMode>("system");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme && savedTheme in Themes) {
          setThemeKeyState(savedTheme as ThemeKey);
        }
        const savedMode = await AsyncStorage.getItem(MODE_KEY);
        if (savedMode === "light" || savedMode === "dark" || savedMode === "system") {
          setModeState(savedMode as AppMode);
        }
      } catch (e) {
        console.error("Failed to load settings", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const setThemeKey = useCallback(async (key: ThemeKey) => {
    setThemeKeyState(key);
    try {
      await AsyncStorage.setItem(THEME_KEY, key);
    } catch (e) {
      console.error("Failed to save theme", e);
    }
  }, []);

  const setMode = useCallback(async (newMode: AppMode) => {
    setModeState(newMode);
    try {
      await AsyncStorage.setItem(MODE_KEY, newMode);
    } catch (e) {
      console.error("Failed to save mode", e);
    }
  }, []);

  const isDark = mode === "system" ? systemScheme === "dark" : mode === "dark";
  const theme = Themes[themeKey];

  const value = useMemo(
    () => ({
      colors: isDark ? theme.dark : theme.light,
      isDark,
      themeKey,
      setThemeKey,
      mode,
      setMode,
    }),
    [isDark, themeKey, setThemeKey, mode, setMode]
  );

  if (!loaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}