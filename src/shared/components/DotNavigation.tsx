import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { useEffect, useRef } from "react";
import {
    Animated,
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

type ColorValue = keyof ThemeColors | (string & {});

export type DotNavigationProps = {
  /** Total number of dots */
  count: number;
  /** Zero-based index of the active dot */
  activeIndex: number;
  /** Makes dots tappable when provided */
  onDotPress?: (index: number) => void;
  /** Theme key or raw color. Defaults to 'primary' */
  activeColor?: ColorValue;
  /** Theme key or raw color. Defaults to 'borderStrong' */
  inactiveColor?: ColorValue;
  /** Dot height and inactive width */
  size?: number;
  /** Width of the active dot (a wider pill). Set equal to size for plain dots */
  activeWidth?: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
};

type DotProps = {
  active: boolean;
  size: number;
  activeWidth: number;
  activeColor: string;
  inactiveColor: string;
  onPress?: () => void;
  accessibilityLabel: string;
};

function Dot({
  active,
  size,
  activeWidth,
  activeColor,
  inactiveColor,
  onPress,
  accessibilityLabel,
}: DotProps) {
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: active ? 1 : 0,
      duration: 250,
      useNativeDriver: false, // width and color can't use the native driver
    }).start();
  }, [active, progress]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [size, activeWidth],
  });

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  const dot = (
    <Animated.View
      style={[
        styles.dot,
        { width, height: size, borderRadius: size / 2, backgroundColor },
      ]}
    />
  );

  if (!onPress) return dot;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active }}
    >
      {dot}
    </Pressable>
  );
}

export function DotNavigation({
  count,
  activeIndex,
  onDotPress,
  activeColor = "primary",
  inactiveColor = "borderStrong",
  size = 8,
  activeWidth = 24,
  gap = 8,
  style,
}: DotNavigationProps) {
  const { colors } = useTheme();

  const resolve = (value: ColorValue) =>
    value in colors ? colors[value as keyof ThemeColors] : value;

  const active = resolve(activeColor);
  const inactive = resolve(inactiveColor);

  return (
    <View
      style={[styles.row, { gap }, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={`Page ${activeIndex + 1} of ${count}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Dot
          key={index}
          active={index === activeIndex}
          size={size}
          activeWidth={activeWidth}
          activeColor={active}
          inactiveColor={inactive}
          onPress={onDotPress ? () => onDotPress(index) : undefined}
          accessibilityLabel={`Go to page ${index + 1}`}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {},
});
