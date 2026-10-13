import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { fonts } from "@/core/theme/typography";
import { StyleSheet, Text, TextProps } from "react-native";

export type FontWeight = keyof typeof fonts;

export type AppTextProps = TextProps & {
  /** A theme color key (e.g. 'textSecondary') or any raw color string */
  color?: keyof ThemeColors | (string & {});
  weight?: FontWeight;
  size?: number;
  /** Optional line height. Defaults to size * 1.4 */
  lineHeight?: number;
  align?: "auto" | "left" | "right" | "center" | "justify";
};

export function AppText({
  color = "textPrimary",
  weight = "regular",
  size = 14,
  lineHeight,
  align,
  style,
  children,
  ...rest
}: AppTextProps) {
  const { colors } = useTheme();

  const resolvedColor =
    color in colors ? colors[color as keyof ThemeColors] : color;

  return (
    <Text
      {...rest}
      style={[
        styles.base,
        {
          color: resolvedColor,
          fontFamily: fonts[weight],
          fontSize: size,
          lineHeight: lineHeight ?? Math.round(size * 1.4),
          textAlign: align,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
