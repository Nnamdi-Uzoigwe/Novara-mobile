import SignupVerification from "@/features/auth/components/SignupVerification";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyAccount() {
  return (
    <SafeAreaView>
      <SignupVerification />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
