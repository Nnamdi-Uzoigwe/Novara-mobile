import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { NotificationRow } from "@/features/notifications/components/NotificationRow";
import { markAllRead, useNotifications } from "@/features/notifications/hooks";
import type { AppNotification } from "@/features/notifications/types";
import { AppText } from "@/shared/components/AppText";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { Skeleton } from "@/shared/components/Skeleton";
import { useRefresh } from "@/shared/hooks/useRefresh";
import Feather from "@expo/vector-icons/Feather";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const SKELETONS = [{ id: "s1" }, { id: "s2" }, { id: "s3" }, { id: "s4" }];

type Item = AppNotification | { id: string };

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const client = useQueryClient();

  const { data, isLoading, error, refetch } = useNotifications();
  const { refreshing, onRefresh } = useRefresh(refetch);

  // Unread dots stay visible while you read, then clear when you leave the screen
  useEffect(() => () => void markAllRead(client), [client]);

  const items = data?.items ?? [];
  const listData: Item[] = isLoading ? SKELETONS : items;

  const handlePress = useCallback((item: AppNotification) => {
    if (item.orderId) {
      router.push({
        pathname: "/order-details/[id]",
        params: { id: item.orderId },
      });
    }
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Item }) =>
      "title" in item ? (
        <NotificationRow
          item={item}
          onPress={item.orderId ? handlePress : undefined}
        />
      ) : (
        <View style={styles.skeletonRow}>
          <Skeleton width={44} height={44} radius={22} />
          <View style={styles.skeletonText}>
            <Skeleton width="55%" height={14} />
            <Skeleton width="90%" height={12} />
          </View>
        </View>
      ),
    [handlePress, styles],
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

      <FlatList<Item>
        data={listData}
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
          error ? (
            <ErrorState error={error} onRetry={() => refetch()} />
          ) : (
            <EmptyState
              icon="bell"
              title="No notifications"
              subtitle="Order updates will show up here."
            />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          listData.length === 0 && styles.grow,
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
    skeletonRow: {
      flexDirection: "row",
      gap: 12,
      paddingVertical: 16,
    },
    skeletonText: {
      flex: 1,
      gap: 8,
    },
  });
