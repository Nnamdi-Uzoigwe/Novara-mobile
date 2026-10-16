import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppText } from "@/shared/components/AppText";
import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

const UNDERLINE_RATIO = 0.55; // underline width as a fraction of one tab slot

type TopTabsProps = {
  tabs: string[];
  activeIndex: number;
  onChange: (index: number) => void;
};

export function TopTabs({ tabs, activeIndex, onChange }: TopTabsProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [width, setWidth] = useState(0);
  const translateX = useSharedValue(0);

  const tabWidth = width / tabs.length;
  const underlineWidth = tabWidth * UNDERLINE_RATIO;
  const underlineInset = (tabWidth - underlineWidth) / 2;

  useEffect(() => {
    if (!tabWidth) return;
    translateX.value = withSpring(activeIndex * tabWidth, {
      damping: 16,
      stiffness: 170,
    });
  }, [activeIndex, tabWidth, translateX]);

  const underlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleLayout = (e: LayoutChangeEvent) =>
    setWidth(e.nativeEvent.layout.width);

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {tabs.map((label, index) => {
        const active = index === activeIndex;
        return (
          <Pressable
            key={label}
            style={styles.tab}
            onPress={() => {
              if (active) return;
              Haptics.selectionAsync();
              onChange(index);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <AppText
              size={15}
              weight={active ? "semibold" : "medium"}
              color={active ? "textPrimary" : "textPlaceholder"}
            >
              {label}
            </AppText>
          </Pressable>
        );
      })}

      {tabWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.underline,
            { width: underlineWidth, left: underlineInset },
            underlineStyle,
          ]}
        />
      )}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      marginHorizontal: 20,
      marginTop: 16,
      marginBottom: 16,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 12,
    },
    underline: {
      position: "absolute",
      bottom: 0,
      height: 2.5,
      borderRadius: 2,
      backgroundColor: c.primary,
    },
  });
