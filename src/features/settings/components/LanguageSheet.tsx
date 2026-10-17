import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppText } from "@/shared/components/AppText";
import { BottomSheet } from "@/shared/components/BottomSheet";
import Feather from "@expo/vector-icons/Feather";
import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type LanguageSheetProps = {
  visible: boolean;
  onClose: () => void;
};

// TODO: when you add more languages, store the choice in settingsStore and wire an i18n library
export function LanguageSheet({ visible, onClose }: LanguageSheetProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <AppText size={18} weight="bold">
          Language
        </AppText>

        <Pressable
          style={styles.row}
          onPress={onClose}
          accessibilityRole="radio"
          accessibilityState={{ selected: true }}
          accessibilityLabel="English"
        >
          <AppText size={15} weight="semibold" style={styles.label}>
            English
          </AppText>
          <Feather name="check-circle" size={22} color={colors.primary} />
        </Pressable>

        <AppText size={12} weight="medium" color="textSecondary">
          More languages are coming soon.
        </AppText>
      </View>
    </BottomSheet>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    content: {
      gap: 16,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      minHeight: 56,
      paddingHorizontal: 16,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: c.primary,
      backgroundColor: c.surfaceMuted,
    },
    label: {
      flex: 1,
    },
  });
