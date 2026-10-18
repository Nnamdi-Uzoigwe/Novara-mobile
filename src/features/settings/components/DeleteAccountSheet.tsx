import { ApiClientError, errorMessage } from "@/core/api/ApiClientError";
import { accountApi } from "@/features/account/api";
import { AppInput } from "@/shared/components/AppInput";
import { AppText } from "@/shared/components/AppText";
import { BottomSheet } from "@/shared/components/BottomSheet";
import { Button } from "@/shared/components/Button";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

type DeleteAccountSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** Called after the account was deleted and the local session was cleared */
  onDeleted: () => void;
};

export function DeleteAccountSheet({
  visible,
  onClose,
  onDeleted,
}: DeleteAccountSheetProps) {
  const provider = useUserStore((s) => s.user?.provider);
  const endSession = useAuthStore((s) => s.endSession);

  // Google accounts have no password. TODO: ask for a fresh Google sign-in instead
  const needsPassword = provider !== "google";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setPassword("");
    setError("");
    setLoading(false);
  }, [visible]);

  const handleDelete = async () => {
    if (loading) return;
    if (needsPassword && password.length === 0) {
      setError("Enter your password to confirm.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await accountApi.deleteMe(needsPassword ? password : undefined);
      await endSession();
      onDeleted();
    } catch (err) {
      setError(
        err instanceof ApiClientError && err.code === "WRONG_PASSWORD"
          ? "That password is incorrect."
          : errorMessage(err),
      );
      setLoading(false);
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      dismissOnBackdrop={!loading}
    >
      <View style={styles.content}>
        <View style={styles.text}>
          <AppText size={20} weight="bold" align="center">
            Delete your account?
          </AppText>
          <AppText
            size={14}
            weight="medium"
            color="textSecondary"
            align="center"
            lineHeight={21}
          >
            This permanently removes your profile and saved data. This cannot be
            undone.
          </AppText>
        </View>

        {needsPassword && (
          <AppInput
            variant="outlined"
            icon="lock"
            placeholder="Enter your password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setError("");
            }}
            secureTextEntry
            autoCapitalize="none"
            error={!!error}
          />
        )}

        {!!error && (
          <AppText size={13} weight="semibold" color="danger" align="center">
            {error}
          </AppText>
        )}

        <View style={styles.buttons}>
          <Button
            label="Cancel"
            variant="outline"
            fullWidth={false}
            style={styles.flex}
            disabled={loading}
            onPress={onClose}
          />
          <Button
            label="Delete"
            variant="danger"
            fullWidth={false}
            style={styles.flex}
            loading={loading}
            onPress={handleDelete}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
  },
  text: {
    gap: 8,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
  },
  flex: {
    flex: 1,
  },
});
