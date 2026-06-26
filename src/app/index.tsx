import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { Radius } from "../theme/radius";
import DashboardScreen from "../screens/DashboardScreen";
import GoalsScreen from "../screens/GoalsScreen";
import TimerTasksScreen from "../screens/TimerTasksScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { TabName } from "../types";

const tabs: { key: TabName; label: string; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "dashboard", label: "Dashboard", icon: "home-outline", activeIcon: "home" },
  { key: "goals", label: "Goals", icon: "flag-outline", activeIcon: "flag" },
  { key: "timertasks", label: "Timers", icon: "timer-outline", activeIcon: "timer" },
  { key: "settings", label: "Settings", icon: "settings-outline", activeIcon: "settings" },
];

function TabBar({
  activeTab,
  onTabPress,
  colors,
}: {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
  colors: any;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.divider,
          paddingBottom: insets.bottom + Spacing.xs,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={24}
              color={isActive ? colors.tabActive : colors.tabInactive}
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive ? colors.tabActive : colors.tabInactive,
                  fontWeight: isActive ? "600" : "400",
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function Index() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabName>("dashboard");

  const renderScreen = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardScreen />;
      case "goals":
        return <GoalsScreen />;
      case "timertasks":
        return <TimerTasksScreen />;
      case "settings":
        return <SettingsScreen />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "goals":
        return "My Goals";
      case "timertasks":
        return "Timer Tasks";
      case "settings":
        return "Settings";
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.divider,
            paddingTop: insets.top + Spacing.md,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {getTitle()}
        </Text>
      </View>

      {/* Screen Content */}
      <View style={styles.content}>{renderScreen()}</View>

      {/* Bottom Tab Bar */}
      <TabBar activeTab={activeTab} onTabPress={setActiveTab} colors={colors} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: Typography.h2.fontSize,
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: Spacing.xs,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xs,
  },
  tabLabel: {
    fontSize: Typography.caption.fontSize,
    marginTop: 2,
  },
});