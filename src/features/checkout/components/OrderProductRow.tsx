import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppText } from "@/shared/components/AppText";
import { formatPrice } from "@/shared/utils/formatPrice";
import type { CartItem } from "@/store/cartStore";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

type OrderProductRowProps = {
  item: CartItem;
};

function OrderProductRowBase({ item }: OrderProductRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      <Image
        source={item.image}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />

      <View style={styles.info}>
        <AppText size={14} weight="bold" numberOfLines={2}>
          {item.name}
        </AppText>

        <View style={styles.meta}>
          {item.color && (
            <View style={styles.metaItem}>
              <AppText size={12} weight="medium" color="textSecondary">
                Color:{" "}
              </AppText>
              <AppText size={12} weight="semibold">
                {item.color.name}
              </AppText>
            </View>
          )}
          {item.quantity > 1 && (
            <AppText size={12} weight="medium" color="textSecondary">
              {`Qty: ${item.quantity}`}
            </AppText>
          )}
        </View>
      </View>

      <AppText size={16} weight="bold">
        {formatPrice(item.price * item.quantity)}
      </AppText>
    </View>
  );
}

export const OrderProductRow = React.memo(OrderProductRowBase);

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    image: {
      height: 60,
      width: 60,
      borderRadius: 10,
      backgroundColor: c.surfaceMuted,
    },
    info: {
      flex: 1,
      gap: 4,
    },
    meta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
