import { lightColors } from "@/core/theme/colors";
import { AppText } from "@/shared/components/AppText";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Must match the backgroundColor in the expo-splash-screen plugin (app.json)
const SPLASH_BG = lightColors.primary;

type AnimatedSplashProps = {
  onFinish: () => void;
  /** How long the splash stays fully visible, in ms */
  holdMs?: number;
};

export function AnimatedSplash({
  onFinish,
  holdMs = 1800,
}: AnimatedSplashProps) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(1)).current;
  const version = Constants.expoConfig?.version ?? "0.0.1";

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onFinish();
      });
    }, holdMs);

    return () => clearTimeout(timer);
  }, [holdMs, onFinish, opacity]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <StatusBar style="light" />

      <View style={styles.center}>
        <AppText color="onPrimary" weight="bold" size={40} align="center">
          Novara
        </AppText>
        <AppText
          color="rgba(255,255,255,0.8)"
          weight="regular"
          size={16}
          align="center"
          style={styles.tagline}
        >
          Any shopping just from home
        </AppText>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <AppText color="onPrimary" weight="medium" size={13} align="center">
          {`Version ${version}`}
        </AppText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: SPLASH_BG,
    zIndex: 100,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 130, // nudges the group above center, like the design
  },
  tagline: {
    marginTop: 8,
  },
  footer: {
    alignItems: "center",
  },
});
