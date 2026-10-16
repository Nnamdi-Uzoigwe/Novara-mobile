import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { ToggleGroup, ToggleRow } from "@/shared/components/ToggleRow";
import { useSettingsStore } from "@/store/settingsStore";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function NotificationSettingsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const prefs = useSettingsStore((s) => s.notifications);
  const setNotification = useSettingsStore((s) => s.setNotification);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Notifications" />

      <View style={styles.content}>
        <ToggleGroup>
          <ToggleRow
            label="Payment"
            value={prefs.payment}
            onValueChange={(v) => setNotification("payment", v)}
          />
          <ToggleRow
            label="Tracking"
            value={prefs.tracking}
            onValueChange={(v) => setNotification("tracking", v)}
          />
          <ToggleRow
            label="Complete Order"
            value={prefs.completeOrder}
            onValueChange={(v) => setNotification("completeOrder", v)}
          />
          <ToggleRow
            label="Notification"
            value={prefs.general}
            onValueChange={(v) => setNotification("general", v)}
          />
        </ToggleGroup>
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
    },
  });
