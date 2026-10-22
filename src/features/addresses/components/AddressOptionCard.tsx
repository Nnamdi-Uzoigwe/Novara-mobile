import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { formatAddress } from "@/features/addresses/format";
import type { Address } from "@/features/addresses/types";
import { AppText } from "@/shared/components/AppText";
import Feather from "@expo/vector-icons/Feather";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";

type AddressOptionCardProps = {
  address: Address;
  selected: boolean;
  onPress: () => void;
  onEdit: () => void;
};

function AddressOptionCardBase({
  address,
  selected,
  onPress,
  onEdit,
}: AddressOptionCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && { transform: [{ scale: 0.99 }] },
      ]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${address.label}, ${formatAddress(address)}`}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && (
          <Feather name="check" size={13} color={colors.onPrimary} />
        )}
      </View>

      <View style={styles.text}>
        <View style={styles.titleRow}>
          <AppText size={15} weight="bold">
            {address.label}
          </AppText>
          {address.isDefault && (
            <AppText size={11} weight="bold" color="primary">
              DEFAULT
            </AppText>
          )}
        </View>
        <AppText size={13} weight="semibold">
          {`${address.recipientName} · ${address.phone}`}
        </AppText>
        <AppText
          size={12}
          weight="medium"
          color="textSecondary"
          lineHeight={18}
        >
          {formatAddress(address)}
        </AppText>
      </View>

      <TouchableOpacity
        onPress={onEdit}
        hitSlop={10}
        accessibilityLabel="Edit address"
      >
        <AppText size={13} weight="bold" color="primary">
          Edit
        </AppText>
      </TouchableOpacity>
    </Pressable>
  );
}

export const AddressOptionCard = React.memo(AddressOptionCardBase);

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
      padding: 16,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    cardSelected: {
      borderColor: c.primary,
    },
    radio: {
      marginTop: 2,
      height: 22,
      width: 22,
      borderRadius: 11,
      borderWidth: 1.5,
      borderColor: c.borderStrong,
      alignItems: "center",
      justifyContent: "center",
    },
    radioSelected: {
      borderColor: c.primary,
      backgroundColor: c.primary,
    },
    text: {
      flex: 1,
      gap: 3,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  });
