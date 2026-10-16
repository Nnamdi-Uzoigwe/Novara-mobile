import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { getProductById } from "@/features/home/data/mock";
import type { Product } from "@/features/home/types";
import { getProducts } from "@/features/products/queries";
import { PopularSearchRow } from "@/features/search/components/PopularSearchRow";
import { POPULAR_SEARCHES } from "@/features/search/data/popular";
import { AppInput } from "@/shared/components/AppInput";
import { AppText } from "@/shared/components/AppText";
import { Chip } from "@/shared/components/Chip";
import { formatPrice } from "@/shared/utils/formatPrice";
import { useSearchStore } from "@/store/searchStore";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
    Keyboard,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SearchScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const recent = useSearchStore((s) => s.recent);
  const addRecent = useSearchStore((s) => s.add);
  const removeRecent = useSearchStore((s) => s.remove);
  const clearRecent = useSearchStore((s) => s.clear);

  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  const popular = useMemo(
    () =>
      POPULAR_SEARCHES.map((item) => ({
        ...item,
        image: getProductById(item.productId)?.image,
      })),
    [],
  );

  const suggestions = useMemo(
    () => (trimmed ? getProducts({ search: trimmed }).slice(0, 5) : []),
    [trimmed],
  );

  const runSearch = useCallback(
    (term: string) => {
      const value = term.trim();
      if (!value) return;

      addRecent(value);
      Keyboard.dismiss();
      router.push({ pathname: "/products", params: { q: value } });
    },
    [addRecent],
  );

  const openProduct = useCallback((product: Product) => {
    Keyboard.dismiss();
    router.push({
      pathname: "/product-details/[id]",
      params: { id: product.id },
    });
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <AppInput
          variant="outlined"
          icon="search"
          placeholder="Search products"
          value={query}
          onChangeText={setQuery}
          autoFocus
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={() => runSearch(query)}
          containerStyle={styles.input}
          right={
            query.length > 0 ? (
              <TouchableOpacity
                onPress={() => setQuery("")}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <Feather
                  name="x-circle"
                  size={18}
                  color={colors.textPlaceholder}
                />
              </TouchableOpacity>
            ) : undefined
          }
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {trimmed ? (
          <View style={styles.suggestions}>
            <Pressable
              style={({ pressed }) => [
                styles.searchRow,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => runSearch(trimmed)}
              accessibilityRole="button"
              accessibilityLabel={`Search for ${trimmed}`}
            >
              <View style={styles.searchIcon}>
                <Feather name="search" size={18} color={colors.primary} />
              </View>
              <AppText
                size={15}
                weight="semibold"
                numberOfLines={1}
                style={styles.flex}
              >
                {`Search for "${trimmed}"`}
              </AppText>
              <Feather
                name="arrow-up-left"
                size={18}
                color={colors.textSecondary}
              />
            </Pressable>

            {suggestions.map((product) => (
              <Pressable
                key={product.id}
                style={({ pressed }) => [
                  styles.suggestRow,
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => openProduct(product)}
                accessibilityRole="button"
                accessibilityLabel={product.name}
              >
                <Image
                  source={product.image}
                  style={styles.suggestImage}
                  contentFit="cover"
                  transition={200}
                />
                <View style={styles.flex}>
                  <AppText size={14} weight="bold" numberOfLines={1}>
                    {product.name}
                  </AppText>
                  <AppText size={12} weight="medium" color="textSecondary">
                    {product.seller}
                  </AppText>
                </View>
                <AppText size={14} weight="bold">
                  {formatPrice(product.price)}
                </AppText>
              </Pressable>
            ))}

            {suggestions.length === 0 && (
              <AppText
                size={13}
                weight="medium"
                color="textSecondary"
                align="center"
              >
                No quick matches. Press search to see all results.
              </AppText>
            )}
          </View>
        ) : (
          <>
            {recent.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <AppText size={18} weight="bold">
                    Last Search
                  </AppText>
                  <TouchableOpacity onPress={clearRecent} hitSlop={10}>
                    <AppText size={12} weight="bold" color="primary">
                      Clear All
                    </AppText>
                  </TouchableOpacity>
                </View>

                <View style={styles.chips}>
                  {recent.map((term) => (
                    <Chip
                      key={term}
                      label={term}
                      onPress={() => runSearch(term)}
                      onRemove={() => removeRecent(term)}
                    />
                  ))}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <AppText size={18} weight="bold">
                Popular Search
              </AppText>

              <View style={styles.popular}>
                {popular.map((item) => (
                  <PopularSearchRow
                    key={item.id}
                    term={item.term}
                    searchesToday={item.searchesToday}
                    badge={item.badge}
                    image={item.image}
                    onPress={() => runSearch(item.term)}
                  />
                ))}
              </View>
            </View>
          </>
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
    flex: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    input: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 12,
      gap: 28,
    },
    section: {
      gap: 16,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    chips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    popular: {
      gap: 18,
    },
    suggestions: {
      gap: 16,
    },
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    searchIcon: {
      height: 40,
      width: 40,
      borderRadius: 20,
      backgroundColor: c.primary + "1F",
      alignItems: "center",
      justifyContent: "center",
    },
    suggestRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    suggestImage: {
      height: 48,
      width: 48,
      borderRadius: 10,
      backgroundColor: c.surfaceMuted,
    },
  });
