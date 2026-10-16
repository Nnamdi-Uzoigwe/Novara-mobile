import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppText } from "@/shared/components/AppText";
import { useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

export type OtpInputProps = {
  /** Number of digits. Defaults to 5 */
  length?: number;
  value: string;
  onChange: (value: string) => void;
  /** Called once when all digits are filled */
  onComplete?: (value: string) => void;
  /** Turns the borders red, e.g. after a wrong code */
  error?: boolean;
  autoFocus?: boolean;
};

export function OtpInput({
  length = 5,
  value,
  onChange,
  onComplete,
  error = false,
  autoFocus = true,
}: OtpInputProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, length);
    onChange(digits);
    if (digits.length === length) onComplete?.(digits);
  };

  return (
    <Pressable
      style={styles.row}
      onPress={() => inputRef.current?.focus()}
      accessibilityLabel={`Enter ${length} digit code`}
    >
      {Array.from({ length }).map((_, index) => {
        const char = value[index] ?? "";
        const isActive =
          focused &&
          (index === value.length ||
            (index === length - 1 && value.length === length));

        const borderColor = error
          ? colors.danger
          : isActive
            ? colors.primary
            : colors.border;

        return (
          <View key={index} style={[styles.box, { borderColor }]}>
            <AppText weight="bold" size={24} align="center">
              {char}
            </AppText>
          </View>
        );
      })}

      {/* One hidden input handles typing, backspace, paste and SMS autofill */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        caretHidden
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        style={styles.hiddenInput}
      />
    </Pressable>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
    },
    box: {
      flex: 1,
      aspectRatio: 1,
      maxWidth: 64,
      borderRadius: 14,
      borderWidth: 1.5,
      backgroundColor: c.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    hiddenInput: {
      ...StyleSheet.absoluteFill,
      opacity: 0,
    },
  });
