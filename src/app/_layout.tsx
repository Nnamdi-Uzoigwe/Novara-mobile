import { ThemeProvider, useTheme } from "@/core/theme/ThemeProvider";
import { AnimatedSplash } from "@/features/splash/components/AnimatedSplash";
import {
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
  useFonts,
} from "@expo-google-fonts/urbanist";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

function RootStack() {
  const { isDark, colors } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          // animation: "slide_from_right",
        }}
      />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
  });
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashFinish = useCallback(() => setSplashDone(true), []);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider>
      {splashDone ? (
        <RootStack />
      ) : (
        <AnimatedSplash onFinish={handleSplashFinish} />
      )}
    </ThemeProvider>
  );
}
