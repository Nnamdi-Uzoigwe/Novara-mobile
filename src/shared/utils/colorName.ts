const NAMES: Record<string, string> = {
  "#A65D57": "Brown",
  "#111111": "Black",
  "#2AA9BF": "Teal",
  "#1ED760": "Green",
  "#E8E2D0": "Cream",
  "#2E4057": "Navy",
  "#7A9E7E": "Sage",
  "#3B5B8C": "Denim Blue",
  "#FFFFFF": "White",
  "#C0392B": "Red",
  "#E8D5C4": "Beige",
};

// TODO: when your API returns color names, store them on the product and delete this
export const colorName = (hex: string) =>
  NAMES[hex.toUpperCase()] ?? hex.toUpperCase();
