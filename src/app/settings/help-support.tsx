import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { FAQS } from "@/features/support/data/faqs";
import { AccordionItem } from "@/shared/components/Accordion";
import { AppInput } from "@/shared/components/AppInput";
import { AppText } from "@/shared/components/AppText";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HelpSupportScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(FAQS[0]?.id ?? null);

  const results = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return FAQS;
    return FAQS.filter(
      (faq) =>
        faq.question.toLowerCase().includes(text) ||
        faq.answer.toLowerCase().includes(text),
    );
  }, [query]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Help and Support" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <AppInput
          icon="search"
          placeholder="Search help"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          containerStyle={styles.search}
        />

        {results.length === 0 ? (
          <AppText
            size={14}
            weight="medium"
            color="textSecondary"
            align="center"
            style={styles.empty}
          >
            No matching questions. Try different words.
          </AppText>
        ) : (
          results.map((faq, index) => (
            <View
              key={faq.id}
              style={index < results.length - 1 && styles.divider}
            >
              <AccordionItem
                title={faq.question}
                open={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              >
                <AppText
                  size={13}
                  weight="medium"
                  color="textSecondary"
                  lineHeight={21}
                >
                  {faq.answer}
                </AppText>
              </AccordionItem>
            </View>
          ))
        )}
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
    },
    search: {
      marginBottom: 8,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    empty: {
      marginTop: 32,
    },
  });
