import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AddressCard } from "@/features/checkout/components/AddressCard";
import { OrderProductRow } from "@/features/checkout/components/OrderProductRow";
import { PaymentIcon } from "@/features/checkout/components/PaymentIcon";
import { PaymentSheet } from "@/features/checkout/components/PaymentSheet";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { formatPrice } from "@/shared/utils/formatPrice";
import { useAddressStore } from "@/store/addressStore";
import { SHIPPING_FEE, useCartStore, type CartItem } from "@/store/cartStore";
import { useOrdersStore } from "@/store/ordersStore";
import { usePaymentStore } from "@/store/paymentStore";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function PaymentScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const items = useCartStore((s) => s.items);
  const removeSelected = useCartStore((s) => s.removeSelected);
  const placeOrder = useOrdersStore((s) => s.placeOrder);

  const address = useAddressStore((s) => s.selected);

  const methods = usePaymentStore((s) => s.methods);
  const selectedId = usePaymentStore((s) => s.selectedId);
  const selectMethod = usePaymentStore((s) => s.select);
  const method = useMemo(
    () => methods.find((m) => m.id === selectedId) ?? null,
    [methods, selectedId],
  );

  const selectedItems = useMemo(() => items.filter((i) => i.selected), [items]);

  // After paying, the cart items are removed, so the screen keeps showing a frozen copy
  const [snapshot, setSnapshot] = useState<CartItem[] | null>(null);
  const displayItems = snapshot ?? selectedItems;

  const subtotal = useMemo(
    () => displayItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [displayItems],
  );
  const shipping = displayItems.length > 0 ? SHIPPING_FEE : 0;
  const total = subtotal + shipping;

  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetMode, setSheetMode] = useState<"methods" | "success">("methods");
  const [paying, setPaying] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const openSheet = () => {
    setSheetMode("methods");
    setSheetVisible(true);
  };

  const handleAddMethod = () => {
    setSheetVisible(false);
    router.push("/add-card");
  };

  const handleConfirmPayment = async () => {
    if (!address || !method || paying) return;

    setPaying(true);
    await wait(900); // TODO: charge through your payment provider and wait for the result

    const order = placeOrder({
      items: displayItems,
      address,
      paymentTitle: method.title,
      paymentDetail: method.detail,
      subtotal,
      shipping,
      total,
    });
    setPlacedOrderId(order.id);

    setSnapshot(displayItems);
    removeSelected();
    setPaying(false);
    setSheetMode("success");
  };

  const handleSheetClose = () => {
    if (paying) return;
    if (sheetMode === "success") {
      setSheetVisible(false);
      router.navigate("/(tabs)/home");
      return;
    }
    setSheetVisible(false);
  };

  const handleTrackOrder = () => {
    setSheetVisible(false);
    // Go to the Orders tab first, so Back from tracking lands on the orders list
    router.navigate("/(tabs)/orders");
    if (placedOrderId) {
      router.push({
        pathname: "/order-tracking/[id]",
        params: { id: placedOrderId },
      });
    }
  };

  const canCheckout = !!address && !!method;
  const hint = !address
    ? "Choose a delivery address to continue"
    : !method
      ? "Choose a payment method to continue"
      : null;

  if (displayItems.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Payment" />
        <View style={styles.empty}>
          <AppText size={18} weight="bold" align="center">
            No items selected
          </AppText>
          <AppText
            size={14}
            weight="medium"
            color="textSecondary"
            align="center"
          >
            Select items in your cart to check out.
          </AppText>
          <Button
            label="Back to Cart"
            fullWidth={false}
            onPress={() => router.navigate("/(tabs)/cart")}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Payment" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText size={18} weight="bold">
              Address
            </AppText>
            {address && (
              <TouchableOpacity
                onPress={() => router.push("/address")}
                hitSlop={10}
              >
                <AppText size={13} weight="bold" color="primary">
                  Edit
                </AppText>
              </TouchableOpacity>
            )}
          </View>
          <AddressCard
            address={address}
            onPress={() => router.push("/address")}
          />
        </View>

        {/* Products */}
        <View style={styles.section}>
          <AppText size={18} weight="bold">
            {`Products (${displayItems.length})`}
          </AppText>
          <View style={styles.products}>
            {displayItems.map((item) => (
              <OrderProductRow key={item.key} item={item} />
            ))}
          </View>
        </View>

        {/* Payment method */}
        <View style={styles.section}>
          <AppText size={18} weight="bold">
            Payment Method
          </AppText>

          <Pressable
            style={styles.methodCard}
            onPress={openSheet}
            accessibilityRole="button"
            accessibilityLabel="Choose payment method"
          >
            {method ? (
              <>
                <PaymentIcon type={method.type} />
                <View style={styles.methodText}>
                  <AppText size={14} weight="bold">
                    {method.title}
                  </AppText>
                  <AppText size={12} weight="medium" color="textSecondary">
                    {method.detail}
                  </AppText>
                </View>
              </>
            ) : (
              <View style={styles.methodText}>
                <AppText size={14} weight="semibold" color="primary">
                  Choose payment method
                </AppText>
              </View>
            )}
            <Feather
              name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>
      </ScrollView>

      {/* Fixed bottom bar */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.totalRow}>
          <AppText size={14} weight="medium" color="textSecondary">
            Total amount
          </AppText>
          <AppText size={22} weight="bold">
            {formatPrice(total)}
          </AppText>
        </View>

        {hint && (
          <AppText
            size={12}
            weight="medium"
            color="textSecondary"
            align="center"
          >
            {hint}
          </AppText>
        )}

        <Button
          label="Checkout Now"
          size="lg"
          disabled={!canCheckout}
          onPress={openSheet}
        />
      </View>

      <PaymentSheet
        visible={sheetVisible}
        mode={sheetMode}
        methods={methods}
        selectedId={selectedId}
        loading={paying}
        onSelect={selectMethod}
        onAddMethod={handleAddMethod}
        onConfirm={handleConfirmPayment}
        onClose={handleSheetClose}
        onTrackOrder={handleTrackOrder}
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
    content: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 24,
      gap: 28,
    },
    section: {
      gap: 14,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    products: {
      gap: 16,
    },
    methodCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    methodText: {
      flex: 1,
      gap: 3,
    },
    footer: {
      paddingHorizontal: 20,
      paddingTop: 14,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: c.border,
      backgroundColor: c.background,
    },
    totalRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    empty: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
      gap: 12,
    },
  });
