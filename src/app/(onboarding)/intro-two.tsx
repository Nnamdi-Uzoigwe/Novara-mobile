import { StepTwo } from "@/features/onboarding/components/StepTwo";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AUTO_NEXT_MS = 3000;

export default function IntroTwo() {
  const router = useRouter();
  // const { colors } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/(onboarding)/intro-three");
    }, AUTO_NEXT_MS);

    return () => clearTimeout(timer);
  }, [router]);
  return (
    <SafeAreaView style={styles.safeArea}>
      <StepTwo />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingHorizontal: 20,
  },
});
