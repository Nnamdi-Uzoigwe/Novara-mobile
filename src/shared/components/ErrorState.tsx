import { ApiClientError, errorMessage } from "@/core/api/ApiClientError";
import { useTheme } from "@/core/theme/ThemeProvider";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, View } from "react-native";

type ErrorStateProps = {
  error?: unknown;
  /** Replaces the text taken from the error */
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({ error, message, onRetry }: ErrorStateProps) {
  const { colors } = useTheme();
  const offline = error instanceof ApiClientError && error.isNetwork;

  return (
    <View style={styles.container}>
      <View
        style={[styles.iconWrap, { backgroundColor: colors.primary + "1F" }]}
      >
        <Feather
          name={offline ? "wifi-off" : "alert-circle"}
          size={34}
          color={colors.primary}
        />
      </View>

      <AppText size={18} weight="bold" align="center">
        {offline ? "No connection" : "Something went wrong"}
      </AppText>
      <AppText size={14} weight="medium" color="textSecondary" align="center">
        {message ?? errorMessage(error)}
      </AppText>

      <View style={styles.center}>
        {onRetry && (
          <Button label="Try again" fullWidth={false} onPress={onRetry} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  iconWrap: {
    height: 80,
    width: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  center: {
    justifyContent: "center",
  },
});
