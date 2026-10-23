import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import type {
  AppNotification,
  NotificationKind,
} from "@/features/notifications/types";
import { AppText } from "@/shared/components/AppText";
import { timeAgo } from "@/shared/utils/timeAgo";
import Feather from "@expo/vector-icons/Feather";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type FeatherName = React.ComponentProps<typeof Feather>["name"];

const ICONS: Record<NotificationKind, FeatherName> = {
  purchase: "shopping-cart",
  message: "message-circle",
  promo: "tag",
  shipping: "truck",
};

type NotificationRowProps = {
  item: AppNotification;
  onPress?: (item: AppNotification) => void;
};

function NotificationRowBase({ item, onPress }: NotificationRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        pressed && onPress && { opacity: 0.7 },
      ]}
      onPress={() => onPress?.(item)}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${item.title}. ${item.body}`}
    >
      <View style={styles.iconWrap}>
        <Feather name={ICONS[item.kind]} size={20} color={colors.textPrimary} />
      </View>

      <View style={styles.text}>
        <View style={styles.titleRow}>
          <AppText
            size={14}
            weight="bold"
            numberOfLines={1}
            style={styles.title}
          >
            {item.title}
          </AppText>
          {!item.read && <View style={styles.dot} />}
        </View>

        <AppText
          size={12}
          weight="medium"
          color="textSecondary"
          lineHeight={18}
          numberOfLines={3}
        >
          {item.body}
        </AppText>
      </View>

      <AppText size={11} weight="medium" color="textPlaceholder">
        {timeAgo(item.createdAt)}
      </AppText>
    </Pressable>
  );
}

export const NotificationRow = React.memo(NotificationRowBase);

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
      paddingVertical: 16,
    },
    iconWrap: {
      height: 44,
      width: 44,
      borderRadius: 22,
      backgroundColor: c.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      flex: 1,
      gap: 4,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    title: {
      flexShrink: 1,
    },
    dot: {
      height: 8,
      width: 8,
      borderRadius: 4,
      backgroundColor: c.primary,
    },
  });
