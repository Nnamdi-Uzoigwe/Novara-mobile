import { AppText } from "@/shared/components/AppText";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

export default function GoogleSignIn() {
  return (
    <TouchableOpacity style={styles.button}>
      <Image
        source={require("@/assets/images/google.png")}
        style={styles.image}
      />
      <AppText weight="bold" size={17} color="textSecondary">
        Sign Up with Google
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#b0afaf",
    paddingHorizontal: 24,
    height: 56,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  image: {
    height: 24,
    width: 24,
  },
});
