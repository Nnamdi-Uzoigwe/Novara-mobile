import { useTheme } from "@/core/theme/ThemeProvider";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { View } from "react-native";

type AvatarProps = {
  uri?: string;
  size?: number;
};

export function Avatar({ uri, size = 44 }: AvatarProps) {
  const { colors } = useTheme();
  const base = { height: size, width: size, borderRadius: size / 2 };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={base}
        contentFit="cover"
        transition={200}
      />
    );
  }

  return (
    <View
      style={[
        base,
        {
          backgroundColor: colors.primary + "22",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <Feather name="user" size={size * 0.45} color={colors.primary} />
    </View>
  );
}
