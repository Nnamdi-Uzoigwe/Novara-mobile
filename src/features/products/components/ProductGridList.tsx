import { ProductCard } from "@/features/home/components/ProductCard";
import type { Product } from "@/features/home/types";
import { useFavoritesStore } from "@/store/favoritesStore";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";

type ProductGridListProps = {
  products: Product[];
  /** Shown when the list is empty */
  empty?: React.ReactElement;
  bottomPadding?: number;
};

export function ProductGridList({
  products,
  empty,
  bottomPadding = 24,
}: ProductGridListProps) {
  const ids = useFavoritesStore((s) => s.ids);
  const toggle = useFavoritesStore((s) => s.toggle);

  const handlePress = useCallback((product: Product) => {
    router.push({
      pathname: "/product-details/[id]",
      params: { id: product.id },
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        isFavorite={ids.includes(item.id)}
        onToggleFavorite={toggle}
        onPress={handlePress}
      />
    ),
    [ids, toggle, handlePress],
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={renderItem}
      columnWrapperStyle={styles.columns}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: bottomPadding },
        products.length === 0 && styles.grow,
      ]}
      ListEmptyComponent={empty}
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
});
