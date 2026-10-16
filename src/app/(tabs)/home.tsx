import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { CategoryCard } from "@/features/home/components/CategoryCard";
import { HomeHeader } from "@/features/home/components/HomeHeader";
import { ProductCard } from "@/features/home/components/ProductCard";
import { PromoBanner } from "@/features/home/components/PromoBanner";
import { SectionHeader } from "@/features/home/components/SectionHeader";
import {
  BANNERS,
  CATEGORIES,
  NEW_ARRIVALS_CATEGORY_ID,
} from "@/features/home/data/mock";
import type { Category, Product } from "@/features/home/types";
import { getProducts } from "@/features/products/queries";
import { FadeInView } from "@/shared/components/FadeInView";
import { TopTabs } from "@/shared/components/TopTabs";
import { useFavoritesStore } from "@/store/favoritesStore";
import { firstName, useUserStore } from "@/store/userStore";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS = ["Home", "Category"];

export default function Home() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [tab, setTab] = useState(0);
  const user = useUserStore((s) => s.user);

  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  const newArrivals = useMemo(
    () => getProducts({ sort: "latest" }).slice(0, 6),
    [],
  );

  const handleProductPress = useCallback((product: Product) => {
    router.push({
      pathname: "/product-details/[id]",
      params: { id: product.id },
    });
  }, []);

  const handleCategoryPress = useCallback((category: Category) => {
    router.push({
      pathname: "/products",
      params: { title: category.name, category: category.id },
    });
  }, []);

  const handleSeeAll = useCallback(() => {
    router.push({
      pathname: "/products",
      params: { title: "New Arrivals", category: NEW_ARRIVALS_CATEGORY_ID },
    });
  }, []);

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        isFavorite={favoriteIds.includes(item.id)}
        onToggleFavorite={toggleFavorite}
        onPress={handleProductPress}
      />
    ),
    [favoriteIds, toggleFavorite, handleProductPress],
  );

  const renderCategory = useCallback(
    ({ item, index }: { item: Category; index: number }) => (
      <CategoryCard
        category={item}
        index={index}
        onPress={handleCategoryPress}
      />
    ),
    [handleCategoryPress],
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <HomeHeader
        name={firstName(user?.name)}
        avatar={user?.avatarUri ? { uri: user.avatarUri } : undefined}
        hasUnread
        onSearchPress={() => router.push("/search")}
        onBellPress={() => {
          // TODO (notifications step): router.push("/notifications")
        }}
      />

      <TopTabs tabs={TABS} activeIndex={tab} onChange={setTab} />

      {/* flex: 1 here gives the list a real height to scroll within */}
      <FadeInView key={tab} style={styles.flex} duration={350} distance={12}>
        {tab === 0 ? (
          <FlatList
            data={newArrivals}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={renderProduct}
            columnWrapperStyle={styles.columns}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View>
                <PromoBanner banners={BANNERS} horizontalPadding={20} />
                <SectionHeader
                  title="New Arrivals"
                  emoji="🔥"
                  onSeeAll={handleSeeAll}
                />
              </View>
            }
          />
        ) : (
          <FlatList
            data={CATEGORIES}
            keyExtractor={(item) => item.id}
            renderItem={renderCategory}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </FadeInView>
    </SafeAreaView>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.background,
    },
    flex: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    columns: {
      gap: 16,
    },
  });
