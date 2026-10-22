// import { ThemeProvider, useTheme } from "@/core/theme/ThemeProvider";
// import { AnimatedSplash } from "@/features/splash/components/AnimatedSplash";
// import { useAuthStore } from "@/store/authStore";
// import {
//   Urbanist_400Regular,
//   Urbanist_500Medium,
//   Urbanist_600SemiBold,
//   Urbanist_700Bold,
//   useFonts,
// } from "@expo-google-fonts/urbanist";
// import { Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { StatusBar } from "expo-status-bar";
// import { useCallback, useEffect, useState } from "react";
// import { ActivityIndicator, StyleSheet, View } from "react-native";

// SplashScreen.preventAutoHideAsync();

// /** Shown only if the session check is still running after the animated splash */
// function LoadingScreen() {
//   const { colors } = useTheme();

//   return (
//     <View style={[styles.loading, { backgroundColor: colors.background }]}>
//       <ActivityIndicator color={colors.primary} />
//     </View>
//   );
// }

// function RootStack() {
//   const { isDark, colors } = useTheme();
//   const signedIn = useAuthStore((s) => s.status === "signedIn");

//   return (
//     <>
//       <StatusBar style={isDark ? "light" : "dark"} />
//       <Stack
//         screenOptions={{
//           headerShown: false,
//           contentStyle: { backgroundColor: colors.background },
//           keyboardHandlingEnabled: false,
//         }}
//       >
//         {/* Open to everyone: sends you to the right place */}
//         <Stack.Screen name="index" />

//         {/* Only reachable while signed out */}
//         <Stack.Protected guard={!signedIn}>
//           <Stack.Screen name="(onboarding)/intro-one" />
//           <Stack.Screen name="(auth)/login" />
//           <Stack.Screen name="(auth)/signup" />
//           <Stack.Screen name="(auth)/verify-account" />
//         </Stack.Protected>

//         {/* Only reachable while signed in */}
//         <Stack.Protected guard={signedIn}>
//           <Stack.Screen name="(tabs)" />
//           <Stack.Screen name="add-card" />
//           <Stack.Screen name="address" />
//           <Stack.Screen name="payment" />
//           <Stack.Screen name="products" />
//           <Stack.Screen name="search" />
//           <Stack.Screen name="notifications/index" />
//           <Stack.Screen name="notifications/settings" />
//           <Stack.Screen name="order-details/[id]" />
//           <Stack.Screen name="order-tracking/[id]" />
//           <Stack.Screen name="product-details/[id]" />
//           <Stack.Screen name="settings/change-password" />
//           <Stack.Screen name="settings/edit-profile" />
//           <Stack.Screen name="settings/help-support" />
//           <Stack.Screen name="settings/legal" />
//           <Stack.Screen name="settings/security" />
//         </Stack.Protected>
//       </Stack>
//     </>
//   );
// }

// export default function RootLayout() {
//   const [fontsLoaded, fontError] = useFonts({
//     Urbanist_400Regular,
//     Urbanist_500Medium,
//     Urbanist_600SemiBold,
//     Urbanist_700Bold,
//   });
//   const [splashDone, setSplashDone] = useState(false);
//   const status = useAuthStore((s) => s.status);

//   const handleSplashFinish = useCallback(() => setSplashDone(true), []);

//   // Checks for a saved session while the splash animation plays
//   useEffect(() => {
//     useAuthStore.getState().bootstrap();
//   }, []);

//   useEffect(() => {
//     if (fontsLoaded || fontError) SplashScreen.hideAsync();
//   }, [fontsLoaded, fontError]);

//   if (!fontsLoaded && !fontError) return null;

//   return (
//     <ThemeProvider>
//       {!splashDone ? (
//         <AnimatedSplash onFinish={handleSplashFinish} />
//       ) : status === "loading" ? (
//         <LoadingScreen />
//       ) : (
//         <RootStack />
//       )}
//     </ThemeProvider>
//   );
// }

// const styles = StyleSheet.create({
//   loading: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

import { queryClient } from "@/core/api/queryClient";
import { ThemeProvider, useTheme } from "@/core/theme/ThemeProvider";
import { AnimatedSplash } from "@/features/splash/components/AnimatedSplash";
import { useAuthStore } from "@/store/authStore";
import {
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
  useFonts,
} from "@expo-google-fonts/urbanist";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

SplashScreen.preventAutoHideAsync();

/** Shown only if the session check is still running after the animated splash */
function LoadingScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.loading, { backgroundColor: colors.background }]}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

function RootStack() {
  const { isDark, colors } = useTheme();
  const signedIn = useAuthStore((s) => s.status === "signedIn");

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {/* Open to everyone: sends you to the right place */}
        <Stack.Screen name="index" />

        {/* Only reachable while signed out */}
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="(onboarding)/intro-one" />
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/signup" />
          <Stack.Screen name="(auth)/verify-account" />
        </Stack.Protected>

        {/* Only reachable while signed in */}
        <Stack.Protected guard={signedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="add-card" />
          <Stack.Screen name="address" />
          <Stack.Screen name="address-form" />
          <Stack.Screen name="payment" />
          <Stack.Screen name="products" />
          <Stack.Screen name="search" />
          <Stack.Screen name="notifications/index" />
          <Stack.Screen name="notifications/settings" />
          <Stack.Screen name="order-details/[id]" />
          <Stack.Screen name="order-tracking/[id]" />
          <Stack.Screen name="product-details/[id]" />
          <Stack.Screen name="settings/change-password" />
          <Stack.Screen name="settings/edit-profile" />
          <Stack.Screen name="settings/help-support" />
          <Stack.Screen name="settings/legal" />
          <Stack.Screen name="settings/security" />
        </Stack.Protected>
      </Stack>
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
  const status = useAuthStore((s) => s.status);

  const handleSplashFinish = useCallback(() => setSplashDone(true), []);

  // Checks for a saved session while the splash animation plays
  useEffect(() => {
    useAuthStore.getState().bootstrap();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {!splashDone ? (
          <AnimatedSplash onFinish={handleSplashFinish} />
        ) : status === "loading" ? (
          <LoadingScreen />
        ) : (
          <RootStack />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
