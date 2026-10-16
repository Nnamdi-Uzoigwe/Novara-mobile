import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppInput } from "@/shared/components/AppInput";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
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
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ChangePasswordScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = {
    password:
      password.length >= MIN_PASSWORD
        ? ""
        : `Use at least ${MIN_PASSWORD} characters`,
    confirm: confirm === password ? "" : "Passwords do not match",
  };

  const handleChange = async () => {
    setSubmitted(true);
    if (errors.password || errors.confirm || loading) return;

    setLoading(true);
    try {
      // TODO: call your API. It should require a recent login or the current password
      await wait(800);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Password updated", "Your password has been changed.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("Something went wrong", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          label="New Password"
          placeholder="Enter new password"
          value={password}
          onChange={setPassword}
          error={submitted ? errors.password : ""}
        />
        <PasswordField
          label="Confirm Password"
          placeholder="Confirm your new password"
          value={confirm}
          onChange={setConfirm}
          error={submitted ? errors.confirm : ""}
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          label="Change Now"
          size="lg"
          loading={loading}
          disabled={password.length === 0 || confirm.length === 0}
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
};

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  error,
}: PasswordFieldProps) {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <View style={fieldStyles.field}>
      <AppText size={16} weight="bold">
        {label}
      </AppText>

      <AppInput
        variant="outlined"
        icon="lock"
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        secureTextEntry={!visible}
        autoCapitalize="none"
        textContentType="newPassword"
        autoComplete="new-password"
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

      {!!error && (
        <AppText size={12} weight="semibold" color="danger">
          {error}
        </AppText>
      )}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  field: {
    gap: 8,
  },
});

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
