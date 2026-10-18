// import { ApiClientError, errorMessage } from "@/core/api/ApiClientError";
// import type { AuthResponse } from "@/core/api/types";
// import { useTheme } from "@/core/theme/ThemeProvider";
// import type { ThemeColors } from "@/core/theme/colors";
// import { authApi } from "@/features/auth/api";
// import { AppText } from "@/shared/components/AppText";
// import { BottomSheet } from "@/shared/components/BottomSheet";
// import { Button } from "@/shared/components/Button";
// import { OtpInput } from "@/shared/components/OtpInput";
// import { useAuthStore } from "@/store/authStore";
// import Feather from "@expo/vector-icons/Feather";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import { router, useLocalSearchParams } from "expo-router";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { StyleSheet, TouchableOpacity, View } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// const OTP_LENGTH = 5;
// const RESEND_SECONDS = 60;

// const CODE_ERRORS = ["INVALID_CODE", "CODE_EXPIRED", "TOO_MANY_ATTEMPTS"];

// export default function SignupVerification() {
//   const { email } = useLocalSearchParams<{ email?: string }>();
//   const { colors } = useTheme();
//   const insets = useSafeAreaInsets();
//   const styles = useMemo(() => createStyles(colors), [colors]);
//   const completeSignIn = useAuthStore((s) => s.completeSignIn);

//   const [code, setCode] = useState("");
//   const [codeError, setCodeError] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resending, setResending] = useState(false);
//   const [seconds, setSeconds] = useState(RESEND_SECONDS);
//   const [sheetOpen, setSheetOpen] = useState(false);

//   // The session is only saved when the user leaves the success sheet, so the sheet is never skipped
//   const pending = useRef<AuthResponse | null>(null);

//   useEffect(() => {
//     if (seconds <= 0) return;
//     const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
//     return () => clearTimeout(timer);
//   }, [seconds]);

//   const handleSubmit = async () => {
//     if (!email || code.length < OTP_LENGTH || loading) return;

//     setLoading(true);
//     setError("");
//     try {
//       pending.current = await authApi.verifyEmail({ email, code });
//       setSheetOpen(true);
//     } catch (err) {
//       setError(errorMessage(err));
//       if (err instanceof ApiClientError && CODE_ERRORS.includes(err.code)) {
//         setCodeError(true);
//         setCode("");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResend = async () => {
//     if (!email || seconds > 0 || resending) return;

//     setResending(true);
//     setError("");
//     try {
//       await authApi.resendCode(email, "verify_email");
//       setCode("");
//       setCodeError(false);
//       setSeconds(RESEND_SECONDS);
//     } catch (err) {
//       setError(errorMessage(err));
//     } finally {
//       setResending(false);
//     }
//   };

//   const handleContinue = async () => {
//     if (pending.current) {
//       await completeSignIn(pending.current);
//       pending.current = null;
//     }
//     setSheetOpen(false);
//     router.replace("/(tabs)/home");
//   };

//   const header = (
//     <View style={styles.header}>
//       <TouchableOpacity
//         onPress={() => router.back()}
//         style={styles.backBtn}
//         hitSlop={10}
//         accessibilityRole="button"
//         accessibilityLabel="Go back"
//       >
//         <Feather name="arrow-left" size={24} color={colors.textPrimary} />
//       </TouchableOpacity>

//       <AppText weight="bold" size={20}>
//         Verification
//       </AppText>
//     </View>
//   );

//   if (!email) {
//     return (
//       <View style={[styles.container, { paddingTop: insets.top }]}>
//         {header}
//         <AppText size={14} weight="medium" color="textSecondary" align="center">
//           We couldn't find the email to verify. Go back and try again.
//         </AppText>
//         <Button
//           label="Go back"
//           fullWidth={false}
//           onPress={() => router.back()}
//         />
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { paddingTop: insets.top }]}>
//       {header}

//       <View style={styles.iconContainer}>
//         <View style={styles.innerCircle}>
//           <MaterialCommunityIcons
//             name="email-lock"
//             size={28}
//             color={colors.onPrimary}
//           />
//         </View>
//       </View>

//       <View style={styles.textBlock}>
//         <AppText size={18} weight="bold" align="center">
//           Verification Code
//         </AppText>
//         <AppText
//           weight="semibold"
//           size={15}
//           color="textSecondary"
//           align="center"
//         >
//           We have sent a code to{" "}
//           <AppText weight="bold" size={15}>
//             {email}
//           </AppText>
//         </AppText>
//       </View>

