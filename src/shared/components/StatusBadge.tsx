import { useTheme } from "@/core/theme/ThemeProvider";
import { AppText } from "@/shared/components/AppText";
import { StyleSheet, View } from "react-native";

type StatusBadgeProps = {
  label: string;
  tone?: "primary" | "success" | "danger" | "warning";
  /** outlined: small box with a border. soft: tinted pill, no border */
  variant?: "outlined" | "soft";
};

export function StatusBadge({
  label,
  tone = "primary",
  variant = "outlined",
}: StatusBadgeProps) {
  const { colors } = useTheme();

  const color =
    tone === "success"
      ? colors.success
      : tone === "danger"
        ? colors.danger
        : tone === "warning"
          ? colors.warning
          : colors.primary;

  const soft = variant === "soft";

  return (
    <View
      style={[
        styles.badge,
        soft ? styles.soft : styles.outlined,
        {
          borderColor: color,
          backgroundColor: color + (soft ? "22" : "14"),
        },
      ]}
    >
      <AppText size={soft ? 13 : 11} weight="semibold" color={color}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
  },
  outlined: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  soft: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 0,
  },
});
