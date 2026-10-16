import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { useBuyAgain } from "@/features/orders/hooks/useBuyAgain";
import type { Order } from "@/features/orders/types";
import { EmptyState } from "@/shared/components/EmptyState";
import { FadeInView } from "@/shared/components/FadeInView";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { TopTabs } from "@/shared/components/TopTabs";
import { useOrdersStore } from "@/store/ordersStore";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const TABS = ["My Order", "History"];

export default function OrdersScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { tab } = useLocalSearchParams<{ tab?: string }>();

  const orders = useOrdersStore((s) => s.orders);
  const buyAgain = useBuyAgain();

  const [index, setIndex] = useState(0);

  // Lets other screens open the History tab, for example after "Mark as Done"
  useEffect(() => {
    if (tab === "history") setIndex(1);
  }, [tab]);

  const active = useMemo(
    () => orders.filter((order) => order.status === "in_progress"),
    [orders],
  );
  const history = useMemo(
    () => orders.filter((order) => order.status === "completed"),
    [orders],
  );
  const data = index === 0 ? active : history;

  const handleDetail = useCallback((order: Order) => {
    router.push({ pathname: "/order-details/[id]", params: { id: order.id } });
  }, []);

  const handleTracking = useCallback((order: Order) => {
    router.push({ pathname: "/order-tracking/[id]", params: { id: order.id } });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Order }) => (
      <OrderCard
        order={item}
        onDetail={handleDetail}
        onTracking={handleTracking}
        onBuyAgain={buyAgain}
      />
    ),
    [handleDetail, handleTracking, buyAgain],
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="My Order" showBack={false} />

      <TopTabs tabs={TABS} activeIndex={index} onChange={setIndex} />

      <FadeInView key={index} style={styles.flex} duration={350} distance={12}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.gap} />}
          contentContainerStyle={[
            styles.listContent,
            data.length === 0 && styles.listEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            index === 0 ? (
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
  });
