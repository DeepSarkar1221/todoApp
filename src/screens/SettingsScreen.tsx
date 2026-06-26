import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { Radius } from "../theme/radius";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeKey, Themes } from "../theme/colors";

const THEME_OPTIONS: { key: ThemeKey; label: string; color: string }[] = [
  { key: "green", label: "Green", color: "#386b01" },
  { key: "pink", label: "Sweet Pink", color: "#a13d5c" },
  { key: "pista", label: "Pista", color: "#007a65" },
  { key: "skyblue", label: "Sky Blue", color: "#00658f" },
  { key: "purple", label: "Purple", color: "#8d4ea3" },
  { key: "sunset", label: "Sunset", color: "#c75120" },
];

export default function SettingsScreen() {
  const { colors, isDark, themeKey, setThemeKey } = useTheme();

  const handleClearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all goals and timer tasks permanently.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert("Done", "All data has been cleared.");
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Theme Section */}
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
        APPEARANCE
      </Text>
      <View
        style={[
          styles.section,
          {
            backgroundColor: colors.card,
            borderColor: colors.borderLight,
          },
        ]}
      >
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: colors.warning + "20" },
              ]}
            >
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={20}
                color={colors.warning}
              />
            </View>
            <View>
              <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                Dark Mode
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                {isDark
                  ? "Dark theme is enabled (system)"
                  : "Light theme is enabled (system)"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Color Themes */}
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
        COLOR THEME
      </Text>
      <View
        style={[
          styles.section,
          {
            backgroundColor: colors.card,
            borderColor: colors.borderLight,
          },
        ]}
      >
        {THEME_OPTIONS.map((option, index) => {
          const isActive = themeKey === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.themeRow,
                index < THEME_OPTIONS.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.borderLight,
                },
              ]}
              onPress={() => setThemeKey(option.key)}
              activeOpacity={0.7}
            >
              <View style={styles.themeLeft}>
                <View
                  style={[styles.themeDot, { backgroundColor: option.color }]}
                />
                <Text
                  style={[styles.themeLabel, { color: colors.textPrimary }]}
                >
                  {option.label}
                </Text>
              </View>
              {isActive && (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Data Management */}
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
        DATA
      </Text>
      <View
        style={[
          styles.section,
          {
            backgroundColor: colors.card,
            borderColor: colors.borderLight,
          },
        ]}
      >
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: colors.info + "20" },
              ]}
            >
              <Ionicons name="information-circle" size={20} color={colors.info} />
            </View>
            <View>
              <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                App Version
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                1.0.0
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.settingRow} onPress={handleClearAllData}>
          <View style={styles.settingLeft}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: colors.error + "20" },
              ]}
            >
              <Ionicons name="trash" size={20} color={colors.error} />
            </View>
            <View>
              <Text style={[styles.settingLabel, { color: colors.error }]}>
                Clear All Data
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                Delete all goals and timer tasks
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* About */}
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
        ABOUT
      </Text>
      <View
        style={[
          styles.section,
          {
            backgroundColor: colors.card,
            borderColor: colors.borderLight,
          },
        ]}
      >
        <View style={styles.aboutContent}>
          <Ionicons name="rocket-outline" size={32} color={colors.primary} />
          <Text style={[styles.aboutTitle, { color: colors.textPrimary }]}>
            Daily Routine Manager
          </Text>
          <Text style={[styles.aboutDesc, { color: colors.textSecondary }]}>
            Manage your daily goals and timed tasks efficiently. Stay productive with focused work sessions.
          </Text>
        </View>

        <View style={styles.featuresList}>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={[styles.featureText, { color: colors.textSecondary }]}>
              Daily Goals with status tracking
            </Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={[styles.featureText, { color: colors.textSecondary }]}>
              Timer Tasks with countdown
            </Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={[styles.featureText, { color: colors.textSecondary }]}>
              Auto-haptic feedback on completion
            </Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={[styles.featureText, { color: colors.textSecondary }]}>
              6 color themes to choose from
            </Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={[styles.featureText, { color: colors.textSecondary }]}>
              Dashboard with progress tracking
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  sectionTitle: {
    fontSize: Typography.caption.fontSize,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  section: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: Spacing.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: Typography.body.fontSize,
    fontWeight: "500",
  },
  settingDesc: {
    fontSize: Typography.caption.fontSize,
    marginTop: 1,
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.lg,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  themeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  themeDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  themeLabel: {
    fontSize: Typography.body.fontSize,
    fontWeight: "500",
  },
  aboutContent: {
    alignItems: "center",
    padding: Spacing.xl,
  },
  aboutTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: "600",
    marginTop: Spacing.sm,
  },
  aboutDesc: {
    fontSize: Typography.bodySmall.fontSize,
    textAlign: "center",
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  featuresList: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  featureText: {
    fontSize: Typography.bodySmall.fontSize,
  },
});