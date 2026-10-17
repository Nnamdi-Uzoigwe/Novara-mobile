import { LOGIN_ROUTE } from "@/core/routes";
import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { LanguageSheet } from "@/features/settings/components/LanguageSheet";
import { AppText } from "@/shared/components/AppText";
import { Avatar } from "@/shared/components/Avatar";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { SettingsRow } from "@/shared/components/SettingsRow";
import { clearAccountData } from "@/store/session";
import { useUserStore } from "@/store/userStore";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

type DialogKind = "logout" | "delete" | null;

export default function ProfileScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const user = useUserStore((s) => s.user);
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [languageOpen, setLanguageOpen] = useState(false);

  const leave = () => {
    setDialog(null);
    clearAccountData();
    router.replace(LOGIN_ROUTE);
  };

  const handleDeleteAccount = () => {
    // TODO: call your API to delete the account, and only continue if it succeeds
    leave();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="My Profile" showBack={false} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <Pressable
          style={({ pressed }) => [
            styles.profileCard,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => router.push("/settings/edit-profile")}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
        >
          <Avatar uri={user?.avatarUri} size={64} />
          <View style={styles.profileText}>
            <AppText size={18} weight="bold" numberOfLines={1}>
              {user?.name ?? "Guest"}
            </AppText>
            <AppText
              size={13}
              weight="medium"
              color="textSecondary"
              numberOfLines={1}
            >
              {user?.email ?? "Not signed in"}
            </AppText>
          </View>
          <Feather
            name="chevron-right"
            size={20}
            color={colors.textPlaceholder}
          />
        </Pressable>

        {/* General */}
        <View style={styles.section}>
          <AppText size={16} weight="bold">
            General
          </AppText>

          <SettingsRow
            icon="user"
            title="Edit Profile"
            onPress={() => router.push("/settings/edit-profile")}
          />
          <SettingsRow
            icon="lock"
            title="Change Password"
            onPress={() => router.push("/settings/change-password")}
          />
          <SettingsRow
            icon="bell"
            title="Notifications"
            onPress={() => router.push("/notifications/settings")}
          />
          <SettingsRow
            icon="shield"
            title="Security"
            onPress={() => router.push("/settings/security")}
          />
          <SettingsRow
            icon="globe"
            title="Language"
            value="English"
            onPress={() => setLanguageOpen(true)}
          />
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <AppText size={16} weight="bold">
            Preferences
          </AppText>

          <SettingsRow
            icon="file-text"
            title="Legal and Policies"
            onPress={() => router.push("/settings/legal")}
          />
          <SettingsRow
            icon="help-circle"
            title="Help & Support"
            onPress={() => router.push("/settings/help-support")}
          />
          <SettingsRow
            icon="trash-2"
            title="Delete Account"
            tone="danger"
            showChevron={false}
            onPress={() => setDialog("delete")}
          />
          <SettingsRow
            icon="log-out"
            title="Logout"
            tone="danger"
            showChevron={false}
            onPress={() => setDialog("logout")}
          />
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={dialog === "logout"}
        title="Are you sure you want to logout?"
        confirmLabel="Log Out"
        destructive
        onCancel={() => setDialog(null)}
        onConfirm={leave}
      />

      <ConfirmDialog
        visible={dialog === "delete"}
        title="Delete your account?"
        message="This permanently removes your profile, orders and saved data. This cannot be undone."
        confirmLabel="Delete Account"
        destructive
        onCancel={() => setDialog(null)}
        onConfirm={handleDeleteAccount}
      />
      <LanguageSheet
        visible={languageOpen}
        onClose={() => setLanguageOpen(false)}
      />
    </View>
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
      paddingTop: 8,
      paddingBottom: 24,
      gap: 24,
    },
    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 16,
      borderRadius: 16,
      backgroundColor: c.surfaceMuted,
    },
    profileText: {
      flex: 1,
      gap: 3,
    },
    section: {
      gap: 12,
    },
  });
