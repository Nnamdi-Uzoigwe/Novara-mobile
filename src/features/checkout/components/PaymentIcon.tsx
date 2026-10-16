import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import type { PaymentMethod } from "@/features/checkout/types";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

type PaymentIconProps = {
  type: PaymentMethod["type"];
  size?: number;
};

export function PaymentIcon({ type, size = 46 }: PaymentIconProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={[
        styles.circle,
        { height: size, width: size, borderRadius: size / 2 },
      ]}
    >
      {type === "mastercard" && (
        <View style={styles.mc}>
          <View style={[styles.mcDot, { backgroundColor: "#EB001B" }]} />
          <View
            style={[
              styles.mcDot,
              styles.mcRight,
              { backgroundColor: "#F79E1B" },
            ]}
          />
        </View>
      )}
      {type === "paypal" && (
        <Ionicons name="logo-paypal" size={22} color="#003087" />
      )}
      {(type === "visa" || type === "card") && (
        <Feather name="credit-card" size={22} color={colors.textPrimary} />
      )}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    circle: {
      backgroundColor: c.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    mc: {
      width: 30,
      height: 18,
    },
    mcDot: {
      position: "absolute",
      top: 0,
      left: 0,
      height: 18,
      width: 18,
      borderRadius: 9,
    },
    mcRight: {
      left: 12,
      opacity: 0.9,
    },
  });
