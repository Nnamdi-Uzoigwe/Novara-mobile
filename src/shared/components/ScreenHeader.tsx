import { useTheme } from "@/core/theme/ThemeProvider";
import { AppText } from "@/shared/components/AppText";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenHeaderProps = {
  title: string;
  showBack?: boolean;
  /** Optional element on the right, such as an icon button */
  right?: React.ReactNode;
};

export function ScreenHeader({
  title,
  showBack = true,
  right,
}: ScreenHeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }}>
      <View style={styles.row}>
        <View style={styles.side}>
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Feather name="arrow-left" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
        </View>

        <AppText weight="semibold" size={16}>
          {title}
        </AppText>

        <View style={[styles.side, styles.sideRight]}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  side: {
    width: 40,
    justifyContent: "center",
  },
  sideRight: {
    alignItems: "flex-end",
  },
});
