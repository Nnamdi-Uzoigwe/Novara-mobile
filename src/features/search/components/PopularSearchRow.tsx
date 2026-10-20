import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import type { PopularBadge } from "@/features/catalog/types";
import { AppText } from "@/shared/components/AppText";
import { Skeleton } from "@/shared/components/Skeleton";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Image, type ImageSource } from "expo-image";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

const BADGE_TONE = {
  Hot: "danger",
  New: "warning",
  Popular: "success",
} as const;

type PopularSearchRowProps = {
  term: string;
  searchesToday: string;
  badge: PopularBadge;
  image?: ImageSource;
  onPress: () => void;
};

function PopularSearchRowBase({
  term,
  searchesToday,
  badge,
  image,
  onPress,
}: PopularSearchRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Search ${term}`}
    >
      {image ? (
        <Image
          source={image}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={styles.image} />
      )}

      <View style={styles.text}>
        <AppText size={16} weight="bold" numberOfLines={1}>
          {term}
        </AppText>
        <AppText size={13} weight="medium" color="textSecondary">
          {`${searchesToday} searches today`}
        </AppText>
      </View>

      <StatusBadge label={badge} tone={BADGE_TONE[badge]} variant="soft" />
    </Pressable>
  );
}

export const PopularSearchRow = React.memo(PopularSearchRowBase);

/** Grey placeholder shown while popular searches load */
export function PopularSearchRowSkeleton() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      <Skeleton width={62} height={62} radius={10} />
      <View style={styles.text}>
        <Skeleton width="55%" height={16} />
        <Skeleton width="35%" height={12} />
      </View>
      <Skeleton width={64} height={28} radius={14} />
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    image: {
      height: 62,
      width: 62,
      borderRadius: 10,
      backgroundColor: c.surfaceMuted,
    },
    text: {
      flex: 1,
      gap: 4,
    },
  });
