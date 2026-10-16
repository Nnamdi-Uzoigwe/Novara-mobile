import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppText } from "@/shared/components/AppText";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";
export type IconPosition = "before" | "after";

/** Pass a node, or a function that receives the label color so the icon always matches */
export type ButtonIcon = React.ReactNode | ((color: string) => React.ReactNode);

export type ButtonProps = Omit<PressableProps, "style" | "children"> & {
  label: React.ReactNode;
  onPress?: () => void;
  icon?: ButtonIcon;
  iconPosition?: IconPosition;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  /** Stretch to the full width of the parent. Defaults to true */
  fullWidth?: boolean;
  /** Corner radius. Defaults to a pill shape */
  radius?: number;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

const SIZES: Record<
  ButtonSize,
  { height: number; paddingHorizontal: number; fontSize: number; gap: number }
> = {
  sm: { height: 36, paddingHorizontal: 16, fontSize: 13, gap: 6 },
  md: { height: 48, paddingHorizontal: 20, fontSize: 15, gap: 8 },
  lg: { height: 56, paddingHorizontal: 24, fontSize: 16, gap: 10 },
};

function getVariantColors(variant: ButtonVariant, c: ThemeColors) {
  switch (variant) {
    case "secondary":
      return {
        background: c.surfaceMuted,
        foreground: c.textPrimary,
        border: "transparent",
      };
    case "outline":
      return {
        background: "transparent",
        foreground: c.primary,
        border: c.primary,
      };
    case "ghost":
      return {
        background: "transparent",
        foreground: c.primary,
        border: "transparent",
      };
    case "danger":
      return {
        background: c.danger,
        foreground: c.onPrimary,
        border: "transparent",
      };
    case "primary":
    default:
      return {
        background: c.primary,
        foreground: c.onPrimary,
        border: "transparent",
      };
  }
}

export function Button({
  label,
  onPress,
  icon,
  iconPosition = "before",
  variant = "primary",
  size = "lg",
  loading = false,
  disabled = false,
  fullWidth = true,
  radius = 999,
  style,
  labelStyle,
  accessibilityLabel,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme();
  const sizeConfig = SIZES[size];
  const { background, foreground, border } = getVariantColors(variant, colors);
  const isDisabled = disabled || loading;

  const renderedIcon = typeof icon === "function" ? icon(foreground) : icon;

  const iconNode = loading ? (
    <ActivityIndicator size="small" color={foreground} />
  ) : renderedIcon ? (
    <View>{renderedIcon}</View>
  ) : null;

  return (
    <Pressable
      {...rest}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      // accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          height: sizeConfig.height,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          gap: sizeConfig.gap,
          borderRadius: radius,
          backgroundColor: background,
          borderColor: border,
          borderWidth: variant === "outline" ? 1.5 : 0,
          alignSelf: fullWidth ? "stretch" : "flex-start",
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {iconPosition === "before" && iconNode}
      <AppText
        color={foreground}
        weight="bold"
        size={sizeConfig.fontSize}
        numberOfLines={1}
        style={labelStyle}
      >
        {label}
      </AppText>
      {iconPosition === "after" && iconNode}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
