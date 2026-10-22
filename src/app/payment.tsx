import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { useSelectedAddress } from "@/features/addresses/hooks";
import { AddressCard } from "@/features/checkout/components/AddressCard";
import { OrderProductRow } from "@/features/checkout/components/OrderProductRow";
import { PaymentIcon } from "@/features/checkout/components/PaymentIcon";
import { PaymentSheet } from "@/features/checkout/components/PaymentSheet";
import { handleOrderError } from "@/features/checkout/handleOrderError";
import { useShippingFee } from "@/features/checkout/hooks";
import { newRequestId } from "@/features/checkout/requestId";
import { usePlaceOrder } from "@/features/orders/hooks";
import type { Order } from "@/features/orders/types";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { formatPrice } from "@/shared/utils/formatPrice";
import { useAddressStore } from "@/store/addressStore";
import { useCartStore, type CartItem } from "@/store/cartStore";
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

export default function PaymentScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const items = useCartStore((s) => s.items);
  const removeSelected = useCartStore((s) => s.removeSelected);
  const selectedItems = useMemo(() => items.filter((i) => i.selected), [items]);

  const { address, isLoading: addressLoading } = useSelectedAddress();
  const selectAddress = useAddressStore((s) => s.select);

  const methods = usePaymentStore((s) => s.methods);
  const selectedId = usePaymentStore((s) => s.selectedId);
  const selectMethod = usePaymentStore((s) => s.select);
  const method = useMemo(
    () => methods.find((m) => m.id === selectedId) ?? null,
    [methods, selectedId],
  );

  const placeOrder = usePlaceOrder();

  // After paying, the cart items are removed, so the screen keeps showing a frozen copy
  const [snapshot, setSnapshot] = useState<CartItem[] | null>(null);
  const displayItems = snapshot ?? selectedItems;

  const subtotal = useMemo(
    () => displayItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [displayItems],
  );
  const shipping = useShippingFee(subtotal);
  const total = subtotal + shipping;

  // A new id whenever the cart changes. The same cart keeps the same id, so a retry
  // after a bad connection gives back the order that was already placed
  const signature = displayItems
    .map((i) => `${i.key}:${i.quantity}:${i.price}`)
    .join("|");
  const requestId = useMemo(() => newRequestId(), [signature]);

  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetMode, setSheetMode] = useState<"methods" | "success">("methods");
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const openSheet = () => {
    setSheetMode("methods");
    setSheetVisible(true);
  };

  const handleAddMethod = () => {
    setSheetVisible(false);
    router.push("/add-card");
  };

  const handleConfirmPayment = async () => {
    if (!address || !method || placeOrder.isPending) return;

    try {
      const { order } = await placeOrder.mutateAsync({
        clientRequestId: requestId,
        addressId: address.id,
        items: displayItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
        })),
        // TODO: real payment goes here (Paystack). For now the server records a simulated payment
        payment: { method: method.title, detail: method.detail },
        expectedTotal: Math.round(total * 100) / 100,
      });

      setSnapshot(displayItems);
      removeSelected();
      setPlacedOrder(order);
      setSheetMode("success");
    } catch (err) {
      setSheetVisible(false);
      handleOrderError(err, { onAddressMissing: () => selectAddress(null) });
    }
  };

  const handleSheetClose = () => {
    if (placeOrder.isPending) return;

    setSheetVisible(false);
    if (sheetMode === "success") router.navigate("/(tabs)/home");
  };

  const handleTrackOrder = () => {
    setSheetVisible(false);
    // Orders tab first, so Back from tracking lands on the orders list
    router.navigate("/(tabs)/orders");
    if (placedOrder) {
      router.push({
        pathname: "/order-tracking/[id]",
        params: { id: placedOrder.id },
      });
    }
  };

  const canCheckout = !!address && !!method;
  const hint = !address
    ? "Add a delivery address to continue"
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
            loading={addressLoading}
            // onPress={() => router.push(address ? "/address" : "/address-form")}
            onPress={() =>
              router.push((address ? "/address" : "/address-form") as any)
            }
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
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <AppText size={13} weight="medium" color="textSecondary">
              Subtotal
            </AppText>
            <AppText size={13} weight="semibold">
              {formatPrice(subtotal)}
            </AppText>
          </View>
          <View style={styles.totalRow}>
            <AppText size={13} weight="medium" color="textSecondary">
              Shipping
            </AppText>
            <AppText size={13} weight="semibold">
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </AppText>
          </View>
          <View style={styles.totalRow}>
            <AppText size={14} weight="medium" color="textSecondary">
              Total amount
            </AppText>
            <AppText size={22} weight="bold">
              {formatPrice(total)}
            </AppText>
          </View>
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
        loading={placeOrder.isPending}
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
    totals: {
      gap: 6,
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
