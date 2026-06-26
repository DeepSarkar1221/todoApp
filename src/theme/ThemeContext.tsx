import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Themes, AppColors, ThemeKey } from "./colors";

const THEME_KEY = "@app_theme_key";

type ThemeContextValue = {
  colors: AppColors;
  isDark: boolean;
  themeKey: ThemeKey;
  setThemeKey: (key: ThemeKey) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue>({
  colors: Themes.green.light,
  isDark: false,
  themeKey: "green",
  setThemeKey: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const isDark = systemScheme === "dark";
  const [themeKey, setThemeKeyState] = useState<ThemeKey>("green");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved && saved in Themes) {
          setThemeKeyState(saved as ThemeKey);
        }
      } catch (e) {
        console.error("Failed to load theme", e);
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

  const theme = Themes[themeKey];

  const value = useMemo(
    () => ({
      colors: isDark ? theme.dark : theme.light,
      isDark,
      themeKey,
      setThemeKey,
    }),
    [isDark, themeKey, setThemeKey]
  );

  if (!loaded) {
    return null; // prevent flash of wrong theme
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}