import { ThemeColors } from "@/core/theme/colors";
import { useTheme } from "@/core/theme/ThemeProvider";
import { AppText } from "@/shared/components/AppText";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function HomeTabs() {
  const [activeTab, setActiveTab] = useState("Home");
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setActiveTab("Home")}
        style={[styles.tab, activeTab === "Home" && styles.activeTab]}
      >
        <AppText
          weight="bold"
          size={18}
          color={activeTab === "Home" ? "textPrimary" : "textSecondary"}
        >
          Home
        </AppText>
      </Pressable>

      <Pressable
        onPress={() => setActiveTab("Category")}
        style={[styles.tab, activeTab === "Category" && styles.activeTab]}
      >
        <AppText
          weight="bold"
          size={18}
          color={activeTab === "Category" ? "textPrimary" : "textSecondary"}
        >
          Category
        </AppText>
      </Pressable>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginTop: 40,
      flexDirection: "row",
      justifyContent: "space-evenly",
      gap: 50,
    },
    tab: {
      borderBottomColor: "#fff",
      borderBottomWidth: 2.2,
      padding: 10,
    },
    activeTab: {
      borderBottomColor: "#5B4BB8",
    },
  });
