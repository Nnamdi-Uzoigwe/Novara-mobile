import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { fonts } from "@/core/theme/typography";
import { AppText } from "@/shared/components/AppText";
import { BottomSheet } from "@/shared/components/BottomSheet";
import { Button } from "@/shared/components/Button";
import { FadeInView } from "@/shared/components/FadeInView";
import { OtpInput } from "@/shared/components/OtpInput";
import Feather from "@expo/vector-icons/Feather";
import React, { useEffect, useMemo, useState } from "react";
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from "react-native";

const OTP_LENGTH = 5;
const RESEND_SECONDS = 30;
const MIN_PASSWORD = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// TODO: replace these three stubs with your real API calls
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function requestResetCode(email: string): Promise<void> {
  await wait(700);
}

async function verifyResetCode(email: string, code: string): Promise<boolean> {
  await wait(700);
  return true; // return false for a wrong code
}

async function resetPassword(
  email: string,
  code: string,
  password: string,
): Promise<void> {
  await wait(700);
}

type Step = "email" | "code" | "reset" | "done";

type ForgotPasswordSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function ForgotPasswordSheet({
  visible,
  onClose,
}: ForgotPasswordSheetProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Start fresh every time the sheet opens
  useEffect(() => {
    if (!visible) return;
    setStep("email");
    setEmail("");
    setCode("");
    setCodeError(false);
    setPassword("");
    setConfirm("");
    setError("");
    setLoading(false);
    setSeconds(0);
  }, [visible]);

  // Resend countdown
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const run = async (task: () => Promise<void>) => {
    setLoading(true);
    setError("");
    try {
      await task();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = () => {
    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    run(async () => {
      await requestResetCode(email.trim());
      setCode("");
      setCodeError(false);
      setSeconds(RESEND_SECONDS);
      setStep("code");
    });
  };

  const handleResend = () => {
    if (seconds > 0 || loading) return;
    run(async () => {
      await requestResetCode(email.trim());
      setCode("");
      setCodeError(false);
      setSeconds(RESEND_SECONDS);
    });
  };

  const handleVerify = () => {
    run(async () => {
      const ok = await verifyResetCode(email.trim(), code);
      if (ok) {
        setStep("reset");
      } else {
        setCodeError(true);
        setCode("");
        setError("That code is incorrect. Try again.");
      }
    });
  };

  const handleReset = () => {
    if (password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    run(async () => {
      await resetPassword(email.trim(), code, password);
      setStep("done");
    });
  };

  const titles: Record<Step, { title: string; subtitle: string }> = {
    email: {
      title: "Forgot Password?",
      subtitle:
        "Enter the email linked to your account and we will send you a code.",
    },
    code: {
      title: "Enter Code",
      subtitle: `We sent a ${OTP_LENGTH}-digit code to ${email.trim()}.`,
    },
    reset: {
      title: "Reset Password",
      subtitle: "Create a new password for your account.",
    },
    done: {
      title: "Password Reset!",
      subtitle:
        "Your password has been changed. You can now sign in with your new password.",
    },
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <FadeInView key={step} duration={350} distance={16}>
        <View style={styles.content}>
          {step === "done" && (
            <View style={styles.successCircle}>
              <Feather name="check" size={32} color={colors.onPrimary} />
            </View>
          )}

          <View style={styles.textBlock}>
            <AppText size={22} weight="bold" align="center">
              {titles[step].title}
            </AppText>
            <AppText
              size={15}
              weight="medium"
              color="textSecondary"
              align="center"
            >
              {titles[step].subtitle}
            </AppText>
          </View>

          {step === "email" && (
            <>
              <SheetField
                icon="mail"
                placeholder="Enter your email"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  setError("");
                }}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
              />
              {!!error && <ErrorText message={error} />}
              <Button
                label="Send Code"
                onPress={handleSendCode}
                loading={loading}
                disabled={email.trim().length === 0}
              />
            </>
          )}

          {step === "code" && (
            <>
              <OtpInput
                length={OTP_LENGTH}
                value={code}
                onChange={(v) => {
                  setCode(v);
                  setCodeError(false);
                  setError("");
                }}
                error={codeError}
              />
              {!!error && <ErrorText message={error} />}

              <View style={styles.resendRow}>
                <AppText size={14} weight="medium" color="textSecondary">
                  Didn't get the code?{" "}
                </AppText>
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={seconds > 0 || loading}
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
                label="Verify Code"
                onPress={handleVerify}
                loading={loading}
                disabled={code.length < OTP_LENGTH}
              />

              <TouchableOpacity
                style={styles.linkCenter}
                onPress={() => {
                  setStep("email");
                  setError("");
                }}
                hitSlop={8}
              >
                <AppText size={14} weight="semibold" color="primary">
                  Change email
                </AppText>
              </TouchableOpacity>
            </>
          )}

          {step === "reset" && (
            <>
              <SheetField
                icon="lock"
                secure
                placeholder="New password"
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  setError("");
                }}
                textContentType="newPassword"
                autoComplete="new-password"
              />
              <SheetField
                icon="lock"
                secure
                placeholder="Confirm new password"
                value={confirm}
                onChangeText={(v) => {
                  setConfirm(v);
                  setError("");
                }}
                textContentType="newPassword"
                autoComplete="new-password"
              />
              {!!error && <ErrorText message={error} />}
              <Button
                label="Reset Password"
                onPress={handleReset}
                loading={loading}
                disabled={password.length === 0 || confirm.length === 0}
              />
            </>
          )}

          {step === "done" && (
            <Button label="Back to Login" onPress={onClose} />
          )}
        </View>
      </FadeInView>
    </BottomSheet>
  );
}

function ErrorText({ message }: { message: string }) {
  return (
    <AppText size={13} weight="semibold" color="danger" align="center">
      {message}
    </AppText>
  );
}

type SheetFieldProps = TextInputProps & {
  icon: React.ComponentProps<typeof Feather>["name"];
  /** Password field with a show/hide toggle */
  secure?: boolean;
};

function SheetField({
  icon,
  secure = false,
  style,
  onFocus,
  onBlur,
  ...rest
}: SheetFieldProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      <TextInput
        placeholderTextColor={colors.textPlaceholder}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
        secureTextEntry={secure && !revealed}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          focused && { borderColor: colors.primary },
          style,
        ]}
      />

      <Feather
        name={icon}
        size={20}
        color={focused ? colors.primary : colors.textPlaceholder}
        style={styles.leftIcon}
      />

      {secure && (
        <TouchableOpacity
          style={styles.rightIcon}
          onPress={() => setRevealed((prev) => !prev)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={revealed ? "Hide password" : "Show password"}
        >
          <Feather
            name={revealed ? "eye-off" : "eye"}
            size={20}
            color={colors.textPlaceholder}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    content: {
      gap: 20,
    },
    textBlock: {
      gap: 8,
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
    resendRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    linkCenter: {
      alignItems: "center",
    },
    fieldWrap: {
      justifyContent: "center",
    },
    input: {
      height: 52,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: "transparent",
      backgroundColor: c.surfaceMuted,
      color: c.textPrimary,
      fontFamily: fonts.medium,
      fontSize: 16,
      paddingLeft: 40,
      paddingRight: 44,
    },
    leftIcon: {
      position: "absolute",
      left: 12,
    },
    rightIcon: {
      position: "absolute",
      right: 12,
    },
  });
