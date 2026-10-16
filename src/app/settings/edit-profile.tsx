import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppInput } from "@/shared/components/AppInput";
import { AppText } from "@/shared/components/AppText";
import { Avatar } from "@/shared/components/Avatar";
import { Button } from "@/shared/components/Button";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { useUserStore } from "@/store/userStore";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GOOGLE_BLUE = "#4285F4";

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const user = useUserStore((s) => s.user);
  const updateProfile = useUserStore((s) => s.updateProfile);

  const [name, setName] = useState(user?.name ?? "");
  const [avatar, setAvatar] = useState(user?.avatarUri);
  const [submitted, setSubmitted] = useState(false);

  const nameError = name.trim().length >= 2 ? "" : "Enter your name";
  const dirty =
    name.trim() !== (user?.name ?? "") || avatar !== user?.avatarUri;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

  const handleSave = () => {
    setSubmitted(true);
    if (nameError) return;

    // TODO: upload the photo and send the new name to your API
    updateProfile({ name: name.trim(), avatarUri: avatar });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
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
        {/* Photo */}
        <View style={styles.avatarWrap}>
          <Avatar uri={avatar} size={116} />
          <TouchableOpacity
            style={styles.cameraBtn}
            onPress={pickImage}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Change photo"
          >
            <Feather name="camera" size={16} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <AppText size={16} weight="bold">
            Username
          </AppText>
          <AppInput
            variant="outlined"
            icon="user"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            textContentType="name"
            autoComplete="name"
            error={submitted && !!nameError}
          />
          {submitted && !!nameError && (
            <AppText size={12} weight="semibold" color="danger">
              {nameError}
            </AppText>
          )}
        </View>

        <View style={styles.field}>
          <AppText size={16} weight="bold">
            Email or Phone Number
          </AppText>
          <AppInput
            variant="outlined"
            icon="mail"
            value={user?.email ?? ""}
            editable={false}
            style={styles.readOnly}
          />
        </View>

        {user?.provider === "google" && (
          <View style={styles.field}>
            <AppText size={16} weight="bold">
              Account Linked With
            </AppText>
            <View style={styles.linkedRow}>
              <Ionicons name="logo-google" size={20} color={GOOGLE_BLUE} />
              <AppText size={14} weight="semibold" style={styles.flex}>
                Google
              </AppText>
              <Feather name="link" size={18} color={colors.textPlaceholder} />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          label="Save Changes"
          size="lg"
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
    cameraBtn: {
      position: "absolute",
      right: 0,
      bottom: 4,
      height: 34,
      width: 34,
      borderRadius: 17,
      backgroundColor: c.primary,
      borderWidth: 3,
      borderColor: c.background,
      alignItems: "center",
      justifyContent: "center",
    },
    field: {
      gap: 8,
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
