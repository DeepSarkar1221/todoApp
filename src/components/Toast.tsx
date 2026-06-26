import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { Radius } from "../theme/radius";

type ToastType = "success" | "info" | "warning";

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
  icon: keyof typeof Ionicons.glyphMap;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const iconMap: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
      success: "checkmark-circle",
      info: "information-circle",
      warning: "alert-circle",
    };
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, icon: iconMap[type] }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const accentColor = "#386b01";

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((toast) => (
          <View
            key={toast.id}
            style={[
              styles.toast,
              {
                backgroundColor: colors.card,
                borderColor: accentColor,
                shadowColor: colors.textPrimary,
              },
            ]}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: accentColor + "20" },
              ]}
            >
              <Ionicons
                name={toast.icon}
                size={20}
                color={accentColor}
              />
            </View>
            <Text
              style={[styles.toastText, { color: colors.textPrimary }]}
              numberOfLines={2}
            >
              {toast.message}
            </Text>
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: "center",
    gap: 8,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginHorizontal: Spacing.lg,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    maxWidth: 400,
    width: "90%",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  toastText: {
    fontSize: Typography.body.fontSize,
    fontWeight: "500",
    flex: 1,
  },
});