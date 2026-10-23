import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "@/features/notifications/hooks";
import type { NotificationSettings } from "@/features/notifications/types";
import { AppText } from "@/shared/components/AppText";
import { ErrorState } from "@/shared/components/ErrorState";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { Skeleton } from "@/shared/components/Skeleton";
import { ToggleGroup, ToggleRow } from "@/shared/components/ToggleRow";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

const ROWS: { key: keyof NotificationSettings; label: string }[] = [
  { key: "payment", label: "Payment" },
  { key: "tracking", label: "Tracking" },
  { key: "completeOrder", label: "Complete Order" },
  { key: "general", label: "Notification" },
];

export default function NotificationSettingsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const {
    data: settings,
    isLoading,
    error,
    refetch,
  } = useNotificationSettings();
  const update = useUpdateNotificationSettings();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Notifications" />

      <View style={styles.content}>
        {isLoading ? (
          <Skeleton width="100%" height={230} radius={14} />
        ) : !settings ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : (
          <>
            <ToggleGroup>
              {ROWS.map((row) => (
                <ToggleRow
                  key={row.key}
                  label={row.label}
                  value={settings[row.key]}
                  onValueChange={(value) => update.mutate({ [row.key]: value })}
                />
              ))}
            </ToggleGroup>

            <AppText
              size={12}
              weight="medium"
              color="textSecondary"
              lineHeight={18}
            >
              These choose which order updates appear in your notification list.
              Push notifications to your phone are not enabled yet.
            </AppText>
          </>
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
