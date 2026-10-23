import {
  ApiClientError,
  errorMessage,
  fieldErrorsFrom,
} from "@/core/api/ApiClientError";
import { useTheme } from "@/core/theme/ThemeProvider";
import { authApi } from "@/features/auth/api";
import { AppInput } from "@/shared/components/AppInput";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { FormField } from "@/shared/components/FormField";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import FacebookSignIn from "./FacebookSignIn";
import GoogleSignIn from "./GoogleSignIn";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = { name?: string; email?: string; password?: string };

export default function CreateAccount() {
  const { colors } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const errors: Errors = {
    name: name.trim().length >= 2 ? "" : "Enter your name",
    email: EMAIL_REGEX.test(email.trim()) ? "" : "Enter a valid email address",
    password: password.length >= 8 ? "" : "Use at least 8 characters",
  };

  const shown = (field: keyof Errors) =>
    (submitted ? errors[field] : "") || serverErrors[field] || "";

  const goToVerification = () =>
    router.push({
      pathname: "/(auth)/verify-account",
      params: { email: email.trim().toLowerCase() },
    });

  const handleSubmit = async () => {
    setSubmitted(true);
    setFormError("");
    setServerErrors({});

    if (Object.values(errors).some(Boolean) || loading) return;

    setLoading(true);
    try {
      await authApi.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      goToVerification();
    } catch (err) {
      if (err instanceof ApiClientError && err.code === "CODE_COOLDOWN") {
        // A code was just sent, so go on and let the user type it
        goToVerification();
      } else if (err instanceof ApiClientError && err.code === "EMAIL_TAKEN") {
        setServerErrors({ email: err.message });
      } else {
        const fields = fieldErrorsFrom(err);
        if (Object.keys(fields).length > 0) setServerErrors(fields);
        else setFormError(errorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <AppText size={25} weight="bold">
          Create Account
        </AppText>
        <AppText color="textSecondary" size={15} weight="semibold">
          A few details, then you're ready to shop.
        </AppText>
      </View>

      <View style={styles.form}>
        <FormField label="Username" error={shown("name")}>
          <AppInput
            icon="user"
            placeholder="Enter your username"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            textContentType="name"
            autoComplete="name"
            error={!!shown("name")}
          />
        </FormField>

        <FormField label="Email" error={shown("email")}>
          <AppInput
            icon="mail"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            error={!!shown("email")}
          />
        </FormField>

        <FormField label="Password" error={shown("password")}>
          <AppInput
            icon="lock"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry={!showPassword}
            textContentType="newPassword"
            autoComplete="new-password"
            error={!!shown("password")}
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
      </View>

      <View style={styles.gap}>
        {!!formError && (
          <AppText size={13} weight="semibold" color="danger" align="center">
            {formError}
          </AppText>
        )}

        <Button
          label="Create Account"
          loading={loading}
          onPress={handleSubmit}
        />

        <AppText weight="semibold" color="textSecondary" align="center">
          Or using other method
        </AppText>
        <GoogleSignIn />
        <FacebookSignIn />

        <View style={styles.signIn}>
          <AppText size={16} weight="bold" color="textPrimary">
            Already have an account?
          </AppText>
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/login")}
            hitSlop={8}
          >
            <AppText size={16} weight="bold" color="primary">
              Sign in
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    // </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },
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
  signIn: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
});
