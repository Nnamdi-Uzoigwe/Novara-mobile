import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { formatAddress } from "@/features/addresses/format";
import type { Address } from "@/features/addresses/types";
import { AppText } from "@/shared/components/AppText";
import { Skeleton } from "@/shared/components/Skeleton";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type AddressCardProps = {
  address: Address | null;
  loading?: boolean;
  onPress: () => void;
};

export function AddressCard({
  address,
  loading = false,
  onPress,
}: AddressCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (loading) return <Skeleton width="100%" height={72} radius={12} />;

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
          Add a delivery address
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
      <View style={styles.map}>
        <Ionicons name="location" size={30} color={colors.danger} />
      </View>

      <View style={styles.text}>
        <AppText size={16} weight="bold">
          {address.label}
        </AppText>
        <AppText size={12} weight="semibold">
          {`${address.recipientName} · ${address.phone}`}
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
      gap: 3,
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
