import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppText } from "@/shared/components/AppText";
import { Checkbox } from "@/shared/components/Checkbox";
import { QuantityStepper } from "@/shared/components/QuantityStepper";
import { formatPrice } from "@/shared/utils/formatPrice";
import type { CartItem } from "@/store/cartStore";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type CartItemRowProps = {
  item: CartItem;
  onToggle: (key: string) => void;
  onQuantityChange: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
};

function CartItemRowBase({
  item,
  onToggle,
  onQuantityChange,
  onRemove,
}: CartItemRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      <Checkbox
        checked={item.selected}
        onChange={() => onToggle(item.key)}
        accessibilityLabel={`Select ${item.name}`}
      />

      <Image
        source={item.image}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />

      <View style={styles.info}>
        <View style={styles.topRow}>
          <AppText
            size={14}
            weight="bold"
            numberOfLines={2}
            style={styles.name}
          >
            {item.name}
          </AppText>

          <TouchableOpacity
            onPress={() => onRemove(item.key)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${item.name}`}
          >
            <Feather name="trash-2" size={17} color={colors.textPlaceholder} />
          </TouchableOpacity>
        </View>

        {item.color && (
          <View style={styles.colorRow}>
            <AppText size={12} weight="medium" color="textSecondary">
              Color:{" "}
            </AppText>
            <AppText size={12} weight="semibold">
              {item.color.name}
            </AppText>
          </View>
        )}

        <View style={styles.bottomRow}>
          <QuantityStepper
            value={item.quantity}
            onChange={(value) => onQuantityChange(item.key, value)}
            min={1}
            max={item.stock ?? 99}
          />
          <AppText size={18} weight="bold">
            {formatPrice(item.price * item.quantity)}
          </AppText>
        </View>
      </View>
    </View>
  );
}

export const CartItemRow = React.memo(CartItemRowBase);

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 16,
    },
    image: {
      height: 96,
      width: 76,
      borderRadius: 10,
      backgroundColor: c.surfaceMuted,
    },
    info: {
      flex: 1,
      gap: 6,
    },
    topRow: {
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
    },
  });
