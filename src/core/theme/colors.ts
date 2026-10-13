export type ThemeMode = "light" | "dark";

export type ThemeColors = {
  primary: string;
  onPrimary: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  textPlaceholder: string;
  border: string;
  borderStrong: string;
  handle: string;
  danger: string;
  success: string;
  shadow: string;
};

export const lightColors: ThemeColors = {
  primary: "#5B4BB8",
  onPrimary: "#FFFFFF",
  background: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceMuted: "#F3F3F5",
  textPrimary: "#16161D",
  textSecondary: "#8B8B95",
  textPlaceholder: "#A5A5AD",
  border: "#E6E6EA",
  borderStrong: "#CFCFD6",
  handle: "#D6D6DB",
  danger: "#E5484D",
  success: "#2FA66A",
  shadow: "#000000",
};

export const darkColors: ThemeColors = {
  primary: "#7A6BD6",
  onPrimary: "#FFFFFF",
  background: "#0F0F14",
  surface: "#1A1A22",
  surfaceMuted: "#24242E",
  textPrimary: "#F5F5F7",
  textSecondary: "#9A9AA5",
  textPlaceholder: "#6E6E7A",
  border: "#2E2E3A",
  borderStrong: "#4A4A58",
  handle: "#4A4A58",
  danger: "#F2686C",
  success: "#4CC38A",
  shadow: "#000000",
};

export const themes: Record<ThemeMode, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};
