import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { NEW_ARRIVALS_CATEGORY_ID } from "@/features/catalog/constants";
import { useInfiniteProducts } from "@/features/catalog/hooks";
import type { ProductQuery } from "@/features/catalog/types";
import { ProductGridList } from "@/features/products/components/ProductGridList";
import { EmptyState } from "@/shared/components/EmptyState";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { useRefresh } from "@/shared/hooks/useRefresh";
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

  const query = useMemo<ProductQuery>(
    () => ({
      category,
      q,
      sort: category === NEW_ARRIVALS_CATEGORY_ID ? "latest" : "all",
      limit: 20,
    }),
    [category, q],
  );

  const result = useInfiniteProducts(query);
  const { refreshing, onRefresh } = useRefresh(result.refetch);

  const products = useMemo(
    () => result.data?.pages.flatMap((page) => page.items) ?? [],
    [result.data],
  );

  const heading = title ?? (q ? `Results for "${q}"` : "Products");

  return (
    <View style={styles.container}>
      <ScreenHeader title={heading} />

      <ProductGridList
        products={products}
        loading={result.isLoading}
        error={result.error}
        onRetry={() => result.refetch()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        loadingMore={result.isFetchingNextPage}
        onEndReached={() => {
          if (result.hasNextPage && !result.isFetchingNextPage) {
            result.fetchNextPage();
          }
        }}
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
