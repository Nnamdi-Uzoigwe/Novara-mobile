import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppText } from "@/shared/components/AppText";
import Feather from "@expo/vector-icons/Feather";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type FeatherName = React.ComponentProps<typeof Feather>["name"];

type SettingsRowProps = {
  icon: FeatherName;
  title: string;
  /** Small text shown before the chevron, such as the current language */
  value?: string;
  tone?: "default" | "danger";
  showChevron?: boolean;
  onPress?: () => void;
};

export function SettingsRow({
  icon,
  title,
  value,
  tone = "default",
  showChevron = true,
  onPress,
}: SettingsRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const danger = tone === "danger";
  const iconColor = danger ? colors.danger : colors.primary;

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={value ? `${title}, ${value}` : title}
    >
      <Feather name={icon} size={20} color={iconColor} />

      <AppText
        size={14}
        weight="semibold"
        color={danger ? "danger" : "textPrimary"}
        style={styles.title}
      >
        {title}
      </AppText>

      {!!value && (
        <AppText size={12} weight="medium" color="textSecondary">
          {value}
        </AppText>
      )}

      {showChevron && (
        <View>
          <Feather
            name="chevron-right"
            size={18}
            color={colors.textPlaceholder}
          />
        </View>
      )}
    </Pressable>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      minHeight: 54,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    title: {
      flex: 1,
    },
  });
