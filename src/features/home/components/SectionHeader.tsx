import { AppText } from "@/shared/components/AppText";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type SectionHeaderProps = {
  title: string;
  emoji?: string;
  onSeeAll?: () => void;
};

export function SectionHeader({ title, emoji, onSeeAll }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <AppText size={20} weight="bold">
        {emoji ? `${title} ${emoji}` : title}
      </AppText>

      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} hitSlop={10}>
          <AppText size={13} weight="bold" color="primary">
            See All
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 16,
  },
});
