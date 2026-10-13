import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, ViewStyle } from "react-native";

type FadeInViewProps = {
  children: React.ReactNode;
  /** Wait before starting, in ms. Use it to stagger items */
  delay?: number;
  duration?: number;
  /** How far the item slides up from, in px */
  distance?: number;
  /** Starting scale (e.g. 0.92 grows to 1). Defaults to no scaling */
  scaleFrom?: number;
  style?: StyleProp<ViewStyle>;
};

export function FadeInView({
  children,
  delay = 0,
  duration = 500,
  distance = 24,
  scaleFrom = 1,
  style,
}: FadeInViewProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress, delay, duration]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [distance, 0],
  });

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [scaleFrom, 1],
  });

  return (
    <Animated.View
      style={[
        { opacity: progress, transform: [{ translateY }, { scale }] },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
