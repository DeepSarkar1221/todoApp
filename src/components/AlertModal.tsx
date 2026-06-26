import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { Radius } from "../theme/radius";

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AlertModal({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  icon = "warning",
  iconColor,
  destructive = false,
  onConfirm,
  onCancel,
}: AlertModalProps) {
  const { colors } = useTheme();
  const resolvedIconColor = iconColor || (destructive ? colors.error : colors.warning);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onCancel}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={[
            styles.content,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: resolvedIconColor + "15" },
            ]}
          >
            <Ionicons name={icon} size={40} color={resolvedIconColor} />
          </View>

          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {message}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnCancel,
                { borderColor: colors.borderLight },
              ]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnText, { color: colors.textPrimary }]}>
                {cancelLabel}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                { backgroundColor: destructive ? colors.error : colors.primary },
              ]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Ionicons
                name={destructive ? "trash-outline" : "checkmark-circle"}
                size={18}
                color={colors.textInverse}
              />
              <Text style={[styles.btnText, { color: colors.textInverse }]}>
                {confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    width: "85%",
    maxWidth: 360,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
    alignItems: "center",
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.h3.fontSize,
    fontWeight: "700",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  message: {
    fontSize: Typography.body.fontSize,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
    width: "100%",
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  btnCancel: {
    borderWidth: 1,
  },
  btnText: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
  },
});