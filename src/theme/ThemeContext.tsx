import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { LightColors, DarkColors, AppColors } from "./colors";

type ThemeContextValue = {
  colors: AppColors;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({
  colors: LightColors,
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const isDark = systemScheme === "dark";

  const value = useMemo(
    () => ({
      colors: isDark ? DarkColors : LightColors,
      isDark,
    }),
    [isDark]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
