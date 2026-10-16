import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import Feather from "@expo/vector-icons/Feather";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

type EmptyStateProps = {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Feather name={icon} size={40} color={colors.primary} />
      </View>
      <AppText size={20} weight="bold" align="center">
        {title}
      </AppText>
      <AppText size={14} weight="medium" color="textSecondary" align="center">
        {subtitle}
      </AppText>
      {actionLabel && onAction && (
        <Button label={actionLabel} fullWidth={false} onPress={onAction} />
      )}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
      gap: 12,
    },
    iconWrap: {
      height: 96,
      width: 96,
      borderRadius: 48,
      backgroundColor: c.primary + "1F",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
  });
