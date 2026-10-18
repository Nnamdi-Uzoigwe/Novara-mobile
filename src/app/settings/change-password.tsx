import {
  ApiClientError,
  errorMessage,
  fieldErrorsFrom,
} from "@/core/api/ApiClientError";
import { saveTokens } from "@/core/api/tokens";
import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { accountApi } from "@/features/account/api";
import { AppInput } from "@/shared/components/AppInput";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { FormField } from "@/shared/components/FormField";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { useUserStore } from "@/store/userStore";
import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MIN_PASSWORD = 8;

type Errors = { current?: string; next?: string; confirm?: string };

export default function ChangePasswordScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const provider = useUserStore((s) => s.user?.provider);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const errors: Errors = {
    current: current.length > 0 ? "" : "Enter your current password",
    next:
      next.length < MIN_PASSWORD
        ? `Use at least ${MIN_PASSWORD} characters`
        : next === current
          ? "Choose a different password"
          : "",
    confirm: confirm === next ? "" : "Passwords do not match",
  };

  const shown = (field: keyof Errors) =>
    (submitted ? errors[field] : "") || serverErrors[field] || "";

  const handleChange = async () => {
    setSubmitted(true);
    setServerErrors({});
    setFormError("");

    if (Object.values(errors).some(Boolean) || loading) return;

    setLoading(true);
    try {
      const result = await accountApi.changePassword({
        currentPassword: current,
        newPassword: next,
      });

      // Every other device was signed out. This one gets a fresh session
      await saveTokens(result.tokens);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Password updated",
        "Your password has been changed. Other devices were signed out.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (err) {
      if (err instanceof ApiClientError && err.code === "WRONG_PASSWORD") {
        setServerErrors({ current: err.message });
      } else {
        const fields = fieldErrorsFrom(err);
        if (fields.currentPassword || fields.newPassword) {
          setServerErrors({
            current: fields.currentPassword,
            next: fields.newPassword,
          });
        } else {
          setFormError(errorMessage(err));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (provider === "google") {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Change Password" />
        <View style={styles.content}>
          <AppText
            size={14}
            weight="medium"
            color="textSecondary"
            lineHeight={21}
          >
            Your account signs in with Google, so there is no password to change
            here.
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScreenHeader title="Change Password" />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <PasswordField
          label="Current Password"
          placeholder="Enter your current password"
          value={current}
          onChange={setCurrent}
          error={shown("current")}
          autoComplete="current-password"
        />
        <PasswordField
          label="New Password"
          placeholder="Enter new password"
          value={next}
          onChange={setNext}
          error={shown("next")}
          autoComplete="new-password"
        />
        <PasswordField
          label="Confirm Password"
          placeholder="Confirm your new password"
          value={confirm}
          onChange={setConfirm}
          error={shown("confirm")}
          autoComplete="new-password"
        />

        {!!formError && (
          <AppText size={13} weight="semibold" color="danger" align="center">
            {formError}
          </AppText>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          label="Change Now"
          size="lg"
          loading={loading}
          disabled={
            current.length === 0 || next.length === 0 || confirm.length === 0
          }
          onPress={handleChange}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

type PasswordFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete: "current-password" | "new-password";
};

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
}: PasswordFieldProps) {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <FormField label={label} error={error}>
      <AppInput
        variant="outlined"
        icon="lock"
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoComplete={autoComplete}
        textContentType={
          autoComplete === "new-password" ? "newPassword" : "password"
        }
        error={!!error}
        right={
          <TouchableOpacity
            onPress={() => setVisible((prev) => !prev)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={visible ? "Hide password" : "Show password"}
          >
            <Feather
              name={visible ? "eye-off" : "eye"}
              size={20}
              color={colors.textPlaceholder}
            />
          </TouchableOpacity>
        }
      />
    </FormField>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 24,
      gap: 22,
    },
    footer: {
      paddingHorizontal: 20,
      paddingTop: 12,
    },
  });
