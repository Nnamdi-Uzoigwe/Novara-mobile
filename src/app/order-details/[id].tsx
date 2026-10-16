import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { formatAddress } from "@/features/checkout/components/AddressCard";
import { OrderProductRow } from "@/features/checkout/components/OrderProductRow";
import { useBuyAgain } from "@/features/orders/hooks/useBuyAgain";
import { formatOrderDate, shortId } from "@/features/orders/utils";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { formatPrice } from "@/shared/utils/formatPrice";
import { useOrdersStore } from "@/store/ordersStore";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const order = useOrdersStore((s) => s.orders.find((o) => o.id === id));
  const buyAgain = useBuyAgain();

  if (!order) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Order Details" />
        <View style={styles.center}>
          <AppText weight="semibold" color="textSecondary">
            Order not found
          </AppText>
          <Button
            label="Go back"
            fullWidth={false}
            onPress={() => router.back()}
          />
        </View>
      </View>
    );
  }

  const completed = order.status === "completed";

  return (
    <View style={styles.container}>
      <ScreenHeader title="Order Details" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryText}>
            <AppText size={18} weight="bold">
              {`Order ${shortId(order.id)}`}
            </AppText>
            <AppText size={12} weight="medium" color="textSecondary">
              {formatOrderDate(order.createdAt)}
            </AppText>
          </View>
          <StatusBadge
            label={completed ? "Completed" : "On Progress"}
            tone={completed ? "success" : "primary"}
          />
        </View>

        {/* Address */}
        <View style={styles.section}>
          <AppText size={18} weight="bold">
            Delivery Address
          </AppText>
          <View style={styles.block}>
            <AppText size={14} weight="bold">
              {order.address.label}
            </AppText>
            <AppText
              size={13}
              weight="medium"
              color="textSecondary"
              lineHeight={20}
            >
              {formatAddress(order.address)}
            </AppText>
          </View>
        </View>

        {/* Products */}
        <View style={styles.section}>
          <AppText size={18} weight="bold">
            {`Products (${order.items.length})`}
          </AppText>
          <View style={styles.products}>
            {order.items.map((item) => (
              <OrderProductRow key={item.key} item={item} />
            ))}
          </View>
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <AppText size={18} weight="bold">
            Payment Method
          </AppText>
          <View style={styles.block}>
            <AppText size={14} weight="bold">
              {order.paymentTitle}
            </AppText>
            <AppText size={13} weight="medium" color="textSecondary">
              {order.paymentDetail}
            </AppText>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          <Row label="Shipping" value={formatPrice(order.shipping)} />
          <View style={styles.divider} />
          <Row label="Total amount" value={formatPrice(order.total)} strong />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {completed ? (
          <Button label="Buy Again" size="lg" onPress={() => buyAgain(order)} />
        ) : (
          <Button
            label="Track Order"
            size="lg"
            onPress={() =>
              router.push({
                pathname: "/order-tracking/[id]",
                params: { id: order.id },
              })
            }
          />
        )}
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <View style={rowStyles.row}>
      <AppText
        size={14}
        weight={strong ? "semibold" : "medium"}
        color="textSecondary"
      >
        {label}
      </AppText>
      <AppText size={strong ? 20 : 16} weight="bold">
        {value}
      </AppText>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 24,
      gap: 26,
    },
    summaryRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    summaryText: {
      flex: 1,
      gap: 4,
    },
    section: {
      gap: 14,
    },
    block: {
      padding: 16,
      borderRadius: 14,
      backgroundColor: c.surfaceMuted,
      gap: 5,
    },
    products: {
      gap: 16,
    },
    totals: {
      gap: 14,
      padding: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
    },
    divider: {
      height: 1,
      backgroundColor: c.border,
    },
    footer: {
      paddingHorizontal: 20,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: c.border,
      backgroundColor: c.background,
    },
  });
