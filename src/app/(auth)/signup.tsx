import CreateAccount from "@/features/auth/components/CreateAccount";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Signup() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <CreateAccount />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
