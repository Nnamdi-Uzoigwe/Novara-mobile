import { StepOne } from "@/features/onboarding/components/StepOne";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AUTO_NEXT_MS = 3000;

export default function IntroOne() {
  const router = useRouter();
  // const { colors } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/(onboarding)/intro-two");
    }, AUTO_NEXT_MS);

    return () => clearTimeout(timer);
  }, [router]);
  return (
    <SafeAreaView style={styles.safeArea}>
      <StepOne />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingHorizontal: 20,
  },
});
