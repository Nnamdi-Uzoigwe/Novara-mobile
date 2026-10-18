import { errorMessage, fieldErrorsFrom } from "@/core/api/ApiClientError";
import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { accountApi } from "@/features/account/api";
import { AppInput } from "@/shared/components/AppInput";
import { AppText } from "@/shared/components/AppText";
import { Avatar } from "@/shared/components/Avatar";
import { Button } from "@/shared/components/Button";
import { FormField } from "@/shared/components/FormField";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { toStoreUser } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GOOGLE_BLUE = "#4285F4";

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  const [name, setName] = useState(user?.name ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const nameError = name.trim().length >= 2 ? "" : "Enter your name";
  const dirty = name.trim() !== (user?.name ?? "");

  const handleSave = async () => {
    setSubmitted(true);
    setServerError("");
    setFormError("");

    if (nameError || loading) return;

    setLoading(true);
    try {
      const result = await accountApi.updateMe({ name: name.trim() });
      setUser(toStoreUser(result.user));

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err) {
      const fields = fieldErrorsFrom(err);
      if (fields.name) setServerError(fields.name);
      else setFormError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScreenHeader title="Edit Profile" />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {/* TODO: photo upload comes with the image storage step */}
        <View style={styles.avatarWrap}>
          <Avatar uri={user?.avatarUri} size={116} />
        </View>

        <FormField
          label="Username"
          error={(submitted ? nameError : "") || serverError}
        >
          <AppInput
            variant="outlined"
            icon="user"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            textContentType="name"
            autoComplete="name"
            error={(submitted && !!nameError) || !!serverError}
          />
        </FormField>

        <FormField label="Email or Phone Number">
          <AppInput
            variant="outlined"
            icon="mail"
            value={user?.email ?? ""}
            editable={false}
            style={styles.readOnly}
          />
        </FormField>

        {user?.provider === "google" && (
          <FormField label="Account Linked With">
            <View style={styles.linkedRow}>
              <Ionicons name="logo-google" size={20} color={GOOGLE_BLUE} />
              <AppText size={14} weight="semibold" style={styles.flex}>
                Google
              </AppText>
              <Feather name="link" size={18} color={colors.textPlaceholder} />
            </View>
          </FormField>
        )}

        {!!formError && (
          <AppText size={13} weight="semibold" color="danger" align="center">
            {formError}
          </AppText>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          label="Save Changes"
          size="lg"
          loading={loading}
          disabled={!dirty}
          onPress={handleSave}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    flex: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 24,
      gap: 22,
    },
    avatarWrap: {
      alignSelf: "center",
      marginBottom: 6,
    },
    readOnly: {
      opacity: 0.6,
    },
    linkedRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      height: 52,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: c.borderStrong,
    },
    footer: {
      paddingHorizontal: 20,
      paddingTop: 12,
    },
  });
