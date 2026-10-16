import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import type { Address } from "@/features/checkout/types";
import { AppText } from "@/shared/components/AppText";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export const formatAddress = (a: Address) =>
  `${a.line1}, ${a.city}, ${a.region}, ${a.postalCode}`;

type AddressCardProps = {
  address: Address | null;
  onPress: () => void;
};

export function AddressCard({ address, onPress }: AddressCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!address) {
    return (
      <Pressable
        style={styles.empty}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Choose delivery address"
      >
        <Feather name="plus-circle" size={22} color={colors.primary} />
        <AppText size={14} weight="semibold" color="primary">
          Choose delivery address
        </AppText>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Delivery address: ${formatAddress(address)}`}
    >
      {/* TODO: swap for a real static map image */}
      <View style={styles.map}>
        <Ionicons name="location" size={30} color={colors.danger} />
      </View>

      <View style={styles.text}>
        <AppText size={16} weight="bold">
          {address.label}
        </AppText>
        <AppText
          size={12}
          weight="medium"
          color="textSecondary"
          lineHeight={18}
          numberOfLines={3}
        >
          {formatAddress(address)}
        </AppText>
      </View>
    </Pressable>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    map: {
      height: 72,
      width: 100,
      borderRadius: 12,
      backgroundColor: c.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      flex: 1,
      gap: 4,
    },
    empty: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      height: 72,
      borderRadius: 12,
      borderWidth: 1.5,
      borderStyle: "dashed",
      borderColor: c.primary,
    },
  });
