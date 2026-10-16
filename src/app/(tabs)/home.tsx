// import HomeScreen from "@/features/home/components/HomeScreen";
// import { StyleSheet } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function Home() {
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <HomeScreen />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     paddingHorizontal: 20,
//     backgroundColor: "#fff",
//     flex: 1,
//   },
// });

import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { CategoryCard } from "@/features/home/components/CategoryCard";
import { HomeHeader } from "@/features/home/components/HomeHeader";
import { ProductCard } from "@/features/home/components/ProductCard";
import { PromoBanner } from "@/features/home/components/PromoBanner";
import { SectionHeader } from "@/features/home/components/SectionHeader";
import { BANNERS, CATEGORIES, PRODUCTS } from "@/features/home/data/mock";
import type { Category, Product } from "@/features/home/types";
import { FadeInView } from "@/shared/components/FadeInView";
import { TopTabs } from "@/shared/components/TopTabs";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS = ["Home", "Category"];

export default function Home() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [tab, setTab] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const handleProductPress = useCallback((product: Product) => {
    router.push({
      pathname: "/product-details/[id]",
      params: { id: product.id },
    });
  }, []);

  const handleCategoryPress = useCallback((category: Category) => {
    // TODO: navigate to the products-by-category screen
  }, []);

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        isFavorite={favorites.includes(item.id)}
        onToggleFavorite={toggleFavorite}
        onPress={handleProductPress}
      />
    ),
    [favorites, toggleFavorite, handleProductPress],
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
        name="Jonathan"
        hasUnread
        onSearchPress={() => {}}
        onBellPress={() => {}}
      />

      <TopTabs tabs={TABS} activeIndex={tab} onChange={setTab} />

      {/* flex: 1 here gives the list a real height to scroll within */}
      <FadeInView key={tab} style={styles.flex} duration={350} distance={12}>
        {tab === 0 ? (
          <FlatList
            data={PRODUCTS}
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
                  onSeeAll={() => {}}
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
