import { useTheme } from "@/core/theme/ThemeProvider";
import { AppText } from "@/shared/components/AppText";
import Feather from "@expo/vector-icons/Feather";
import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

type AccordionItemProps = {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export function AccordionItem({
  title,
  open,
  onToggle,
  children,
}: AccordionItemProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(open ? 1 : 0);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, { duration: 250 });
  }, [open, progress]);

  const bodyStyle = useAnimatedStyle(() => ({
    height: contentHeight * progress.value,
    opacity: progress.value,
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }));

  const handleLayout = (e: LayoutChangeEvent) =>
    setContentHeight(e.nativeEvent.layout.height);

  return (
    <View>
      <Pressable
        style={styles.header}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <AppText size={15} weight="semibold" style={styles.title}>
          {title}
        </AppText>

        <Animated.View style={chevronStyle}>
          <Feather name="chevron-down" size={20} color={colors.textSecondary} />
        </Animated.View>
      </Pressable>

      <Animated.View style={[styles.body, bodyStyle]}>
        {/* Measured at its natural height, then revealed by the animated container */}
        <View style={styles.measure} onLayout={handleLayout}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 18,
  },
  title: {
    flex: 1,
  },
  body: {
    overflow: "hidden",
  },
  measure: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: 18,
  },
});
