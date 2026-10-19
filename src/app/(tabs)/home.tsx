import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { NEW_ARRIVALS_CATEGORY_ID } from "@/features/catalog/constants";
import {
  useBanners,
  useCategories,
  useFavoriteIds,
  useProducts,
  useToggleFavorite,
} from "@/features/catalog/hooks";
import { CategoryCard } from "@/features/home/components/CategoryCard";
import { HomeHeader } from "@/features/home/components/HomeHeader";
import { ProductCard } from "@/features/home/components/ProductCard";
import { PromoBanner } from "@/features/home/components/PromoBanner";
import { SectionHeader } from "@/features/home/components/SectionHeader";
import {
  BannerSkeleton,
  CATEGORY_SKELETONS,
  CategoryCardSkeleton,
  isSkeleton,
  PRODUCT_SKELETONS,
  ProductCardSkeleton,
  type SkeletonItem,
} from "@/features/home/components/Skeletons";
import type { Category, Product } from "@/features/home/types";
import { ErrorState } from "@/shared/components/ErrorState";
import { FadeInView } from "@/shared/components/FadeInView";
import { TopTabs } from "@/shared/components/TopTabs";
import { useRefresh } from "@/shared/hooks/useRefresh";
import { useNotificationsStore } from "@/store/notificationsStore";
import { firstName, useUserStore } from "@/store/userStore";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS = ["Home", "Category"];

type ProductItem = Product | SkeletonItem;
type CategoryItem = Category | SkeletonItem;

export default function Home() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [tab, setTab] = useState(0);

  const user = useUserStore((s) => s.user);
  const hasUnread = useNotificationsStore((s) => s.items.some((n) => !n.read));

  const banners = useBanners();
  const categories = useCategories();
  const arrivals = useProducts({ sort: "latest", limit: 6 });

  const favoriteIds = useFavoriteIds();
  const toggleFavorite = useToggleFavorite();

  const refetchAll = useCallback(
    () =>
      Promise.all(
        tab === 0
          ? [banners.refetch(), arrivals.refetch()]
          : [categories.refetch()],
      ),
    [tab, banners.refetch, arrivals.refetch, categories.refetch],
  );
  const { refreshing, onRefresh } = useRefresh(refetchAll);

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
    ({ item }: { item: ProductItem }) =>
      isSkeleton(item) ? (
        <ProductCardSkeleton />
      ) : (
        <ProductCard
          product={item}
          isFavorite={favoriteIds.has(item.id)}
          onToggleFavorite={toggleFavorite}
          onPress={handleProductPress}
        />
      ),
    [favoriteIds, toggleFavorite, handleProductPress],
  );

  const renderCategory = useCallback(
    ({ item, index }: { item: CategoryItem; index: number }) =>
      isSkeleton(item) ? (
        <CategoryCardSkeleton />
      ) : (
        <CategoryCard
          category={item}
          index={index}
          onPress={handleCategoryPress}
        />
      ),
    [handleCategoryPress],
  );

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.primary}
    />
  );

  const products = arrivals.data?.items ?? [];
  const productData: ProductItem[] = arrivals.isLoading
    ? PRODUCT_SKELETONS
    : products;
  const categoryData: CategoryItem[] = categories.isLoading
    ? CATEGORY_SKELETONS
    : (categories.data ?? []);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <HomeHeader
        name={firstName(user?.name)}
        avatar={user?.avatarUri ? { uri: user.avatarUri } : undefined}
        hasUnread={hasUnread}
        onSearchPress={() => router.push("/search")}
        onBellPress={() => router.push("/notifications")}
      />

      <TopTabs tabs={TABS} activeIndex={tab} onChange={setTab} />

      {/* flex: 1 here gives the list a real height to scroll within */}
      <FadeInView key={tab} style={styles.flex} duration={350} distance={12}>
        {tab === 0 ? (
          <FlatList<ProductItem>
            data={productData}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={renderProduct}
            columnWrapperStyle={styles.columns}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
            ListHeaderComponent={
              <View>
                {banners.isLoading ? (
                  <BannerSkeleton />
                ) : banners.data && banners.data.length > 0 ? (
                  <PromoBanner banners={banners.data} horizontalPadding={20} />
                ) : null}

                <SectionHeader
                  title="New Arrivals"
                  emoji="🔥"
                  onSeeAll={handleSeeAll}
                />
              </View>
            }
            ListEmptyComponent={
              arrivals.isError ? (
                <ErrorState
                  error={arrivals.error}
                  onRetry={() => arrivals.refetch()}
                />
              ) : null
            }
          />
        ) : (
          <FlatList<CategoryItem>
            data={categoryData}
            keyExtractor={(item) => item.id}
            renderItem={renderCategory}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
            ListEmptyComponent={
              categories.isError ? (
                <ErrorState
                  error={categories.error}
                  onRetry={() => categories.refetch()}
                />
              ) : null
            }
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
