// import { AppText } from "@/shared/components/AppText";
// import { Button } from "@/shared/components/Button";
// import { DotNavigation } from "@/shared/components/DotNavigation";
// import { useRouter, useTheme } from "expo-router";
// import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

// const AUTO_NEXT_MS = 2000;

// export const StepTwo = () => {
//   const router = useRouter();
//   const { colors } = useTheme();

//   return (
//     <View style={styles.container}>
//       <Image
//         style={styles.img}
//         source={require("@/assets/images/intro-two-img.jpg")}
//       />

//       <AppText size={30} weight="bold" align="center">
//         Complete Collection Of Colors And Sizes
//       </AppText>

//       <View style={styles.center}>
//         <AppText size={16} weight="medium" color="textSecondary" align="center">
//           Choose from a wide range of colors and sizes to find the perfect fit
//           for your style and preferences.
//         </AppText>
//       </View>

//       <DotNavigation count={3} activeIndex={1} />

//       <Button label="Create Account" />

//       <TouchableOpacity style={styles.center}>
//         <AppText color="primary" weight="semibold" size={18}>
//           Already Have an Account
//         </AppText>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     gap: 20,
//   },
//   img: {
//     height: 400,
//     width: "100%",
//     borderRadius: 40,
//   },
//   center: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { DotNavigation } from "@/shared/components/DotNavigation";
import { FadeInView } from "@/shared/components/FadeInView";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export const StepTwo = () => {
  return (
    <View style={styles.container}>
      <FadeInView duration={700} distance={0} scaleFrom={0.92}>
        <Image
          style={styles.img}
          source={require("@/assets/images/intro-two-img.jpg")}
        />
      </FadeInView>

      <FadeInView delay={200}>
        <AppText size={30} weight="bold" align="center">
          Complete Collection Of Colors And Sizes
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
            Choose from a wide range of colors and sizes to find the perfect fit
            for your style and preferences.
          </AppText>
        </View>
      </FadeInView>

      <FadeInView delay={440}>
        <DotNavigation count={3} activeIndex={1} />
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
