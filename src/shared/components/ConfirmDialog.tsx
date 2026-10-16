import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import Feather from "@expo/vector-icons/Feather";
import { useMemo } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  cancelLabel?: string;
  confirmLabel: string;
  /** Shows the confirm action in red */
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  cancelLabel = "Cancel",
  confirmLabel,
  destructive = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onCancel}
          accessibilityLabel="Close dialog"
        />

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.close}
            onPress={onCancel}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Feather name="x" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.text}>
            <AppText size={18} weight="bold" align="center">
              {title}
            </AppText>
            {!!message && (
              <AppText
                size={14}
                weight="medium"
                color="textSecondary"
                align="center"
                lineHeight={21}
              >
                {message}
              </AppText>
            )}
          </View>

          <Button label={cancelLabel} onPress={onCancel} />

          <TouchableOpacity
            style={styles.confirm}
            onPress={onConfirm}
            hitSlop={8}
            accessibilityRole="button"
          >
            <AppText
              size={15}
              weight="bold"
              color={destructive ? "danger" : "primary"}
            >
              {confirmLabel}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    card: {
      width: "100%",
      maxWidth: 380,
      borderRadius: 20,
      backgroundColor: c.surface,
      paddingHorizontal: 24,
      paddingTop: 52,
      paddingBottom: 24,
      gap: 18,
    },
    close: {
      position: "absolute",
      top: 16,
      right: 16,
    },
    text: {
      gap: 8,
    },
    confirm: {
      alignItems: "center",
      paddingVertical: 4,
    },
  });
