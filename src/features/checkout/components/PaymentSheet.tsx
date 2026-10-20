import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { PaymentIcon } from "@/features/checkout/components/PaymentIcon";
import type { PaymentMethod } from "@/features/checkout/types";
import { AppText } from "@/shared/components/AppText";
import { BottomSheet } from "@/shared/components/BottomSheet";
import { Button } from "@/shared/components/Button";
import { Checkbox } from "@/shared/components/Checkbox";
import { FadeInView } from "@/shared/components/FadeInView";
import Feather from "@expo/vector-icons/Feather";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

type PaymentSheetProps = {
  visible: boolean;
  /** "methods" shows the picker, "success" shows the order confirmation */
  mode: "methods" | "success";
  methods: PaymentMethod[];
  selectedId: string | null;
  loading?: boolean;
  onSelect: (id: string) => void;
  onAddMethod: () => void;
  onConfirm: () => void;
  onClose: () => void;
  onTrackOrder: () => void;
};

export function PaymentSheet({
  visible,
  mode,
  methods,
  selectedId,
  loading = false,
  onSelect,
  onAddMethod,
  onConfirm,
  onClose,
  onTrackOrder,
}: PaymentSheetProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      dismissOnBackdrop={mode === "methods" && !loading}
    >
      <FadeInView key={mode} duration={300} distance={12}>
        {mode === "methods" ? (
          <View style={styles.content}>
            <AppText size={18} weight="bold">
              Payment Method
            </AppText>

            <ScrollView
              style={styles.listScroll}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {methods.map((method) => {
                const selected = method.id === selectedId;
                return (
                  <Pressable
                    key={method.id}
                    style={[styles.row, selected && styles.rowSelected]}
                    onPress={() => onSelect(method.id)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${method.title}, ${method.detail}`}
                  >
                    <PaymentIcon type={method.type} size={44} />
                    <View style={styles.rowText}>
                      <AppText size={14} weight="bold">
                        {method.title}
                      </AppText>
                      <AppText size={12} weight="medium" color="textSecondary">
                        {method.detail}
                      </AppText>
                    </View>
                    <Checkbox
                      checked={selected}
                      onChange={() => onSelect(method.id)}
                    />
                  </Pressable>
                );
              })}

              <Pressable
                style={styles.addRow}
                onPress={onAddMethod}
                accessibilityRole="button"
                accessibilityLabel="Add payment method"
              >
                <Feather
                  name="plus-circle"
                  size={24}
                  color={colors.textSecondary}
                />
                <AppText size={14} weight="semibold">
                  Add Payment Method
                </AppText>
              </Pressable>
            </ScrollView>

            <Button
              label="Confirm Payment"
              size="lg"
              loading={loading}
              disabled={!selectedId}
              onPress={onConfirm}
            />
          </View>
        ) : (
          <View style={styles.content}>
            {/* TODO: replace with <Image source={require("@/assets/images/order-success.png")} /> */}
            <View style={styles.illustration}>
              <Feather name="truck" size={64} color={colors.primary} />
            </View>

            <View style={styles.successText}>
              <AppText size={22} weight="bold" align="center">
                Order Successful!
              </AppText>
              <AppText
                size={13}
                weight="medium"
                color="textSecondary"
                align="center"
                lineHeight={20}
              >
                Your order will be packed by the clerk, we will arrive at your
                house in 3 to 4 days.
              </AppText>
            </View>

            <Button label="Order Tracking" size="lg" onPress={onTrackOrder} />
          </View>
        )}
      </FadeInView>
    </BottomSheet>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    content: {
      gap: 18,
    },
    listScroll: {
      maxHeight: 300,
    },
    list: {
      gap: 12,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    rowSelected: {
      borderColor: c.primary,
      backgroundColor: c.surfaceMuted,
    },
    rowText: {
      flex: 1,
      gap: 3,
    },
    addRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderRadius: 14,
      backgroundColor: c.surfaceMuted,
    },
    illustration: {
      alignSelf: "center",
      height: 150,
      width: 150,
      borderRadius: 75,
      backgroundColor: c.primary + "22",
      alignItems: "center",
      justifyContent: "center",
    },
    successText: {
      gap: 8,
      paddingHorizontal: 8,
    },
  });
