import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import type { Address } from "@/features/checkout/types";
import { AppText } from "@/shared/components/AppText";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type LocationCardProps = {
  location: Address;
  selected: boolean;
  /** Color of the pin on the map thumbnail */
  tint: string;
  onPress: () => void;
};

function LocationCardBase({
  location,
  selected,
  tint,
  onPress,
}: LocationCardProps) {
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
      accessibilityLabel={`${location.city}, ${location.description}`}
    >
      <View style={styles.text}>
        <AppText size={15} weight="bold">
          {location.city}
        </AppText>
        <AppText size={12} weight="medium" color="textSecondary">
          {location.description}
        </AppText>
      </View>

      {/* TODO: swap for a real static map image of the location */}
      <View style={[styles.thumb, selected && styles.thumbSelected]}>
        <Ionicons name="location" size={26} color={tint} />
      </View>
    </Pressable>
  );
}

export const LocationCard = React.memo(LocationCardBase);

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    cardSelected: {
      borderColor: c.primary,
    },
    text: {
      flex: 1,
      gap: 4,
      paddingRight: 12,
    },
    thumb: {
      height: 60,
      width: 60,
      borderRadius: 30,
      borderWidth: 3,
      borderColor: "transparent",
      backgroundColor: c.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    thumbSelected: {
      borderColor: c.primary,
    },
  });
