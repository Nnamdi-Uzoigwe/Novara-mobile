import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import type { Seller } from "@/features/home/types";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

const VERIFIED_BLUE = "#1D9BF0";

type SellerRowProps = {
  seller: Seller;
  following: boolean;
  onToggleFollow: () => void;
};

export function SellerRow({
  seller,
  following,
  onToggleFollow,
}: SellerRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      {seller.avatar ? (
        <Image
          source={seller.avatar}
          style={styles.avatar}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Feather name="box" size={20} color={colors.primary} />
        </View>
      )}

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <AppText size={14} weight="bold" numberOfLines={1}>
            {seller.name}
          </AppText>
          {seller.verified && (
            <Ionicons name="checkmark-circle" size={15} color={VERIFIED_BLUE} />
          )}
        </View>

        <View style={styles.statsRow}>
          <AppText size={11} weight="medium" color="textSecondary">
            {`${seller.productCount} Products`}
          </AppText>
          <AppText size={11} weight="medium" color="textSecondary">
            {`${seller.followers} Followers`}
          </AppText>
        </View>
      </View>

      <Button
        label={following ? "Following" : "Follow"}
        variant={following ? "outline" : "primary"}
        size="sm"
        fullWidth={false}
        onPress={onToggleFollow}
      />
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
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
    info: {
      flex: 1,
      gap: 3,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    statsRow: {
      flexDirection: "row",
      gap: 10,
    },
  });
