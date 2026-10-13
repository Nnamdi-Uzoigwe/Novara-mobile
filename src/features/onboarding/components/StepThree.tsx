import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { DotNavigation } from "@/shared/components/DotNavigation";
import { FadeInView } from "@/shared/components/FadeInView";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export const StepThree = () => {
  return (
    <View style={styles.container}>
      <FadeInView duration={700} distance={0} scaleFrom={0.92}>
        <Image
          style={styles.img}
          source={require("@/assets/images/intro-three-img.jpg")}
        />
      </FadeInView>

      <FadeInView delay={200}>
        <AppText size={30} weight="bold" align="center">
          Find The Most Suitable Outfit For You
        </AppText>
      </FadeInView>

      <FadeInView delay={320}>
        <View style={styles.center}>
          <AppText
            size={16}
            weight="medium"
            color="textSecondary"
            align="center"
          >
            Discover outfits that match your unique style and find the perfect
            look for every occasion.
          </AppText>
        </View>
      </FadeInView>

      <FadeInView delay={440}>
        <DotNavigation count={3} activeIndex={2} />
      </FadeInView>

      <FadeInView delay={560}>
        <Button label="Create Account" />
      </FadeInView>

      <FadeInView delay={680}>
        <TouchableOpacity style={styles.center}>
          <AppText color="primary" weight="semibold" size={18}>
            Already Have an Account
          </AppText>
        </TouchableOpacity>
      </FadeInView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  img: {
    height: 400,
    width: "100%",
    borderRadius: 40,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});
