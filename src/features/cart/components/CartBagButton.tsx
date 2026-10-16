import { useTheme } from "@/core/theme/ThemeProvider";
import { AppText } from "@/shared/components/AppText";
import { useCartCount } from "@/store/cartStore";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type CartBagButtonProps = {
  size?: number;
  /** Defaults to opening the Cart tab */
  onPress?: () => void;
};

export function CartBagButton({ size = 24, onPress }: CartBagButtonProps) {
  const { colors } = useTheme();
  const count = useCartCount();

  return (
    <TouchableOpacity
      onPress={onPress ?? (() => router.navigate("/(tabs)/cart"))}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={count > 0 ? `Open cart, ${count} items` : "Open cart"}
    >
      <Feather name="shopping-bag" size={size} color={colors.textPrimary} />

      {count > 0 && (
        <View
          style={[
            styles.badge,
            { backgroundColor: colors.primary, borderColor: colors.background },
          ]}
        >
          <AppText size={10} weight="bold" color="onPrimary" lineHeight={12}>
            {count > 9 ? "9+" : String(count)}
          </AppText>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 1.5,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
