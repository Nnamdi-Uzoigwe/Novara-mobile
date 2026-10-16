import { useTheme } from "@/core/theme/ThemeProvider";
import { fonts } from "@/core/theme/typography";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import FacebookSignIn from "./FacebookSignIn";
import GoogleSignIn from "./GoogleSignIn";

type Field = "username" | "email" | "password";

export default function CreateAccount() {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState<Field | null>(null);

  const focusProps = (field: Field) => ({
    onFocus: () => setFocused(field),
    onBlur: () => setFocused((prev) => (prev === field ? null : prev)),
  });

  const inputStyle = (field: Field) => [
    styles.textInput,
    focused === field && { borderColor: colors.primary },
  ];

  const iconColor = (field: Field) =>
    focused === field ? colors.primary : "#b0afaf";

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <AppText size={25} weight="bold">
            Create Account
          </AppText>
          <AppText color="textSecondary" size={15} weight="semibold">
            A few details, then you're ready to shop.
          </AppText>
        </View>

        <View style={styles.form}>
          {/* Username */}
          <View>
            <AppText size={18} weight="bold">
              Username
            </AppText>

            <View style={styles.textInputContainer}>
              <TextInput
                {...focusProps("username")}
                style={inputStyle("username")}
                placeholderTextColor="#b0afaf"
                placeholder="Enter your username"
                autoCapitalize="words"
              />

              <Feather
                name="user"
                size={20}
                color={iconColor("username")}
                style={styles.iconAbsolute}
              />
            </View>
          </View>

          {/* Email */}
          <View>
            <AppText size={18} weight="bold">
              Email
            </AppText>

            <View style={styles.textInputContainer}>
              <TextInput
                {...focusProps("email")}
                style={inputStyle("email")}
                placeholderTextColor="#b0afaf"
                placeholder="Enter your email"
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color={iconColor("email")}
                style={styles.iconAbsolute}
              />
            </View>
          </View>

          {/* Password */}
          <View>
            <AppText size={18} weight="bold">
              Password
            </AppText>

            <View style={styles.textInputContainer}>
              <TextInput
                {...focusProps("password")}
                style={inputStyle("password")}
                placeholderTextColor="#b0afaf"
                placeholder="Create a password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!open}
                textContentType="newPassword"
              />
              <Feather
                name="lock"
                size={20}
                color={iconColor("password")}
                style={styles.iconAbsolute}
              />

              <TouchableOpacity
                style={styles.passwordIcon}
                onPress={() => setOpen((prev) => !prev)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={open ? "Hide password" : "Show password"}
              >
                <Feather
                  name={open ? "eye-off" : "eye"}
                  size={20}
                  color="#b0afaf"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.gap}>
          <Button
            label="Create Account"
            onPress={() => router.push("/(auth)/verify-account")}
          />
          <AppText weight="semibold" color="textSecondary" align="center">
            Or using other method
          </AppText>
          <GoogleSignIn />
          <FacebookSignIn />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 10,
  },
  form: {
    marginVertical: 30,
    gap: 10,
  },
  textInput: {
    backgroundColor: "#f9f9fd",
    padding: 14,
    fontSize: 16,
    borderRadius: 10,
    paddingLeft: 40,
    fontFamily: fonts.medium,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  textInputContainer: {
    position: "relative",
  },
  iconAbsolute: {
    position: "absolute",
    top: 14,
    left: 12,
  },
  passwordIcon: {
    position: "absolute",
    top: 14,
    right: 12,
  },
  gap: {
    gap: 20,
  },
});
