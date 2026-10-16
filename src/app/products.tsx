import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { NEW_ARRIVALS_CATEGORY_ID } from "@/features/home/data/mock";
import { ProductGridList } from "@/features/products/components/ProductGridList";
import { getProducts } from "@/features/products/queries";
import { EmptyState } from "@/shared/components/EmptyState";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function ProductsScreen() {
  const { title, category, q } = useLocalSearchParams<{
    title?: string;
    category?: string;
    q?: string;
  }>();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const products = useMemo(
    () =>
      getProducts({
        categoryId: category,
        search: q,
        sort: category === NEW_ARRIVALS_CATEGORY_ID ? "latest" : "all",
      }),
    [category, q],
  );

  const heading = title ?? (q ? `Results for "${q}"` : "Products");

  return (
    <View style={styles.container}>
      <ScreenHeader title={heading} />

      <ProductGridList
        products={products}
        empty={
          <EmptyState
            icon="shopping-bag"
            title="No products found"
            subtitle="Check back soon, new items are added often."
            actionLabel="Go Back"
            onAction={() => router.back()}
          />
        }
      />
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
  });
