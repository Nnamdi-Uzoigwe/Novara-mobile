import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppText } from "@/shared/components/AppText";
import { Avatar } from "@/shared/components/Avatar";
import { timeAgo } from "@/shared/utils/timeAgo";
import type {
    AppNotification,
    NotificationKind,
} from "@/store/notificationsStore";
import Feather from "@expo/vector-icons/Feather";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

type FeatherName = React.ComponentProps<typeof Feather>["name"];

const ICONS: Record<NotificationKind, FeatherName> = {
  purchase: "shopping-cart",
  message: "message-circle",
  promo: "tag",
  shipping: "truck",
};

type NotificationRowProps = {
  item: AppNotification;
  onActionPress?: (item: AppNotification) => void;
};

function NotificationRowBase({ item, onActionPress }: NotificationRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      {item.sender ? (
        <Avatar uri={item.sender.avatarUri} size={44} />
      ) : (
        <View style={styles.iconWrap}>
          <Feather
            name={ICONS[item.kind]}
            size={20}
            color={colors.textPrimary}
          />
        </View>
      )}

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

        {!!item.actionLabel && (
          <AppText
            size={12}
            weight="semibold"
            color="primary"
            onPress={() => onActionPress?.(item)}
          >
            {item.actionLabel}
          </AppText>
        )}
      </View>

      <AppText size={11} weight="medium" color="textPlaceholder">
        {timeAgo(item.createdAt)}
      </AppText>
    </View>
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
