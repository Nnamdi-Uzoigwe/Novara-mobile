import { Image } from "expo-image";
import Animated from "react-native-reanimated";

// expo-image wrapped as a Reanimated component so it accepts sharedTransitionTag
export const AnimatedImage = Animated.createAnimatedComponent(Image);
