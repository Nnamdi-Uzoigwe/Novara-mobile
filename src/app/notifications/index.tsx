import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { NotificationRow } from "@/features/notifications/components/NotificationRow";
import { AppText } from "@/shared/components/AppText";
import { EmptyState } from "@/shared/components/EmptyState";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import {
    useNotificationsStore,
    type AppNotification,
} from "@/store/notificationsStore";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const items = useNotificationsStore((s) => s.items);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);

  // Unread dots stay visible while you read, then clear when you leave the screen
  useEffect(() => () => markAllRead(), [markAllRead]);

  const handleAction = useCallback((item: AppNotification) => {
    // TODO: open the chat screen for messages once it exists
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: AppNotification }) => (
      <NotificationRow item={item} onActionPress={handleAction} />
    ),
    [handleAction],
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Notification"
        right={
          <TouchableOpacity
            onPress={() => router.push("/notifications/settings")}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Notification settings"
          >
            <Feather name="settings" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          items.length > 0 ? (
            <AppText size={18} weight="bold" style={styles.sectionTitle}>
              Recent
            </AppText>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="bell"
            title="No notifications"
            subtitle="Order updates and offers will show up here."
          />
        }
        contentContainerStyle={[
          styles.listContent,
          items.length === 0 && styles.grow,
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    sectionTitle: {
      marginTop: 8,
      marginBottom: 4,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    grow: {
      flexGrow: 1,
    },
    separator: {
      height: 1,
      backgroundColor: c.border,
    },
  });
