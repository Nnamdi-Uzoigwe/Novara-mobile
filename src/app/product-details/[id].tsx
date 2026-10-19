import { ApiClientError } from "@/core/api/ApiClientError";
import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import {
  useFavoriteIds,
  useProduct,
  useToggleFavorite,
} from "@/features/catalog/hooks";
import { ColorSwatches } from "@/features/product-details/components/ColorSwatches";
import { DetailsHeader } from "@/features/product-details/components/DetailsHeader";
import { ExpandableText } from "@/features/product-details/components/ExpandableText";
import { SellerRow } from "@/features/product-details/components/SellerRow";
import { AnimatedImage } from "@/shared/components/AnimatedImage";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { ErrorState } from "@/shared/components/ErrorState";
import { QuantityStepper } from "@/shared/components/QuantityStepper";
import { Skeleton } from "@/shared/components/Skeleton";
import { colorName } from "@/shared/utils/colorName";
import { formatPrice } from "@/shared/utils/formatPrice";
import { useCartStore } from "@/store/cartStore";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STAR_COLOR = "#F5A524";
const SHEET_RADIUS = 28;

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { data: product, isLoading, error, refetch } = useProduct(id);

  const favoriteIds = useFavoriteIds();
  const toggleFavorite = useToggleFavorite();
  const favorite = favoriteIds.has(id);

  const addItem = useCartStore((s) => s.addItem);

  const [quantity, setQuantity] = useState(1);
  const [colorIndex, setColorIndex] = useState(0);
  const [following, setFollowing] = useState(false);
  const [added, setAdded] = useState(false);

  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    [],
  );

  const heroHeight = Math.round(height * 0.5);

  // Nothing downloaded yet: show the shape of the page while it loads
  if (!product && isLoading) {
    return (
      <View style={styles.container}>
        <Skeleton width="100%" height={heroHeight} radius={0} />
        <View style={[styles.sheet, styles.skeletonSheet]}>
          <Skeleton width="70%" height={26} />
          <Skeleton width="30%" height={16} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="92%" height={14} />
          <Skeleton width="60%" height={14} />
        </View>
        <DetailsHeader title="Product Details" onBack={() => router.back()} />
      </View>
    );
  }

  if (!product) {
    const notFound = error instanceof ApiClientError && error.status === 404;

    return (
      <View style={[styles.container, styles.center]}>
        <ErrorState
          error={error}
          message={
            notFound ? "This product is no longer available." : undefined
          }
          onRetry={notFound ? undefined : () => refetch()}
        />
        <DetailsHeader title="Product Details" onBack={() => router.back()} />
      </View>
    );
  }

  const footerSpace = insets.bottom + 100;
  const maxQuantity = product.stock ?? 99;
  const total = product.price * quantity;

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(product);
  };

  const handleAddToCart = () => {
    const hex = product.colors?.[colorIndex];
    addItem(product, quantity, hex ? { name: colorName(hex), hex } : undefined);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1600);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: footerSpace }}
      >
        <AnimatedImage
          sharedTransitionTag={`product-${product.id}-image`}
          source={product.image}
          style={[styles.hero, { height: heroHeight }]}
          contentFit="cover"
        />

        <View style={styles.sheet}>
          {/* Title and favorite */}
          <View style={styles.titleRow}>
            <AppText
              size={22}
              weight="bold"
              numberOfLines={2}
              style={styles.flex}
            >
              {product.name}
            </AppText>

            <TouchableOpacity
              style={styles.heartBtn}
              onPress={handleFavorite}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={
                favorite ? "Remove from favorites" : "Add to favorites"
              }
              accessibilityState={{ selected: favorite }}
            >
              <Ionicons
                name={favorite ? "heart" : "heart-outline"}
                size={22}
                color={favorite ? colors.danger : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Rating */}
          {product.rating !== undefined && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={15} color={STAR_COLOR} />
              <AppText size={14} weight="bold">
                {product.rating.toFixed(1)}
              </AppText>
              {product.reviewCount !== undefined && (
                <AppText size={12} weight="medium" color="textSecondary">
                  {`(${product.reviewCount} Review)`}
                </AppText>
              )}
            </View>
          )}

          {/* Description */}
          {!!product.description && (
            <ExpandableText text={product.description} />
          )}

          {/* Colors */}
          {!!product.colors?.length && (
            <View style={styles.section}>
              <AppText size={16} weight="bold">
                Color
              </AppText>
              <ColorSwatches
                colors={product.colors}
                selectedIndex={colorIndex}
                onSelect={setColorIndex}
              />
            </View>
          )}

          {/* Seller */}
          {product.sellerInfo && (
            <>
              <View style={styles.divider} />
              <SellerRow
                seller={product.sellerInfo}
                following={following}
                onToggleFollow={() => setFollowing((prev) => !prev)}
              />
            </>
          )}

          <View style={styles.divider} />

          {/* Quantity */}
          <View style={styles.amountRow}>
            <View style={styles.amountLabel}>
              <AppText size={15} weight="bold">
                Choose amount :
              </AppText>
              {product.stock !== undefined && (
                <AppText size={12} weight="medium" color="textSecondary">
                  {product.stock > 0
                    ? `${product.stock} available in stock`
                    : "Out of stock"}
                </AppText>
              )}
            </View>

            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={Math.max(maxQuantity, 1)}
            />
          </View>
        </View>
      </ScrollView>

      <DetailsHeader title="Product Details" onBack={() => router.back()} />

      {/* Fixed bottom bar */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View>
          <AppText size={13} weight="medium" color="textSecondary">
            Price
          </AppText>
          <AppText size={24} weight="bold">
            {formatPrice(total)}
          </AppText>
        </View>

        <Button
          label={added ? "Added to Cart" : "Add to Cart"}
          size="lg"
          fullWidth={false}
          style={styles.cartBtn}
          disabled={product.stock === 0}
          onPress={handleAddToCart}
          icon={(color) => (
            <Feather
              name={added ? "check" : "shopping-bag"}
              size={20}
              color={color}
            />
          )}
        />
      </View>
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
    center: {
      alignItems: "center",
      justifyContent: "center",
    },
    hero: {
      width: "100%",
      backgroundColor: c.surfaceMuted,
    },
    sheet: {
      marginTop: -SHEET_RADIUS,
      borderTopLeftRadius: SHEET_RADIUS,
      borderTopRightRadius: SHEET_RADIUS,
      backgroundColor: c.background,
      padding: 20,
      gap: 14,
    },
    skeletonSheet: {
      gap: 16,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    heartBtn: {
      height: 44,
      width: 44,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    section: {
      gap: 12,
    },
    divider: {
      height: 1,
      backgroundColor: c.border,
      marginVertical: 4,
    },
    amountRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    amountLabel: {
      gap: 3,
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      alignItems: "center",
      gap: 24,
      paddingHorizontal: 20,
      paddingTop: 12,
      backgroundColor: c.background,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    cartBtn: {
      flex: 1,
    },
  });
