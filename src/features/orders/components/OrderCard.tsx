import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { STATUS_LABEL, STATUS_TONE } from "@/features/orders/status";
import { isActiveStatus, type Order } from "@/features/orders/types";
import { totalQuantity } from "@/features/orders/utils";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { formatPrice } from "@/shared/utils/formatPrice";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

type OrderCardProps = {
  order: Order;
  onDetail: (order: Order) => void;
  onTracking: (order: Order) => void;
  onBuyAgain: (order: Order) => void;
};

function OrderCardBase({
  order,
  onDetail,
  onTracking,
  onBuyAgain,
}: OrderCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const first = order.items[0];
  const more = order.items.length - 1;
  const active = isActiveStatus(order.status);

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        {first && (
          <Image
            source={first.image}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        )}

        <View style={styles.info}>
          <View style={styles.titleRow}>
            <AppText
              size={14}
              weight="bold"
              numberOfLines={2}
              style={styles.name}
            >
              {first?.name ?? "Order"}
            </AppText>
            <StatusBadge
              label={STATUS_LABEL[order.status]}
              tone={STATUS_TONE[order.status]}
            />
          </View>

          <AppText size={11} weight="medium" color="textSecondary">
            {`Order ${order.number}`}
          </AppText>

          {first?.color && (
            <View style={styles.colorRow}>
              <AppText size={12} weight="medium" color="textSecondary">
                Color:{" "}
              </AppText>
              <AppText size={12} weight="semibold">
                {first.color.name}
              </AppText>
            </View>
          )}

          {more > 0 && (
            <AppText size={12} weight="semibold" color="primary">
              {`+${more} more ${more === 1 ? "item" : "items"}`}
            </AppText>
          )}

          <View style={styles.bottomRow}>
            <AppText size={12} weight="medium" color="textSecondary">
              {`Qty: ${totalQuantity(order)}`}
            </AppText>
            <AppText size={18} weight="bold">
              {formatPrice(order.total)}
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label="Detail"
          variant="outline"
          size="sm"
          fullWidth={false}
          style={styles.actionBtn}
          onPress={() => onDetail(order)}
        />
        <Button
          label={active ? "Tracking" : "Buy Again"}
          size="sm"
          fullWidth={false}
          style={styles.actionBtn}
          onPress={() => (active ? onTracking(order) : onBuyAgain(order))}
        />
      </View>
    </View>
  );
}

export const OrderCard = React.memo(OrderCardBase);

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      gap: 14,
    },
    top: {
      flexDirection: "row",
      gap: 12,
    },
    image: {
      height: 96,
      width: 68,
      borderRadius: 10,
      backgroundColor: c.surfaceMuted,
    },
    info: {
      flex: 1,
      gap: 4,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
    },
    name: {
      flex: 1,
    },
    colorRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    bottomRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "auto",
    },
    actions: {
      flexDirection: "row",
      gap: 12,
    },
    actionBtn: {
      flex: 1,
    },
  });
