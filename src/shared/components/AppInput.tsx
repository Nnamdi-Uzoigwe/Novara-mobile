import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { fonts } from "@/core/theme/typography";
import Feather from "@expo/vector-icons/Feather";
import React, { useMemo, useState } from "react";
import {
    StyleProp,
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from "react-native";

type FeatherName = React.ComponentProps<typeof Feather>["name"];

export type AppInputProps = TextInputProps & {
  /** Icon on the left */
  icon?: FeatherName;
  /** Custom element on the right, such as a button */
  right?: React.ReactNode;
  error?: boolean;
  /** filled: grey background. outlined: transparent with a visible border */
  variant?: "filled" | "outlined";
  containerStyle?: StyleProp<ViewStyle>;
};

export function AppInput({
  icon,
  right,
  error = false,
  variant = "filled",
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: AppInputProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.danger
    : focused
      ? colors.primary
      : variant === "outlined"
        ? colors.borderStrong
        : "transparent";

  return (
    <View style={[styles.wrap, containerStyle]}>
      <TextInput
        placeholderTextColor={colors.textPlaceholder}
        autoCorrect={false}
        {...rest}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          variant === "outlined" ? styles.outlined : styles.filled,
          {
            borderColor,
            paddingLeft: icon ? 44 : 16,
            paddingRight: right ? 48 : 16,
          },
          style,
        ]}
      />

      {icon && (
        <Feather
          name={icon}
          size={20}
          color={focused ? colors.primary : colors.textPlaceholder}
          style={styles.left}
        />
      )}

      {right && <View style={styles.right}>{right}</View>}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrap: {
      justifyContent: "center",
    },
    input: {
      height: 52,
      borderRadius: 12,
      borderWidth: 1.5,
      color: c.textPrimary,
      fontFamily: fonts.medium,
      fontSize: 15,
    },
    filled: {
      backgroundColor: c.surfaceMuted,
    },
    outlined: {
      backgroundColor: "transparent",
    },
    left: {
      position: "absolute",
      left: 14,
    },
    right: {
      position: "absolute",
      right: 12,
    },
  });
