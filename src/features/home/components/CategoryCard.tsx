import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import type { Category } from "@/features/home/types";
import { AppText } from "@/shared/components/AppText";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type CategoryCardProps = {
  category: Category;
  /** Even cards put the text on the left, odd cards on the right */
  index: number;
  onPress?: (category: Category) => void;
};

function CategoryCardBase({ category, index, onPress }: CategoryCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const textOnLeft = index % 2 === 0;
  const countLabel = `${category.count} ${category.count === 1 ? "Product" : "Products"}`;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { flexDirection: textOnLeft ? "row" : "row-reverse" },
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
      onPress={() => onPress?.(category)}
      accessibilityRole="button"
      accessibilityLabel={`${category.name}, ${countLabel}`}
    >
      <View style={styles.textBlock}>
        <AppText size={16} weight="bold">
          {category.name}
        </AppText>
        <AppText size={13} weight="medium" color="textSecondary">
          {countLabel}
        </AppText>
      </View>

      <Image
        source={category.image}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
    </Pressable>
  );
}

export const CategoryCard = React.memo(CategoryCardBase);

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      height: 88,
      borderRadius: 12,
      backgroundColor: c.surfaceMuted,
      overflow: "hidden",
      marginBottom: 16,
    },
    textBlock: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 16,
      gap: 4,
    },
    image: {
      flex: 1,
      height: "100%",
    },
  });
