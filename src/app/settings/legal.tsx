import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { LEGAL_SECTIONS } from "@/features/support/data/legal";
import { AppText } from "@/shared/components/AppText";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LegalScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Legal and Policies" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        {LEGAL_SECTIONS.map((section) => (
          <View key={section.id} style={styles.section}>
            <AppText size={16} weight="bold">
              {section.title}
            </AppText>

            {section.paragraphs.map((paragraph, index) => (
              <AppText
                key={index}
                size={13}
                weight="medium"
                color="textSecondary"
                lineHeight={21}
              >
                {paragraph}
              </AppText>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 8,
      gap: 24,
    },
    section: {
      gap: 12,
    },
  });
