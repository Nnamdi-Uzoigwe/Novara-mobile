import { useTheme } from "@/core/theme/ThemeProvider";
import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import { StyleSheet, TouchableOpacity } from "react-native";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: number;
  accessibilityLabel?: string;
};

export function Checkbox({
  checked,
  onChange,
  size = 22,
  accessibilityLabel,
}: CheckboxProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        Haptics.selectionAsync();
        onChange(!checked);
      }}
      hitSlop={10}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.box,
        {
          height: size,
          width: size,
          borderColor: checked ? colors.primary : colors.borderStrong,
          backgroundColor: checked ? colors.primary : "transparent",
        },
      ]}
    >
      {checked && (
        <Feather name="check" size={size - 8} color={colors.onPrimary} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
