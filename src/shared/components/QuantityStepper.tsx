import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppText } from "@/shared/components/AppText";
import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantityStepperProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const canDecrease = value > min;
  const canIncrease = value < max;

  const change = (next: number) => {
    Haptics.selectionAsync();
    onChange(next);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, styles.minus, !canDecrease && styles.disabled]}
        onPress={() => change(value - 1)}
        disabled={!canDecrease}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
      >
        <Feather name="minus" size={16} color={colors.textPrimary} />
      </TouchableOpacity>

      <AppText weight="bold" size={15} align="center" style={styles.value}>
        {String(value)}
      </AppText>

      <TouchableOpacity
        style={[styles.btn, styles.plus, !canIncrease && styles.disabled]}
        onPress={() => change(value + 1)}
        disabled={!canIncrease}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
      >
        <Feather name="plus" size={16} color={colors.background} />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      padding: 4,
      borderRadius: 999,
      backgroundColor: c.surfaceMuted,
      borderWidth: 1,
      borderColor: c.border,
    },
    btn: {
      height: 30,
      width: 30,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
    },
    minus: {
      backgroundColor: c.surface,
    },
    plus: {
      backgroundColor: c.textPrimary,
    },
    disabled: {
      opacity: 0.35,
    },
    value: {
      minWidth: 22,
    },
  });
