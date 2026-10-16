import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { fonts } from "@/core/theme/typography";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { formatPrice } from "@/shared/utils/formatPrice";
import Feather from "@expo/vector-icons/Feather";
import { useMemo, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CartSummaryProps = {
  subtotal: number;
  shipping: number;
  selectedCount: number;
  onCheckout: () => void;
  onApplyPromo?: (code: string) => void;
  /** Add the bottom safe-area padding. Turn off when a tab bar sits below. Defaults to true */
  bottomInset?: boolean;
};

export function CartSummary({
  subtotal,
  shipping,
  selectedCount,
  onCheckout,
  onApplyPromo,
  bottomInset = true,
}: CartSummaryProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [promo, setPromo] = useState("");

  const total = subtotal + shipping;

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: bottomInset ? insets.bottom + 16 : 16 },
      ]}
    >
      <View style={styles.handle} />

      <View style={styles.promoRow}>
        <Feather name="percent" size={18} color={colors.textPlaceholder} />
        <TextInput
          style={styles.promoInput}
          placeholder="Enter your promo code"
          placeholderTextColor={colors.textPlaceholder}
          value={promo}
          onChangeText={setPromo}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <TouchableOpacity
          onPress={() => onApplyPromo?.(promo.trim())}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Apply promo code"
        >
          <Feather
            name="chevron-right"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.rows}>
        <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
        <SummaryRow label="Shipping" value={formatPrice(shipping)} />

        <View style={styles.dashedWrap}>
          <View style={styles.dashed} />
        </View>

        <SummaryRow label="Total amount" value={formatPrice(total)} strong />
      </View>

      <Button
        label={selectedCount > 0 ? "Checkout" : "Select items to checkout"}
        size="lg"
        disabled={selectedCount === 0}
        onPress={onCheckout}
      />
    </View>
  );
}

function SummaryRow({
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
      backgroundColor: c.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 10,
      gap: 18,
      shadowColor: c.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: -4 },
      elevation: 12,
    },
    handle: {
      alignSelf: "center",
      width: 44,
      height: 5,
      borderRadius: 3,
      backgroundColor: c.handle,
    },
    promoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      height: 52,
      paddingHorizontal: 14,
      borderRadius: 12,
      backgroundColor: c.surfaceMuted,
      borderWidth: 1,
      borderColor: c.border,
    },
    promoInput: {
      flex: 1,
      color: c.textPrimary,
      fontFamily: fonts.medium,
      fontSize: 14,
    },
    rows: {
      gap: 14,
    },
    dashedWrap: {
      height: 1,
      overflow: "hidden",
    },
    // Dashed borders on a single side break on Android, so a bordered box is clipped instead
    dashed: {
      height: 2,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: c.borderStrong,
      borderRadius: 1,
    },
  });
