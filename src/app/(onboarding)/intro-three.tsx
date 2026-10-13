import { StepThree } from "@/features/onboarding/components/StepThree";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IntroThree() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StepThree />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingHorizontal: 20,
  },
});
