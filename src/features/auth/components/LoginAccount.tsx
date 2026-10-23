// import { useTheme } from "@/core/theme/ThemeProvider";
// import { fonts } from "@/core/theme/typography";
// import { ForgotPasswordSheet } from "@/features/auth/components/ForgotPasswordSheet";
// import { AppText } from "@/shared/components/AppText";
// import { Button } from "@/shared/components/Button";
// import Feather from "@expo/vector-icons/Feather";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import { router } from "expo-router";
// import { useState } from "react";
// import {
//     ActivityIndicator,
//     Keyboard,
//     ScrollView,
//     StyleSheet,
//     TextInput,
//     TouchableOpacity,
//     TouchableWithoutFeedback,
//     View,
// } from "react-native";
// import FacebookSignIn from "./FacebookSignIn";
// import GoogleSignIn from "./GoogleSignIn";

// type Field = "email" | "password";

// export default function LoginAccount() {
//   const { colors } = useTheme();
//   const [open, setOpen] = useState(false);
//   const [focused, setFocused] = useState<Field | null>(null);
//   const [sheetOpen, setSheetOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const focusProps = (field: Field) => ({
//     onFocus: () => setFocused(field),
//     onBlur: () => setFocused((prev) => (prev === field ? null : prev)),
//   });

//   const inputStyle = (field: Field) => [
//     styles.textInput,
//     focused === field && { borderColor: colors.primary },
//   ];

//   const iconColor = (field: Field) =>
//     focused === field ? colors.primary : "#b0afaf";

//   const handleLogin = () => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       router.push("/(tabs)/home");
//     }, 3000);
//   };

//   return (
//     <>
//       <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
//         <ScrollView keyboardShouldPersistTaps="handled">
//           <View style={styles.header}>
//             <AppText size={25} weight="bold">
//               Login Account
//             </AppText>
//             <AppText color="textSecondary" size={15} weight="semibold">
//               Please login to your account to continue.
//             </AppText>
//           </View>

//           <View style={styles.form}>
//             {/* Email */}
//             <View>
//               <AppText size={18} weight="bold">
//                 Email
//               </AppText>

//               <View style={styles.textInputContainer}>
//                 <TextInput
//                   {...focusProps("email")}
//                   style={inputStyle("email")}
//                   placeholderTextColor="#b0afaf"
//                   placeholder="Enter your email"
//                   autoCapitalize="none"
//                   keyboardType="email-address"
//                 />
//                 <MaterialCommunityIcons
//                   name="email-outline"
//                   size={20}
//                   color={iconColor("email")}
//                   style={styles.iconAbsolute}
//                 />
//               </View>
//             </View>

//             {/* Password */}
//             <View>
//               <AppText size={18} weight="bold">
//                 Password
//               </AppText>

//               <View style={styles.textInputContainer}>
//                 <TextInput
//                   {...focusProps("password")}
//                   style={inputStyle("password")}
//                   placeholderTextColor="#b0afaf"
//                   placeholder="Enter your password"
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   secureTextEntry={!open}
//                   textContentType="password"
//                 />
//                 <Feather
//                   name="lock"
//                   size={20}
//                   color={iconColor("password")}
//                   style={styles.iconAbsolute}
//                 />

//                 <TouchableOpacity
//                   style={styles.passwordIcon}
//                   onPress={() => setOpen((prev) => !prev)}
//                   hitSlop={10}
//                   accessibilityRole="button"
//                   accessibilityLabel={open ? "Hide password" : "Show password"}
//                 >
//                   <Feather
//                     name={open ? "eye-off" : "eye"}
//                     size={20}
//                     color="#b0afaf"
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Forgot Password */}
//             <TouchableOpacity onPress={() => setSheetOpen(true)} hitSlop={8}>
//               <AppText size={16} weight="bold" color="primary">
//                 Forgot Password?
//               </AppText>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.gap}>
//             <Button
//               label={loading ? <ActivityIndicator /> : "Sign in"}
//               onPress={handleLogin}
//             />
//             <AppText weight="semibold" color="textSecondary" align="center">
//               Or using other method
//             </AppText>
//             <GoogleSignIn />
//             <FacebookSignIn />
//           </View>
//         </ScrollView>
//       </TouchableWithoutFeedback>

