// import { useTheme } from "@/core/theme/ThemeProvider";
// import type { ThemeColors } from "@/core/theme/colors";
// import { AppText } from "@/shared/components/AppText";
// import { Ionicons } from "@expo/vector-icons";
// import { BlurView } from "expo-blur";
// import * as Haptics from "expo-haptics";
// import { Tabs } from "expo-router";
// import React, { useEffect, useMemo, useState } from "react";
// import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
// import Animated, {
//     useAnimatedStyle,
//     useSharedValue,
//     withSpring,
// } from "react-native-reanimated";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// // Props type taken from Expo Router's own Tabs, so no extra import is needed
// type TabBarProps = Parameters<
//   NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>
// >[0];

// type IconName = React.ComponentProps<typeof Ionicons>["name"];

// const ICONS: Record<string, { active: IconName; inactive: IconName }> = {
//   home: { active: "home", inactive: "home-outline" },
//   orders: { active: "receipt", inactive: "receipt-outline" },
//   cart: { active: "cart", inactive: "cart-outline" },
//   favorites: { active: "heart", inactive: "heart-outline" },
//   profile: { active: "person", inactive: "person-outline" },
// };

// const FALLBACK_ICON: { active: IconName; inactive: IconName } = {
//   active: "ellipse",
//   inactive: "ellipse-outline",
// };

// const PILL_MARGIN = 2; // gap between the pill and the edges of its tab slot

// export function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
//   const { colors, isDark } = useTheme();
//   const insets = useSafeAreaInsets();
//   const styles = useMemo(() => createStyles(colors), [colors]);

//   const [trackWidth, setTrackWidth] = useState(0);
//   const translateX = useSharedValue(0);

//   const tabWidth = trackWidth / state.routes.length;

//   useEffect(() => {
//     if (!tabWidth) return;
//     translateX.value = withSpring(state.index * tabWidth, {
//       damping: 14,
//       stiffness: 160,
//       mass: 0.9,
//     });
//   }, [state.index, tabWidth, translateX]);

//   const pillStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: translateX.value }],
//   }));

//   const handleLayout = (e: LayoutChangeEvent) =>
//     setTrackWidth(e.nativeEvent.layout.width);

//   return (
//     <View style={[styles.container, { paddingBottom: insets.bottom }]}>
//       <BlurView
//         intensity={60}
//         tint={isDark ? "dark" : "light"}
//         style={StyleSheet.absoluteFill}
//       />

//       <View style={styles.track} onLayout={handleLayout}>
//         {tabWidth > 0 && (
//           <Animated.View
//             pointerEvents="none"
//             style={[
//               styles.pill,
//               { width: tabWidth - PILL_MARGIN * 2, left: PILL_MARGIN },
//               pillStyle,
//             ]}
//           />
//         )}

//         {state.routes.map((route, index) => {
//           const { options } = descriptors[route.key];
//           const focused = state.index === index;
//           const label = options.title ?? route.name;
//           const icons = ICONS[route.name] ?? FALLBACK_ICON;

//           const onPress = () => {
//             const event = navigation.emit({
//               type: "tabPress",
//               target: route.key,
//               canPreventDefault: true,
//             });

//             if (!focused && !event.defaultPrevented) {
//               Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//               navigation.navigate(route.name, route.params);
//             }
//           };

//           const onLongPress = () =>
//             navigation.emit({ type: "tabLongPress", target: route.key });

//           return (
//             <TabItem
//               key={route.key}
//               label={label}
//               icon={focused ? icons.active : icons.inactive}
//               focused={focused}
//               activeColor={colors.primary}
//               inactiveColor={colors.textSecondary}
//               onPress={onPress}
//               onLongPress={onLongPress}
//               accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
//               testID={options.tabBarButtonTestID}
//             />
//           );
//         })}
//       </View>
//     </View>
//   );
// }

// type TabItemProps = {
//   label: string;
//   icon: IconName;
//   focused: boolean;
//   activeColor: string;
//   inactiveColor: string;
//   onPress: () => void;
//   onLongPress: () => void;
//   accessibilityLabel?: string;
//   testID?: string;
// };

// function TabItem({
//   label,
//   icon,
//   focused,
//   activeColor,
//   inactiveColor,
//   onPress,
//   onLongPress,
//   accessibilityLabel,
//   testID,
// }: TabItemProps) {
//   const scale = useSharedValue(focused ? 1.12 : 1);

//   useEffect(() => {
//     scale.value = withSpring(focused ? 1.12 : 1, {
//       damping: 10,
//       stiffness: 180,
//     });
//   }, [focused, scale]);

//   const iconStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//   }));

//   const color = focused ? activeColor : inactiveColor;

//   return (
//     <Pressable
//       style={tabItemStyles.item}
//       onPress={onPress}
//       onLongPress={onLongPress}
//       accessibilityRole="button"
//       accessibilityState={{ selected: focused }}
//       accessibilityLabel={accessibilityLabel}
//       testID={testID}
//     >
//       <Animated.View style={iconStyle}>
//         <Ionicons name={icon} size={22} color={color} />
//       </Animated.View>
//       <AppText color={color} weight={focused ? "semibold" : "medium"} size={11}>
//         {label}
//       </AppText>
//     </Pressable>
//   );
// }

// const tabItemStyles = StyleSheet.create({
//   item: {
//     flex: 1,
//     height: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 3,
//   },
// });

