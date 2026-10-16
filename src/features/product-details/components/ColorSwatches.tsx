import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type ColorSwatchesProps = {
  colors: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

// Picks a dark check mark on light swatches so it stays visible
const isLight = (hex: string) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
};

export function ColorSwatches({
  colors: swatches,
  selectedIndex,
  onSelect,
}: ColorSwatchesProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      {swatches.map((hex, index) => {
        const selected = index === selectedIndex;
        return (
          <TouchableOpacity
            key={hex}
            style={[styles.swatch, { backgroundColor: hex }]}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(index);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Color ${index + 1}`}
            accessibilityState={{ selected }}
          >
            {selected && (
              <Feather
                name="check"
                size={20}
                color={isLight(hex) ? "#111111" : "#FFFFFF"}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      gap: 16,
    },
    swatch: {
      height: 40,
      width: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: c.border,
    },
  });