//       <OtpInput
//         length={OTP_LENGTH}
//         value={code}
//         onChange={(value) => {
//           setCode(value);
//           setCodeError(false);
//           setError("");
//         }}
//         error={codeError}
//         autoFocus={false}
//       />

//       {!!error && (
//         <AppText size={13} weight="semibold" color="danger" align="center">
//           {error}
//         </AppText>
//       )}

//       <View style={styles.resendRow}>
//         <AppText size={14} weight="medium" color="textSecondary">
//           Didn't get the code?{" "}
//         </AppText>
//         <TouchableOpacity
//           onPress={handleResend}
//           disabled={seconds > 0 || resending}
//           hitSlop={8}
//         >
//           <AppText
//             size={14}
//             weight="bold"
//             color={seconds > 0 ? "textPlaceholder" : "primary"}
//           >
//             {seconds > 0 ? `Resend in ${seconds}s` : "Resend"}
//           </AppText>
//         </TouchableOpacity>
//       </View>

//       <Button
//         label="Submit"
//         loading={loading}
//         disabled={code.length < OTP_LENGTH}
//         onPress={handleSubmit}
//       />

//       <BottomSheet
//         visible={sheetOpen}
//         onClose={handleContinue}
//         dismissOnBackdrop={false}
//       >
//         <View style={styles.sheetContent}>
//           <View style={styles.successCircle}>
//             <Feather name="check" size={32} color={colors.onPrimary} />
//           </View>

//           <View style={styles.textBlock}>
//             <AppText size={22} weight="bold" align="center">
//               Account Verified!
//             </AppText>
//             <AppText
//               size={15}
//               weight="medium"
//               color="textSecondary"
//               align="center"
//             >
//               Your email has been confirmed. You can now start shopping.
//             </AppText>
//           </View>

//           <Button label="Go to homepage" onPress={handleContinue} />
//         </View>
//       </BottomSheet>
//     </View>
//   );
// }

// const createStyles = (c: ThemeColors) =>
//   StyleSheet.create({
//     container: {
//       backgroundColor: c.background,
//       gap: 24,
//     },
//     header: {
//       height: 54,
//       alignItems: "center",
//       justifyContent: "center",
//       borderBottomWidth: 1.5,
//       borderBottomColor: c.border,
//       // paddingHorizontal: 20,s
//     },
//     backBtn: {
//       position: "absolute",
//       left: 0,
//     },
//     iconContainer: {
//       height: 100,
//       width: 100,
//       borderRadius: 50,
//       backgroundColor: c.primary + "22",
//       alignSelf: "center",
//       justifyContent: "center",
//       alignItems: "center",
//     },
//     innerCircle: {
//       height: 70,
//       width: 70,
//       borderRadius: 35,
//       backgroundColor: c.primary,
//       justifyContent: "center",
//       alignItems: "center",
//     },
//     textBlock: {
//       gap: 8,
//     },
//     resendRow: {
//       flexDirection: "row",
//       justifyContent: "center",
//       alignItems: "center",
//     },
//     sheetContent: {
//       gap: 24,
//     },
//     successCircle: {
//       height: 72,
//       width: 72,
//       borderRadius: 36,
//       backgroundColor: c.success,
//       alignSelf: "center",
//       justifyContent: "center",
//       alignItems: "center",
//     },
//   });

import { ApiClientError, errorMessage } from "@/core/api/ApiClientError";
import type { AuthResponse } from "@/core/api/types";
import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { authApi } from "@/features/auth/api";
import { AppText } from "@/shared/components/AppText";
import { BottomSheet } from "@/shared/components/BottomSheet";
import { Button } from "@/shared/components/Button";
import { OtpInput } from "@/shared/components/OtpInput";
import { useAuthStore } from "@/store/authStore";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OTP_LENGTH = 5;
const RESEND_SECONDS = 60;

const CODE_ERRORS = ["INVALID_CODE", "CODE_EXPIRED", "TOO_MANY_ATTEMPTS"];

