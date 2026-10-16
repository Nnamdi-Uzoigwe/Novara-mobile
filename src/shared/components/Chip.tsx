import { useTheme } from "@/core/theme/ThemeProvider";
import { AppText } from "@/shared/components/AppText";
import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** Shows an X button, used for removable chips such as recent searches */
  onRemove?: () => void;
};

export function Chip({
  label,
  selected = false,
  onPress,
  onRemove,
}: ChipProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        {
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? colors.primary + "1F" : colors.surface,
        },
      ]}
    >
      <AppText
        size={13}
        weight={selected ? "semibold" : "medium"}
        color={selected ? "primary" : "textSecondary"}
      >
        {label}
      </AppText>

      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
        >
          <Feather name="x" size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
});
