import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { CartItemRow } from "@/features/cart/components/CartItemRow";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import {
  SHIPPING_FEE,
  useCartStore,
  useCartSubtotal,
  useSelectedCount,
} from "@/store/cartStore";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useMemo } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CartViewProps = {
  /** Show a back arrow. Only needed if the cart is ever opened as a stack screen */
  showBack?: boolean;
  /** Add the bottom safe-area padding to the summary. Not needed above the tab bar */
  bottomInset?: boolean;
};

export function CartView({
  showBack = false,
  bottomInset = false,
}: CartViewProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const items = useCartStore((s) => s.items);
  const toggleSelected = useCartStore((s) => s.toggleSelected);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = useCartSubtotal();
  const selectedCount = useSelectedCount();
  const shipping = selectedCount > 0 ? SHIPPING_FEE : 0;

  const handleCheckout = () => {
    router.push("/payment");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerSide}>
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Feather name="arrow-left" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
        </View>

        <AppText weight="semibold" size={16}>
          My Cart
        </AppText>

        <View style={styles.headerSide} />
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Feather name="shopping-bag" size={40} color={colors.primary} />
          </View>
          <AppText size={20} weight="bold" align="center">
            Your cart is empty
          </AppText>
          <AppText
            size={14}
            weight="medium"
            color="textSecondary"
            align="center"
          >
            Browse the latest products and add something you like.
          </AppText>
          <View style={{ justifyContent: "center" }}>
            <Button
              label="Start Shopping"
              fullWidth={false}
              onPress={() => router.navigate("/(tabs)/home")}
            />
          </View>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <CartItemRow
                item={item}
                onToggle={toggleSelected}
                onQuantityChange={setQuantity}
                onRemove={removeItem}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            selectedCount={selectedCount}
            onCheckout={handleCheckout}
            bottomInset={bottomInset}
          />
        </>
      )}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    header: {
      height: 52,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
    },
    headerSide: {
      width: 40,
      justifyContent: "center",
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 12,
    },
    separator: {
      height: 1,
      backgroundColor: c.border,
    },
    empty: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
      gap: 12,
    },
    emptyIcon: {
      height: 96,
      width: 96,
      borderRadius: 48,
      backgroundColor: c.primary + "1F",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
  });
