import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { useFavorites } from "@/features/catalog/hooks";
import type { SortKey } from "@/features/catalog/types";
import { PriceFilterSheet } from "@/features/products/components/PriceFilterSheet";
import { ProductGridList } from "@/features/products/components/ProductGridList";
import { filterAndSort } from "@/features/products/filter";
import { AppInput } from "@/shared/components/AppInput";
import { Chip } from "@/shared/components/Chip";
import { EmptyState } from "@/shared/components/EmptyState";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { useRefresh } from "@/shared/hooks/useRefresh";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "latest", label: "Latest" },
  { key: "popular", label: "Most Popular" },
  { key: "cheapest", label: "Cheapest" },
  { key: "rated", label: "Highest Rated" },
];

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const favorites = useFavorites();
  const { refreshing, onRefresh } = useRefresh(favorites.refetch);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("all");
  const [range, setRange] = useState<{ min?: number; max?: number }>({});
  const [filterOpen, setFilterOpen] = useState(false);

  const saved = favorites.data ?? [];

  const products = useMemo(
    () =>
      filterAndSort(saved, {
        search,
        sort,
        minPrice: range.min,
        maxPrice: range.max,
      }),
    [saved, search, sort, range],
  );

  const priceFilterActive = range.min !== undefined || range.max !== undefined;
  const hasFilters =
    search.trim().length > 0 || sort !== "all" || priceFilterActive;

  const clearFilters = () => {
    setSearch("");
    setSort("all");
    setRange({});
  };

  const empty =
    saved.length === 0 ? (
      <EmptyState
        icon="heart"
        title="No favorites yet"
        subtitle="Tap the heart on any product to save it here."
        actionLabel="Browse Products"
        onAction={() => router.navigate("/(tabs)/home")}
      />
    ) : (
      <EmptyState
        icon="search"
        title="No matches"
        subtitle="Try a different search or filter."
        actionLabel={hasFilters ? "Clear filters" : undefined}
        onAction={hasFilters ? clearFilters : undefined}
      />
    );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="My Favorite"
        showBack={false}
        right={
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Feather name="bell" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      {saved.length > 0 && (
        <View style={styles.controls}>
          <AppInput
            variant="outlined"
            icon="search"
            placeholder="Search something..."
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            right={
              <TouchableOpacity
                onPress={() => setFilterOpen(true)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Filter by price"
              >
                <Feather
                  name="sliders"
                  size={20}
                  color={
                    priceFilterActive ? colors.primary : colors.textSecondary
                  }
                />
              </TouchableOpacity>
            }
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {SORTS.map((item) => (
              <Chip
                key={item.key}
                label={item.label}
                selected={sort === item.key}
                onPress={() => setSort(item.key)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      <ProductGridList
        products={products}
        loading={favorites.isLoading}
        error={
          favorites.isError && saved.length === 0 ? favorites.error : undefined
        }
        onRetry={() => favorites.refetch()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        empty={empty}
      />

      <PriceFilterSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        minPrice={range.min}
        maxPrice={range.max}
        onApply={(min, max) => setRange({ min, max })}
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
    controls: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 12,
      gap: 14,
    },
    chips: {
      gap: 10,
      paddingRight: 20,
    },
  });
