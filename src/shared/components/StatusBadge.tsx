import { useTheme } from "@/core/theme/ThemeProvider";
import { AppText } from "@/shared/components/AppText";
import { StyleSheet, View } from "react-native";

type StatusBadgeProps = {
  label: string;
  tone?: "primary" | "success" | "danger";
};

export function StatusBadge({ label, tone = "primary" }: StatusBadgeProps) {
  const { colors } = useTheme();

  const color =
    tone === "success"
      ? colors.success
      : tone === "danger"
        ? colors.danger
        : colors.primary;

  return (
    <View
      style={[
        styles.badge,
        { borderColor: color, backgroundColor: color + "14" },
      ]}
    >
      <AppText size={11} weight="semibold" color={color}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
});