//       <ForgotPasswordSheet
//         visible={sheetOpen}
//         onClose={() => setSheetOpen(false)}
//       />
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     gap: 10,
//   },
//   form: {
//     marginVertical: 30,
//     gap: 10,
//   },
//   textInput: {
//     backgroundColor: "#f9f9fd",
//     padding: 14,
//     fontSize: 16,
//     borderRadius: 10,
//     paddingLeft: 40,
//     fontFamily: fonts.medium,
//     borderWidth: 1.5,
//     borderColor: "transparent",
//   },
//   textInputContainer: {
//     position: "relative",
//   },
//   iconAbsolute: {
//     position: "absolute",
//     top: 14,
//     left: 12,
//   },
//   passwordIcon: {
//     position: "absolute",
//     top: 14,
//     right: 12,
//   },
//   gap: {
//     gap: 20,
//   },
// });

import { ApiClientError, errorMessage } from "@/core/api/ApiClientError";
import { useTheme } from "@/core/theme/ThemeProvider";
import { authApi } from "@/features/auth/api";
import { ForgotPasswordSheet } from "@/features/auth/components/ForgotPasswordSheet";
import { AppInput } from "@/shared/components/AppInput";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { FormField } from "@/shared/components/FormField";
import { useAuthStore } from "@/store/authStore";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import FacebookSignIn from "./FacebookSignIn";
import GoogleSignIn from "./GoogleSignIn";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginAccount() {
  const { colors } = useTheme();
  const completeSignIn = useAuthStore((s) => s.completeSignIn);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const errors = {
    email: EMAIL_REGEX.test(email.trim()) ? "" : "Enter a valid email address",
    password: password.length > 0 ? "" : "Enter your password",
  };

  const handleLogin = async () => {
    setSubmitted(true);
    setFormError("");

    if (errors.email || errors.password || loading) return;

    const cleanEmail = email.trim().toLowerCase();

    setLoading(true);
    try {
      const data = await authApi.login({ email: cleanEmail, password });
      await completeSignIn(data);
      router.replace("/(tabs)/home");
    } catch (err) {
      if (err instanceof ApiClientError && err.code === "EMAIL_NOT_VERIFIED") {
        // The server already sent a fresh code
        router.push({
          pathname: "/(auth)/verify-account",
          params: { email: cleanEmail },
        });
      } else if (
        err instanceof ApiClientError &&
        err.code === "ACCOUNT_LOCKED"
      ) {
        const seconds = (
          err.details as { retryAfterSeconds?: number } | undefined
        )?.retryAfterSeconds;
        const minutes = seconds ? Math.max(1, Math.ceil(seconds / 60)) : 15;
        setFormError(
          `Too many failed attempts. Try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`,
        );
      } else {
        setFormError(errorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <AppText size={25} weight="bold">
              Login Account
            </AppText>
            <AppText color="textSecondary" size={15} weight="semibold">
              Please login to your account to continue.
            </AppText>
          </View>

          <View style={styles.form}>
            <FormField label="Email" error={submitted ? errors.email : ""}>
              <AppInput
                icon="mail"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                error={submitted && !!errors.email}
              />
            </FormField>

            <FormField
              label="Password"
              error={submitted ? errors.password : ""}
            >
              <AppInput
                icon="lock"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                secureTextEntry={!showPassword}
                textContentType="password"
                autoComplete="current-password"
                error={submitted && !!errors.password}
                right={
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <Feather
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color={colors.textPlaceholder}
                    />
                  </TouchableOpacity>
                }
              />
            </FormField>

            <TouchableOpacity onPress={() => setSheetOpen(true)} hitSlop={8}>
              <AppText size={16} weight="bold" color="primary">
                Forgot Password?
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.gap}>
            {!!formError && (
              <AppText
                size={13}
                weight="semibold"
                color="danger"
                align="center"
              >
                {formError}
              </AppText>
            )}

            <Button label="Sign in" loading={loading} onPress={handleLogin} />

            <AppText weight="semibold" color="textSecondary" align="center">
              Or using other method
            </AppText>
            <GoogleSignIn />
            <FacebookSignIn />

            <View style={styles.signUp}>
              <AppText size={16} weight="bold" color="textPrimary">
                Don't have an account?
              </AppText>
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/signup")}
                hitSlop={8}
              >
                <AppText size={16} weight="bold" color="primary">
                  Sign up
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      <ForgotPasswordSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 10,
  },
  form: {
    marginVertical: 30,
    gap: 14,
  },
  gap: {
    gap: 20,
  },
  signUp: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
});
