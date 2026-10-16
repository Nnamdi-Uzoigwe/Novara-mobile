import { AppText } from "@/shared/components/AppText";
import { BottomSheet } from "@/shared/components/BottomSheet";
import { Button } from "@/shared/components/Button";
import { OtpInput } from "@/shared/components/OtpInput";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function SignupVerification() {
  const [code, setCode] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSubmit = () => {
    setSheetOpen(true);
  };

  const handleContinue = () => {
    setSheetOpen(false);
    router.replace("/(auth)/login");
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Feather
              name="arrow-left"
              size={24}
              color="textPrimary"
              style={styles.backBtn}
            />
          </TouchableOpacity>

          <AppText weight="bold" size={20} color="textPrimary">
            Verification
          </AppText>
        </View>

        <View style={styles.iconContainer}>
          <View style={styles.innerCircle}>
            <MaterialIcons name="mail-lock" size={24} color="white" />
          </View>
        </View>

        <View style={styles.center}>
          <AppText size={25} weight="bold" color="textPrimary">
            Verification Code
          </AppText>
          <AppText
            size={16}
            weight="semibold"
            color="textSecondary"
            align="center"
          >
            We have sent a verification code to{" "}
            <AppText
              size={16}
              weight="bold"
              color="textSecondary"
              align="center"
            >
              johndoe@gmail.com
            </AppText>
          </AppText>
        </View>

        <View style={styles.gap}>
          <OtpInput value={code} onChange={setCode} autoFocus={false} />

          <Button label="Submit" onPress={handleSubmit} />
        </View>

        <View style={styles.flex}>
          <AppText align="center" size={16} weight="bold" color="textSecondary">
            Didn't receive the code?
          </AppText>
          <TouchableOpacity>
            <AppText align="center" size={16} weight="bold" color="primary">
              Resend
            </AppText>
          </TouchableOpacity>
        </View>

        <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
          <View style={styles.sheetContent}>
            <View style={styles.successContainer}>
              <View style={styles.successCircle}>
                <Ionicons name="checkmark-circle" size={24} color="white" />
              </View>
            </View>

            <View style={styles.textBlock}>
              <AppText size={22} weight="bold" align="center">
                Account Verified!
              </AppText>
              <AppText
                size={15}
                weight="medium"
                color="textSecondary"
                align="center"
              >
                Your email has been confirmed. You can now proceed to login.
              </AppText>
            </View>

            <Button label="Go to login" onPress={handleContinue} />
          </View>
        </BottomSheet>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  header: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: "#e6e5e5",
  },
  backBtn: {
    position: "absolute",
    left: 6,
    bottom: 6,
  },
  iconContainer: {
    paddingHorizontal: 20,
    marginTop: 50,
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: "#f1eeff",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: "#5B4BB8",
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingVertical: 20,
  },
  flex: {
    flexDirection: "row",
    gap: 3,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  gap: {
    paddingHorizontal: 20,
    gap: 40,
  },
  textBlock: {
    gap: 8,
  },
  sheetContent: {
    gap: 24,
    alignItems: "stretch",
  },
  successContainer: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: "#d5f5e5",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  successCircle: {
    height: 72,
    width: 72,
    borderRadius: 36,
    backgroundColor: "#2FA66A",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
