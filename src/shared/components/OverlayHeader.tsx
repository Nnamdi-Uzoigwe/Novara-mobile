import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppText } from "@/shared/components/AppText";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type OverlayHeaderProps = {
  title: string;
};

/** Back button and title floating over an image or map */
export function OverlayHeader({ title }: OverlayHeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={[styles.row, { top: insets.top + 8 }]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        style={styles.circle}
        onPress={() => router.back()}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Feather name="arrow-left" size={22} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.titleWrap}>
        <AppText weight="semibold" size={14}>
          {title}
        </AppText>
      </View>

      <View style={styles.spacer} />
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      position: "absolute",
      left: 20,
      right: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    circle: {
      height: 40,
      width: 40,
      borderRadius: 20,
      backgroundColor: c.surface + "CC",
      alignItems: "center",
      justifyContent: "center",
    },
    titleWrap: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: c.surface + "B3",
    },
    spacer: {
      width: 40,
    },
  });
