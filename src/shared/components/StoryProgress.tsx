import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { useEffect, useRef } from "react";
import {
    Animated,
    Easing,
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

type ColorValue = keyof ThemeColors | (string & {});

export type StoryProgressProps = {
  /** Total number of bars */
  count: number;
  /** Zero-based index of the bar currently filling */
  activeIndex: number;
  /** How long the active bar takes to fill, in ms */
  duration?: number;
  /** Called when the active bar finishes filling */
  onSegmentComplete?: () => void;
  /** Makes bars tappable when provided */
  onSegmentPress?: (index: number) => void;
  /** Theme key or raw color. Defaults to 'primary' */
  fillColor?: ColorValue;
  /** Theme key or raw color. Defaults to 'borderStrong' */
  trackColor?: ColorValue;
  height?: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
};

type SegmentState = "done" | "active" | "upcoming";

type SegmentProps = {
  state: SegmentState;
  duration: number;
  height: number;
  fillColor: string;
  trackColor: string;
  onComplete?: () => void;
  onPress?: () => void;
  accessibilityLabel: string;
};

function Segment({
  state,
  duration,
  height,
  fillColor,
  trackColor,
  onComplete,
  onPress,
  accessibilityLabel,
}: SegmentProps) {
  const progress = useRef(new Animated.Value(0)).current;

  // Keep the latest callback without restarting the animation when it changes
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (state === "done") {
      progress.setValue(1);
      return;
    }

    if (state === "upcoming") {
      progress.setValue(0);
      return;
    }

    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: false, // width can't use the native driver
    });

    animation.start(({ finished }) => {
      if (finished) onCompleteRef.current?.();
    });

    return () => animation.stop();
  }, [state, duration, progress]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const bar = (
    <View
      style={[
        styles.track,
        { height, borderRadius: height / 2, backgroundColor: trackColor },
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          { width, borderRadius: height / 2, backgroundColor: fillColor },
        ]}
      />
    </View>
  );

  return (
    <View style={styles.segment}>
      {onPress ? (
        <Pressable
          onPress={onPress}
          hitSlop={{ top: 12, bottom: 12 }}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ selected: state === "active" }}
        >
          {bar}
        </Pressable>
      ) : (
        bar
      )}
    </View>
  );
}

export function StoryProgress({
  count,
  activeIndex,
  duration = 3000,
  onSegmentComplete,
  onSegmentPress,
  fillColor = "primary",
  trackColor = "borderStrong",
  height = 4,
  gap = 6,
  style,
}: StoryProgressProps) {
  const { colors } = useTheme();

  const resolve = (value: ColorValue) =>
    value in colors ? colors[value as keyof ThemeColors] : value;

  const fill = resolve(fillColor);
  const track = resolve(trackColor);

  return (
    <View
      style={[styles.row, { gap }, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={`Page ${activeIndex + 1} of ${count}`}
    >
      {Array.from({ length: count }).map((_, index) => {
        const state: SegmentState =
          index < activeIndex
            ? "done"
            : index === activeIndex
              ? "active"
              : "upcoming";

        return (
          <Segment
            key={index}
            state={state}
            duration={duration}
            height={height}
            fillColor={fill}
            trackColor={track}
            onComplete={state === "active" ? onSegmentComplete : undefined}
            onPress={onSegmentPress ? () => onSegmentPress(index) : undefined}
            accessibilityLabel={`Go to page ${index + 1}`}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  segment: {
    flex: 1,
  },
  track: {
    width: "100%",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});
