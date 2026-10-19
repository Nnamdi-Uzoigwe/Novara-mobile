// import { ProductCard } from "@/features/home/components/ProductCard";
// import type { Product } from "@/features/home/types";
// import { useFavoritesStore } from "@/store/favoritesStore";
// import { router } from "expo-router";
// import React, { useCallback } from "react";
// import { FlatList, StyleSheet } from "react-native";

// type ProductGridListProps = {
//   products: Product[];
//   /** Shown when the list is empty */
//   empty?: React.ReactElement;
//   bottomPadding?: number;
// };

// export function ProductGridList({
//   products,
//   empty,
//   bottomPadding = 24,
// }: ProductGridListProps) {
//   const ids = useFavoritesStore((s) => s.ids);
//   const toggle = useFavoritesStore((s) => s.toggle);

//   const handlePress = useCallback((product: Product) => {
//     router.push({
//       pathname: "/product-details/[id]",
//       params: { id: product.id },
//     });
//   }, []);

//   const renderItem = useCallback(
//     ({ item }: { item: Product }) => (
//       <ProductCard
//         product={item}
//         isFavorite={ids.includes(item.id)}
//         onToggleFavorite={toggle}
//         onPress={handlePress}
//       />
//     ),
//     [ids, toggle, handlePress],
//   );

//   return (
//     <FlatList
//       data={products}
//       keyExtractor={(item) => item.id}
//       numColumns={2}
//       renderItem={renderItem}
//       columnWrapperStyle={styles.columns}
//       contentContainerStyle={[
//         styles.content,
//         { paddingBottom: bottomPadding },
//         products.length === 0 && styles.grow,
//       ]}
//       ListEmptyComponent={empty}
//       showsVerticalScrollIndicator={false}
//       keyboardShouldPersistTaps="handled"
//       keyboardDismissMode="on-drag"
//     />
//   );
// }

// const styles = StyleSheet.create({
//   content: {
//     paddingHorizontal: 20,
//     paddingTop: 4,
//   },
//   columns: {
//     gap: 16,
//   },
//   grow: {
//     flexGrow: 1,
//   },
// });

import { useTheme } from "@/core/theme/ThemeProvider";
import { useFavoriteIds, useToggleFavorite } from "@/features/catalog/hooks";
import { ProductCard } from "@/features/home/components/ProductCard";
import {
  isSkeleton,
  PRODUCT_SKELETONS,
  ProductCardSkeleton,
  type SkeletonItem,
} from "@/features/home/components/Skeletons";
import type { Product } from "@/features/home/types";
import { ErrorState } from "@/shared/components/ErrorState";
import { router } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

type ProductGridListProps = {
  products: Product[];
  /** First load: shows grey placeholder cards */
  loading?: boolean;
  /** Shown instead of the list when loading failed and there is nothing to display */
  error?: unknown;
  onRetry?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  onEndReached?: () => void;
  /** Spinner at the bottom while the next page loads */
  loadingMore?: boolean;
  /** Shown when the list is empty */
  empty?: React.ReactElement;
  bottomPadding?: number;
};

type Item = Product | SkeletonItem;

export function ProductGridList({
  products,
  loading = false,
  error,
  onRetry,
  onRefresh,
  refreshing = false,
  onEndReached,
  loadingMore = false,
  empty,
  bottomPadding = 24,
}: ProductGridListProps) {
  const { colors } = useTheme();
  const favoriteIds = useFavoriteIds();
  const toggleFavorite = useToggleFavorite();

  const handlePress = useCallback((product: Product) => {
    router.push({
      pathname: "/product-details/[id]",
      params: { id: product.id },
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Item }) =>
      isSkeleton(item) ? (
        <ProductCardSkeleton />
      ) : (
        <ProductCard
          product={item}
          isFavorite={favoriteIds.has(item.id)}
          onToggleFavorite={toggleFavorite}
          onPress={handlePress}
        />
      ),
    [favoriteIds, toggleFavorite, handlePress],
  );

  const data: Item[] = loading ? PRODUCT_SKELETONS : products;
  const nothingToShow = !loading && products.length === 0;

  return (
    <FlatList<Item>
      data={data}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={renderItem}
      columnWrapperStyle={styles.columns}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: bottomPadding },
        nothingToShow && styles.grow,
      ]}
      ListEmptyComponent={
        error ? <ErrorState error={error} onRetry={onRetry} /> : empty
      }
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footer}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null
      }
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        ) : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  columns: {
    gap: 16,
  },
  grow: {
    flexGrow: 1,
  },
  footer: {
    paddingVertical: 16,
  },
});