export default function SignupVerification() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const completeSignIn = useAuthStore((s) => s.completeSignIn);

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [sheetOpen, setSheetOpen] = useState(false);

  // The session is only saved when the user leaves the success sheet, so the sheet is never skipped
  const pending = useRef<AuthResponse | null>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const handleSubmit = async () => {
    if (!email || code.length < OTP_LENGTH || loading) return;

    setLoading(true);
    setError("");
    try {
      pending.current = await authApi.verifyEmail({ email, code });
      setSheetOpen(true);
    } catch (err) {
      setError(errorMessage(err));
      if (err instanceof ApiClientError && CODE_ERRORS.includes(err.code)) {
        setCodeError(true);
        setCode("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || seconds > 0 || resending) return;

    setResending(true);
    setError("");
    try {
      await authApi.resendCode(email, "verify_email");
      setCode("");
      setCodeError(false);
      setSeconds(RESEND_SECONDS);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setResending(false);
    }
  };

  const handleContinue = async () => {
    if (pending.current) {
      await completeSignIn(pending.current);
      pending.current = null;
    }
    setSheetOpen(false);
    router.replace("/(tabs)/home");
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backBtn}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Feather name="arrow-left" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <AppText weight="bold" size={20}>
        Verification
      </AppText>
    </View>
  );

  // If the header still sits too low, the route file already adds top padding.
  // Then delete { paddingTop: insets.top } from the container style below.
  const containerStyle = styles.container;

  if (!email) {
    return (
      <View style={containerStyle}>
        {header}
        <View style={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
          <AppText
            size={14}
            weight="medium"
            color="textSecondary"
            align="center"
          >
            We couldn't find the email to verify. Go back and try again.
          </AppText>
          <Button
            label="Go back"
            fullWidth={false}
            onPress={() => router.back()}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      {header}

      <View style={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.iconContainer}>
          <View style={styles.innerCircle}>
            <MaterialCommunityIcons
              name="email-lock"
              size={28}
              color={colors.onPrimary}
            />
          </View>
        </View>

        <View style={styles.textBlock}>
          <AppText size={18} weight="bold" align="center">
            Verification Code
          </AppText>
          <AppText
            weight="semibold"
            size={15}
            color="textSecondary"
            align="center"
          >
            We have sent a code to{" "}
            <AppText weight="bold" size={15}>
              {email}
            </AppText>
          </AppText>
        </View>

        <OtpInput
          length={OTP_LENGTH}
          value={code}
          onChange={(value) => {
            setCode(value);
            setCodeError(false);
            setError("");
          }}
          error={codeError}
          autoFocus={false}
        />

        {!!error && (
          <AppText size={13} weight="semibold" color="danger" align="center">
            {error}
          </AppText>
        )}

        <View style={styles.resendRow}>
          <AppText size={14} weight="medium" color="textSecondary">
            Didn't get the code?{" "}
          </AppText>
          <TouchableOpacity
            onPress={handleResend}
            disabled={seconds > 0 || resending}
            hitSlop={8}
          >
            <AppText
              size={14}
              weight="bold"
              color={seconds > 0 ? "textPlaceholder" : "primary"}
            >
              {seconds > 0 ? `Resend in ${seconds}s` : "Resend"}
            </AppText>
          </TouchableOpacity>
        </View>

        <Button
          label="Submit"
          loading={loading}
          disabled={code.length < OTP_LENGTH}
          onPress={handleSubmit}
        />
      </View>

      <BottomSheet
        visible={sheetOpen}
        onClose={handleContinue}
        dismissOnBackdrop={false}
      >
        <View style={styles.sheetContent}>
          <View style={styles.successCircle}>
            <Feather name="check" size={32} color={colors.onPrimary} />
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
              Your email has been confirmed. You can now start shopping.
            </AppText>
          </View>

          <Button label="Go to homepage" onPress={handleContinue} />
        </View>
      </BottomSheet>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: c.background,
    },
    // Full width, so the divider line reaches both edges of the screen
    header: {
      height: 54,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      borderBottomWidth: 1.5,
      borderBottomColor: c.border,
    },
    backBtn: {
      position: "absolute",
      left: 20,
    },
    body: {
      paddingHorizontal: 20,
      paddingTop: 24,
      gap: 24,
    },
    iconContainer: {
      height: 100,
      width: 100,
      borderRadius: 50,
      backgroundColor: c.primary + "22",
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
    },
    innerCircle: {
      height: 70,
      width: 70,
      borderRadius: 35,
      backgroundColor: c.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    textBlock: {
      gap: 8,
    },
    resendRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    sheetContent: {
      gap: 24,
    },
    successCircle: {
      height: 72,
      width: 72,
      borderRadius: 36,
      backgroundColor: c.success,
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
    },
  });
