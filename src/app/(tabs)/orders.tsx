import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { useOrders } from "@/features/orders/hooks";
import { useBuyAgain } from "@/features/orders/hooks/useBuyAgain";
import type { Order } from "@/features/orders/types";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { FadeInView } from "@/shared/components/FadeInView";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { Skeleton } from "@/shared/components/Skeleton";
import { TopTabs } from "@/shared/components/TopTabs";
import { useRefresh } from "@/shared/hooks/useRefresh";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

const TABS = ["My Order", "History"];
const SKELETONS = [{ id: "s1" }, { id: "s2" }, { id: "s3" }];

type Item = Order | { id: string };

export default function OrdersScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { tab } = useLocalSearchParams<{ tab?: string }>();

  const [index, setIndex] = useState(0);
  const active = useOrders("active");
  const history = useOrders("history");
  const query = index === 0 ? active : history;

  const buyAgain = useBuyAgain();
  const { refreshing, onRefresh } = useRefresh(query.refetch);

  // Lets other screens open the History tab, for example after "Mark as Done"
  useEffect(() => {
    if (tab === "history") setIndex(1);
  }, [tab]);

  const orders = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );

  const handleDetail = useCallback((order: Order) => {
    router.push({ pathname: "/order-details/[id]", params: { id: order.id } });
  }, []);

  const handleTracking = useCallback((order: Order) => {
    router.push({ pathname: "/order-tracking/[id]", params: { id: order.id } });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Item }) =>
      "number" in item ? (
        <OrderCard
          order={item}
          onDetail={handleDetail}
          onTracking={handleTracking}
          onBuyAgain={buyAgain}
        />
      ) : (
        <Skeleton width="100%" height={170} radius={16} />
      ),
    [handleDetail, handleTracking, buyAgain],
  );

  const data: Item[] = query.isLoading ? SKELETONS : orders;

  return (
    <View style={styles.container}>
      <ScreenHeader title="My Order" showBack={false} />

      <TopTabs tabs={TABS} activeIndex={index} onChange={setIndex} />

      <FadeInView key={index} style={styles.flex} duration={350} distance={12}>
        <FlatList<Item>
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.gap} />}
          contentContainerStyle={[
            styles.listContent,
            data.length === 0 && styles.listEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          onEndReached={() => {
            if (query.hasNextPage && !query.isFetchingNextPage)
              query.fetchNextPage();
          }}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            query.isFetchingNextPage ? (
              <View style={styles.footer}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            query.isError ? (
              <ErrorState error={query.error} onRetry={() => query.refetch()} />
            ) : index === 0 ? (
              <EmptyState
                icon="package"
                title="No active orders"
                subtitle="When you place an order, you can follow it here."
                actionLabel="Start Shopping"
                onAction={() => router.navigate("/(tabs)/home")}
              />
            ) : (
              <EmptyState
                icon="clock"
                title="No order history yet"
                subtitle="Completed orders will show up here."
              />
            )
          }
        />
      </FadeInView>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    flex: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    listEmpty: {
      flexGrow: 1,
    },
    gap: {
      height: 16,
    },
    footer: {
      paddingVertical: 16,
    },
  });
