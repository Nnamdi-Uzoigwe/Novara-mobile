import { AppInput } from "@/shared/components/AppInput";
import { AppText } from "@/shared/components/AppText";
import { BottomSheet } from "@/shared/components/BottomSheet";
import { Button } from "@/shared/components/Button";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

type PriceFilterSheetProps = {
  visible: boolean;
  onClose: () => void;
  minPrice?: number;
  maxPrice?: number;
  onApply: (min?: number, max?: number) => void;
};

const parse = (value: string) => {
  const n = parseFloat(value.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export function PriceFilterSheet({
  visible,
  onClose,
  minPrice,
  maxPrice,
  onApply,
}: PriceFilterSheetProps) {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [error, setError] = useState("");

  // Start from the current filter every time the sheet opens
  useEffect(() => {
    if (!visible) return;
    setMin(minPrice !== undefined ? String(minPrice) : "");
    setMax(maxPrice !== undefined ? String(maxPrice) : "");
    setError("");
  }, [visible, minPrice, maxPrice]);

  const handleApply = () => {
    const lo = parse(min);
    const hi = parse(max);

    if (lo !== undefined && hi !== undefined && lo > hi) {
      setError("Minimum price cannot be higher than the maximum.");
      return;
    }

    onApply(lo, hi);
    onClose();
  };

  const handleReset = () => {
    onApply(undefined, undefined);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <AppText size={18} weight="bold">
          Filter by price
        </AppText>

        <View style={styles.row}>
          <AppInput
            icon="dollar-sign"
            placeholder="Min"
            value={min}
            onChangeText={(v) => {
              setMin(v);
              setError("");
            }}
            keyboardType="decimal-pad"
            containerStyle={styles.flex}
          />
          <AppInput
            icon="dollar-sign"
            placeholder="Max"
            value={max}
            onChangeText={(v) => {
              setMax(v);
              setError("");
            }}
            keyboardType="decimal-pad"
            containerStyle={styles.flex}
          />
        </View>

        {!!error && (
          <AppText size={12} weight="semibold" color="danger">
            {error}
          </AppText>
        )}

        <View style={styles.row}>
          <Button
            label="Reset"
            variant="outline"
            fullWidth={false}
            style={styles.flex}
            onPress={handleReset}
          />
          <Button
            label="Apply"
            fullWidth={false}
            style={styles.flex}
            onPress={handleApply}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex: {
    flex: 1,
  },
});
