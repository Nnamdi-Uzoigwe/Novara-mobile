import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <View style={styles.iconWrap}>
        <Feather name="compass" size={44} color={colors.primary} />
      </View>

      <AppText size={48} weight="bold" color="primary" align="center">
        404
      </AppText>

      <View style={styles.text}>
        <AppText size={22} weight="bold" align="center">
          Page not found
        </AppText>
        <AppText
          size={14}
          weight="medium"
          color="textSecondary"
          align="center"
          lineHeight={21}
        >
          The page you are looking for doesn't exist or may have been moved.
        </AppText>
      </View>

      <View style={styles.actions}>
        <Button
          label="Go to Home"
          onPress={() => router.replace("/(tabs)/home")}
        />
        <Button label="Go Back" variant="outline" onPress={handleBack} />
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      gap: 14,
      backgroundColor: c.background,
    },
    iconWrap: {
      height: 96,
      width: 96,
      borderRadius: 48,
      backgroundColor: c.primary + "1F",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      gap: 8,
      marginBottom: 8,
    },
    actions: {
      alignSelf: "stretch",
      gap: 12,
    },
  });
