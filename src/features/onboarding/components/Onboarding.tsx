// import { AppText } from "@/shared/components/AppText";
// import { Button } from "@/shared/components/Button";
// import { DotNavigation } from "@/shared/components/DotNavigation";
// import { FadeInView } from "@/shared/components/FadeInView";
// import { useEffect, useState } from "react";
// import {
//     Image,
//     ImageSourcePropType,
//     StyleSheet,
//     TouchableOpacity,
//     View,
// } from "react-native";

// type Slide = {
//   id: string;
//   image: ImageSourcePropType;
//   title: string;
//   description: string;
// };

// const SLIDES: Slide[] = [
//   {
//     id: "collections",
//     image: require("@/assets/images/intro-one-img.jpg"),
//     title: "Various Collections Of The Latest Products",
//     description:
//       "Explore our latest collections, discover trending styles, and find the perfect products to match your taste.",
//   },
//   {
//     id: "colors-sizes",
//     image: require("@/assets/images/intro-two-img.jpg"),
//     title: "Complete Collection Of Colors And Sizes",
//     description:
//       "Choose from a wide range of colors and sizes to find the perfect fit for your style and preferences.",
//   },
//   {
//     id: "outfit",
//     image: require("@/assets/images/intro-three-img.jpg"),
//     title: "Find The Most Suitable Outfit For You",
//     description:
//       "Discover outfits that match your unique style and find the perfect look for every occasion.",
//   },
// ];

// const AUTO_NEXT_MS = 2000;

// type OnboardingProps = {
//   onCreateAccount?: () => void;
//   onLogin?: () => void;
// };

// export const Onboarding = ({ onCreateAccount, onLogin }: OnboardingProps) => {
//   const [index, setIndex] = useState(0);
//   const slide = SLIDES[index];

//   // Auto-advance. Restarts whenever the slide changes (including dot taps)
//   useEffect(() => {
//     if (index >= SLIDES.length - 1) return;

//     const timer = setTimeout(() => setIndex((i) => i + 1), AUTO_NEXT_MS);
//     return () => clearTimeout(timer);
//   }, [index]);

//   return (
//     <View style={styles.container}>
//       {/* Changing parts: the key remounts them so the animation replays */}
//       <FadeInView
//         key={`image-${slide.id}`}
//         duration={600}
//         distance={0}
//         scaleFrom={0.94}
//       >
//         <Image style={styles.img} source={slide.image} />
//       </FadeInView>

//       <View style={styles.textBlock}>
//         <FadeInView key={`title-${slide.id}`} delay={150}>
//           <AppText size={30} weight="bold" align="center" style={styles.title}>
//             {slide.title}
//           </AppText>
//         </FadeInView>

//         <FadeInView key={`desc-${slide.id}`} delay={270}>
//           <AppText
//             size={16}
//             weight="medium"
//             color="textSecondary"
//             align="center"
//             style={styles.description}
//           >
//             {slide.description}
//           </AppText>
//         </FadeInView>
//       </View>

//       {/* Fixed parts: no key, so they animate in once on first mount */}
//       <FadeInView delay={400}>
//         <DotNavigation
//           count={SLIDES.length}
//           activeIndex={index}
//           onDotPress={setIndex}
//         />
//       </FadeInView>

//       <FadeInView delay={520} style={styles.gap}>
//         <Button label="Create Account" onPress={onCreateAccount} />
//       </FadeInView>

//       <FadeInView delay={640}>
//         <TouchableOpacity style={styles.center} onPress={onLogin}>
//           <AppText color="primary" weight="semibold" size={18}>
//             Already Have an Account
//           </AppText>
//         </TouchableOpacity>
//       </FadeInView>
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
//   textBlock: {
//     gap: 12,
//   },
//   // Fixed heights stop the dots and buttons from jumping when text length changes
//   title: {
//     minHeight: 86,
//   },
//   description: {
//     minHeight: 66,
//   },
//   center: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   gap: {
//     marginTop: 20,
//   },
// });

import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { FadeInView } from "@/shared/components/FadeInView";
import { StoryProgress } from "@/shared/components/StoryProgress";
import { useState } from "react";
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

type Slide = {
  id: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
};

const SLIDES: Slide[] = [
  {
    id: "collections",
    image: require("@/assets/images/intro-one-img.jpg"),
    title: "Various Collections Of The Latest Products",
    description:
      "Explore our latest collections, discover trending styles, and find the perfect products to match your taste.",
  },
  {
    id: "colors-sizes",
    image: require("@/assets/images/intro-two-img.jpg"),
    title: "Complete Collection Of Colors And Sizes",
    description:
      "Choose from a wide range of colors and sizes to find the perfect fit for your style and preferences.",
  },
  {
    id: "outfit",
    image: require("@/assets/images/intro-three-img.jpg"),
    title: "Find The Most Suitable Outfit For You",
    description:
      "Discover outfits that match your unique style and find the perfect look for every occasion.",
  },
];

// How long each slide stays before moving on (also the bar fill time)
const AUTO_NEXT_MS = 2000;

type OnboardingProps = {
  onCreateAccount?: () => void;
  onLogin?: () => void;
};

export const Onboarding = ({ onCreateAccount, onLogin }: OnboardingProps) => {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  // Called when the active bar finishes filling. The last slide just stays put.
  const handleSegmentComplete = () => {
    if (index < SLIDES.length - 1) setIndex(index + 1);
  };

  return (
    <View style={styles.container}>
      {/* Progress bars at the top */}
      <FadeInView distance={-12}>
        <StoryProgress
          count={SLIDES.length}
          activeIndex={index}
          duration={AUTO_NEXT_MS}
          onSegmentComplete={handleSegmentComplete}
          onSegmentPress={setIndex}
        />
      </FadeInView>

      {/* Changing parts: the key remounts them so the animation replays */}
      <FadeInView
        key={`image-${slide.id}`}
        duration={600}
        distance={0}
        scaleFrom={0.94}
      >
        <Image style={styles.img} source={slide.image} />
      </FadeInView>

      <View style={styles.textBlock}>
        <FadeInView key={`title-${slide.id}`} delay={150}>
          <AppText size={30} weight="bold" align="center" style={styles.title}>
            {slide.title}
          </AppText>
        </FadeInView>

        <FadeInView key={`desc-${slide.id}`} delay={270}>
          <AppText
            size={16}
            weight="medium"
            color="textSecondary"
            align="center"
            style={styles.description}
          >
            {slide.description}
          </AppText>
        </FadeInView>
      </View>

      {/* Fixed parts: no key, so they animate in once on first mount */}
      <FadeInView delay={450} style={styles.gap}>
        <Button label="Create Account" onPress={onCreateAccount} />
      </FadeInView>

      <FadeInView delay={570}>
        <TouchableOpacity style={styles.center} onPress={onLogin}>
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
  textBlock: {
    gap: 12,
  },
  // Fixed heights stop the button from jumping when text length changes
  title: {
    minHeight: 86,
  },
  description: {
    minHeight: 66,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  gap: {
    marginTop: 20,
  },
});
