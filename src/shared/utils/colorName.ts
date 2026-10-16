const NAMES: Record<string, string> = {
  "#A65D57": "Brown",
  "#111111": "Black",
  "#2AA9BF": "Teal",
  "#1ED760": "Green",
};

// TODO: when your API returns color names, store them on the product and delete this
export const colorName = (hex: string) =>
  NAMES[hex.toUpperCase()] ?? hex.toUpperCase();
