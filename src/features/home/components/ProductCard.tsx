// import { useTheme } from "@/core/theme/ThemeProvider";
// import type { ThemeColors } from "@/core/theme/colors";
// import type { Product } from "@/features/home/types";
// import { AppText } from "@/shared/components/AppText";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import * as Haptics from "expo-haptics";
// import { Image } from "expo-image";
// import React, { useMemo } from "react";
// import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
// import Animated, {
//     useAnimatedStyle,
//     useSharedValue,
//     withSequence,
//     withSpring,
// } from "react-native-reanimated";

// type ProductCardProps = {
//   product: Product;
//   isFavorite: boolean;
//   onToggleFavorite: (id: string) => void;
//   onPress?: (product: Product) => void;
// };

// function ProductCardBase({
//   product,
//   isFavorite,
//   onToggleFavorite,
//   onPress,
// }: ProductCardProps) {
//   const { colors } = useTheme();
//   const styles = useMemo(() => createStyles(colors), [colors]);
//   const heartScale = useSharedValue(1);

//   const heartStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: heartScale.value }],
//   }));

//   const handleHeart = () => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//     heartScale.value = withSequence(
//       withSpring(1.35, { damping: 6, stiffness: 300 }),
//       withSpring(1, { damping: 10, stiffness: 200 }),
//     );
//     onToggleFavorite(product.id);
//   };

//   return (
//     <Pressable
//       style={({ pressed }) => [
//         styles.card,
//         pressed && { transform: [{ scale: 0.98 }] },
//       ]}
//       onPress={() => onPress?.(product)}
//       accessibilityRole="button"
//       accessibilityLabel={`${product.name} by ${product.seller}`}
//     >
//       <View>
//         <Image
//           source={product.image}
//           style={styles.image}
//           contentFit="cover"
//           transition={200}
//         />

//         <TouchableOpacity
//           style={styles.heartBtn}
//           onPress={handleHeart}
//           hitSlop={8}
//           accessibilityRole="button"
//           accessibilityLabel={
//             isFavorite ? "Remove from favorites" : "Add to favorites"
//           }
//           accessibilityState={{ selected: isFavorite }}
//         >
//           <Animated.View style={heartStyle}>
//             <Ionicons
//               name={isFavorite ? "heart" : "heart-outline"}
//               size={17}
//               color={isFavorite ? colors.danger : "#FFFFFF"}
//             />
//           </Animated.View>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.info}>
//         <AppText size={16} weight="bold" align="center" numberOfLines={1}>
//           {product.name}
//         </AppText>
//         <AppText
//           size={13}
//           weight="medium"
//           color="textSecondary"
//           align="center"
//           numberOfLines={1}
//         >
//           {product.seller}
//         </AppText>
//         <AppText size={15} weight="bold" align="center">
//           {`$${product.price.toFixed(2)}`}
//         </AppText>
//       </View>
//     </Pressable>
//   );
// }

// export const ProductCard = React.memo(ProductCardBase);

// const createStyles = (c: ThemeColors) =>
//   StyleSheet.create({
//     card: {
//       flex: 1,
//       marginBottom: 20,
//     },
//     image: {
//       width: "100%",
//       aspectRatio: 0.95,
//       borderRadius: 16,
//       backgroundColor: c.surfaceMuted,
//     },
//     heartBtn: {
//       position: "absolute",
//       top: 8,
//       right: 8,
//       height: 30,
//       width: 30,
//       borderRadius: 15,
//       backgroundColor: "rgba(0,0,0,0.35)",
//       alignItems: "center",
//       justifyContent: "center",
//     },
//     info: {
//       marginTop: 12,
//       gap: 3,
//     },
//   });

import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import type { Product } from "@/features/home/types";
import { AnimatedImage } from "@/shared/components/AnimatedImage";
import { AppText } from "@/shared/components/AppText";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

type ProductCardProps = {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onPress?: (product: Product) => void;
};

function ProductCardBase({
  product,
  isFavorite,
  onToggleFavorite,
  onPress,
}: ProductCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const heartScale = useSharedValue(1);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const handleHeart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    heartScale.value = withSequence(
      withSpring(1.35, { damping: 6, stiffness: 300 }),
      withSpring(1, { damping: 10, stiffness: 200 }),
    );
    onToggleFavorite(product);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
      onPress={() => onPress?.(product)}
      accessibilityRole="button"
      accessibilityLabel={`${product.name} by ${product.seller}`}
    >
      <View>
        <AnimatedImage
          sharedTransitionTag={`product-${product.id}-image`}
          source={product.image}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />

        <TouchableOpacity
          style={styles.heartBtn}
          onPress={handleHeart}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={
            isFavorite ? "Remove from favorites" : "Add to favorites"
          }
          accessibilityState={{ selected: isFavorite }}
        >
          <Animated.View style={heartStyle}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={17}
              color={isFavorite ? colors.danger : "#FFFFFF"}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <AppText size={16} weight="bold" align="center" numberOfLines={1}>
          {product.name}
        </AppText>
        <AppText
          size={13}
          weight="medium"
          color="textSecondary"
          align="center"
          numberOfLines={1}
        >
          {product.seller}
        </AppText>
        <AppText size={15} weight="bold" align="center">
          {`$${product.price.toFixed(2)}`}
        </AppText>
      </View>
    </Pressable>
  );
}

export const ProductCard = React.memo(ProductCardBase);

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      flex: 1,
      marginBottom: 20,
    },
    image: {
      width: "100%",
      aspectRatio: 0.95,
      borderRadius: 16,
      backgroundColor: c.surfaceMuted,
    },
    heartBtn: {
      position: "absolute",
      top: 8,
      right: 8,
      height: 30,
      width: 30,
      borderRadius: 15,
      backgroundColor: "rgba(0,0,0,0.35)",
      alignItems: "center",
      justifyContent: "center",
    },
    info: {
      marginTop: 12,
      gap: 3,
    },
  });