// const createStyles = (c: ThemeColors) =>
//   StyleSheet.create({
//     container: {
//       backgroundColor: c.surface + "CC", // surface at about 80% opacity over the blur
//       borderTopLeftRadius: 24,
//       borderTopRightRadius: 24,
//       borderTopWidth: 1,
//       borderLeftWidth: 1,
//       borderRightWidth: 1,
//       borderColor: c.border,
//       overflow: "hidden",
//     },
//     track: {
//       flexDirection: "row",
//       height: 64,
//       marginHorizontal: 8,
//       alignItems: "center",
//     },
//     pill: {
//       position: "absolute",
//       top: 6,
//       height: 52,
//       borderRadius: 26,
//       backgroundColor: c.primary + "1F",
//       borderWidth: 1,
//       borderColor: c.primary + "55",
//     },
//   });

import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { useFavoriteIds } from "@/features/catalog/hooks";
import { AppText } from "@/shared/components/AppText";
import { useCartCount } from "@/store/cartStore";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Props type taken from Expo Router's own Tabs, so no extra import is needed
type TabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>
>[0];

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  home: { active: "home", inactive: "home-outline" },
  orders: { active: "receipt", inactive: "receipt-outline" },
  cart: { active: "cart", inactive: "cart-outline" },
  favorites: { active: "heart", inactive: "heart-outline" },
  profile: { active: "person", inactive: "person-outline" },
};

const FALLBACK_ICON: { active: IconName; inactive: IconName } = {
  active: "ellipse",
  inactive: "ellipse-outline",
};

const PILL_MARGIN = 2; // gap between the pill and the edges of its tab slot

export function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Number shown on a tab. To count cart lines instead of items, use items.length
  const cartCount = useCartCount();
  const favoriteCount = useFavoriteIds().size;
  const badges: Record<string, number> = {
    cart: cartCount,
    favorites: favoriteCount,
  };

  const [trackWidth, setTrackWidth] = useState(0);
  const translateX = useSharedValue(0);

  const tabWidth = trackWidth / state.routes.length;

  useEffect(() => {
    if (!tabWidth) return;
    translateX.value = withSpring(state.index * tabWidth, {
      damping: 14,
      stiffness: 160,
      mass: 0.9,
    });
  }, [state.index, tabWidth, translateX]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleLayout = (e: LayoutChangeEvent) =>
    setTrackWidth(e.nativeEvent.layout.width);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <BlurView
        intensity={60}
        tint={isDark ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.track} onLayout={handleLayout}>
        {tabWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pill,
              { width: tabWidth - PILL_MARGIN * 2, left: PILL_MARGIN },
              pillStyle,
            ]}
          />
        )}

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const label = options.title ?? route.name;
          const icons = ICONS[route.name] ?? FALLBACK_ICON;
          const badge = badges[route.name] ?? 0;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () =>
            navigation.emit({ type: "tabLongPress", target: route.key });

          return (
            <TabItem
              key={route.key}
              label={label}
              icon={focused ? icons.active : icons.inactive}
              focused={focused}
              badge={badge}
              activeColor={colors.primary}
              inactiveColor={colors.textSecondary}
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityLabel={
                badge > 0
                  ? `${options.tabBarAccessibilityLabel ?? label}, ${badge}`
                  : (options.tabBarAccessibilityLabel ?? label)
              }
              testID={options.tabBarButtonTestID}
            />
          );
        })}
      </View>
    </View>
  );
}

type TabItemProps = {
  label: string;
  icon: IconName;
  focused: boolean;
  badge: number;
  activeColor: string;
  inactiveColor: string;
  onPress: () => void;
  onLongPress: () => void;
  accessibilityLabel?: string;
  testID?: string;
};

function TabItem({
  label,
  icon,
  focused,
  badge,
  activeColor,
  inactiveColor,
  onPress,
  onLongPress,
  accessibilityLabel,
  testID,
}: TabItemProps) {
  const scale = useSharedValue(focused ? 1.12 : 1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.12 : 1, {
      damping: 10,
      stiffness: 180,
    });
  }, [focused, scale]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const color = focused ? activeColor : inactiveColor;

  return (
    <Pressable
      style={tabItemStyles.item}
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <View>
        <Animated.View style={iconStyle}>
          <Ionicons name={icon} size={22} color={color} />
        </Animated.View>
        <TabBadge count={badge} />
      </View>

      <AppText color={color} weight={focused ? "semibold" : "medium"} size={11}>
        {label}
      </AppText>
    </Pressable>
  );
}

/** Small red number on a tab icon. Pops when the count changes */
function TabBadge({ count }: { count: number }) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (count > 0) {
      scale.value = withSequence(
        withTiming(1.35, { duration: 120 }),
        withSpring(1, { damping: 8, stiffness: 200 }),
      );
    }
  }, [count, scale]);

  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (count <= 0) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        badgeStyles.badge,
        { backgroundColor: colors.danger, borderColor: colors.surface },
        animated,
      ]}
    >
      <AppText size={10} weight="bold" color="onPrimary" lineHeight={12}>
        {count > 9 ? "9+" : String(count)}
      </AppText>
    </Animated.View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -7,
    right: -11,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 1.5,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});

const tabItemStyles = StyleSheet.create({
  item: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
});

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: c.surface + "CC", // surface at about 80% opacity over the blur
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: c.border,
      overflow: "hidden",
    },
    track: {
      flexDirection: "row",
      height: 68,
      marginHorizontal: 8,
      alignItems: "center",
    },
    pill: {
      position: "absolute",
      top: 4,
      height: 60,
      borderRadius: 30,
      backgroundColor: c.primary + "1F",
      borderWidth: 1,
      borderColor: c.primary + "55",
    },
  });
