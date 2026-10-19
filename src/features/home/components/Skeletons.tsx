import { Skeleton } from "@/shared/components/Skeleton";
import { StyleSheet, View } from "react-native";

export type SkeletonItem = { id: string; skeleton: true };

const makeSkeletons = (count: number): SkeletonItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `skeleton-${index}`,
    skeleton: true,
  }));

// Created once, so lists don't think their data changed on every render
export const PRODUCT_SKELETONS = makeSkeletons(6);
export const CATEGORY_SKELETONS = makeSkeletons(5);

export const isSkeleton = (item: unknown): item is SkeletonItem =>
  typeof item === "object" && item !== null && "skeleton" in item;

export function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.imageBox}>
        <Skeleton width="100%" height="100%" radius={16} />
      </View>
      <View style={styles.info}>
        <Skeleton width="70%" height={16} />
        <Skeleton width="45%" height={12} />
        <Skeleton width="35%" height={14} />
      </View>
    </View>
  );
}

export function CategoryCardSkeleton() {
  return (
    <Skeleton width="100%" height={88} radius={12} style={styles.category} />
  );
}

export function BannerSkeleton() {
  return <Skeleton width="100%" height={170} radius={18} />;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginBottom: 20,
  },
  imageBox: {
    width: "100%",
    aspectRatio: 0.95,
  },
  info: {
    marginTop: 12,
    gap: 8,
    alignItems: "center",
  },
  category: {
    marginBottom: 16,
  },
});
