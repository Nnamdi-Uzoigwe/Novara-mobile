import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppText } from "@/shared/components/AppText";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { ToggleGroup, ToggleRow } from "@/shared/components/ToggleRow";
import { useSettingsStore } from "@/store/settingsStore";
import * as Haptics from "expo-haptics";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useMemo, useState } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";

type Support = {
  enrolled: boolean;
  face: boolean;
  touch: boolean;
};

const IGNORED_ERRORS = ["user_cancel", "system_cancel", "app_cancel"];

export default function SecurityScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const security = useSettingsStore((s) => s.security);
  const setSecurity = useSettingsStore((s) => s.setSecurity);

  const [support, setSupport] = useState<Support | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const hardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = hardware
        ? await LocalAuthentication.isEnrolledAsync()
        : false;
      const types = hardware
        ? await LocalAuthentication.supportedAuthenticationTypesAsync()
        : [];

      if (!active) return;
      setSupport({
        enrolled,
        face: types.includes(
          LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
        ),
        touch: types.includes(
          LocalAuthentication.AuthenticationType.FINGERPRINT,
        ),
      });
    })();

    return () => {
      active = false;
    };
  }, []);

  const isIOS = Platform.OS === "ios";
  const faceLabel = isIOS ? "Face ID" : "Face Unlock";
  const touchLabel = isIOS ? "Touch ID" : "Fingerprint";

  const toggleBiometric = async (key: "faceId" | "touchId", next: boolean) => {
    if (!next) {
      setSecurity(key, false);
      return;
    }

    if (!support?.enrolled) {
      Alert.alert(
        "Set up biometrics first",
        "Add a face or fingerprint in your phone's settings, then try again.",
      );
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Confirm it's you to turn this on",
      cancelLabel: "Cancel",
    });

    if (result.success) {
      setSecurity(key, true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (!IGNORED_ERRORS.includes(result.error)) {
      Alert.alert(
        "Couldn't verify",
        "The biometric check didn't work. Please try again.",
      );
    }
  };

  const noBiometrics = support !== null && !support.face && !support.touch;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Security" />

      <View style={styles.content}>
        <ToggleGroup>
          {support?.face ? (
            <ToggleRow
              label={faceLabel}
              value={security.faceId}
              onValueChange={(v) => toggleBiometric("faceId", v)}
            />
          ) : null}

          <ToggleRow
            label="Remember Password"
            value={security.rememberLogin}
            onValueChange={(v) => setSecurity("rememberLogin", v)}
          />

          {support?.touch ? (
            <ToggleRow
              label={touchLabel}
              value={security.touchId}
              onValueChange={(v) => toggleBiometric("touchId", v)}
            />
          ) : null}
        </ToggleGroup>

        <AppText
          size={12}
          weight="medium"
          color="textSecondary"
          lineHeight={18}
        >
          Remember Password keeps you signed in on this device. Your password is
          never saved on your phone.
        </AppText>

        {noBiometrics && (
          <AppText
            size={12}
            weight="medium"
            color="textSecondary"
            lineHeight={18}
          >
            Biometric unlock isn't available on this device.
          </AppText>
        )}
      </View>
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
      paddingTop: 12,
      gap: 14,
    },
  });
