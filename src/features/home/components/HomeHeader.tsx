import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppText } from "@/shared/components/AppText";
import Feather from "@expo/vector-icons/Feather";
import { Image, type ImageSource } from "expo-image";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type HomeHeaderProps = {
  name?: string;
  avatar?: ImageSource;
  hasUnread?: boolean;
  onSearchPress?: () => void;
  onBellPress?: () => void;
};

export function HomeHeader({
  name,
  avatar,
  hasUnread = false,
  onSearchPress,
  onBellPress,
}: HomeHeaderProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      {avatar ? (
        <Image source={avatar} style={styles.avatar} contentFit="cover" />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Feather name="user" size={22} color={colors.primary} />
        </View>
      )}

      <View style={styles.textBlock}>
        <AppText weight="bold" size={16}>
          {`Hi, ${name ?? "there"}`}
        </AppText>
        <AppText weight="medium" size={12} color="textSecondary">
          Let's go shopping
        </AppText>
      </View>

      <TouchableOpacity
        onPress={onSearchPress}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Search"
      >
        <Feather name="search" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onBellPress}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Notifications"
      >
        <Feather name="bell" size={24} color={colors.textPrimary} />
        {hasUnread && <View style={styles.dot} />}
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    avatar: {
      height: 44,
      width: 44,
      borderRadius: 22,
    },
    avatarFallback: {
      backgroundColor: c.primary + "22",
      alignItems: "center",
      justifyContent: "center",
    },
    textBlock: {
      flex: 1,
      gap: 2,
    },
    dot: {
      position: "absolute",
      top: 0,
      right: 1,
      height: 9,
      width: 9,
      borderRadius: 5,
      backgroundColor: c.danger,
      borderWidth: 1.5,
      borderColor: c.background,
    },
  });
