// import { useTheme } from "@/core/theme/ThemeProvider";
// import type { ThemeColors } from "@/core/theme/colors";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//     Animated,
//     Dimensions,
//     Easing,
//     Modal,
//     PanResponder,
//     Pressable,
//     StyleProp,
//     StyleSheet,
//     View,
//     ViewStyle,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// const SCREEN_HEIGHT = Dimensions.get("window").height;

// export type BottomSheetProps = {
//   visible: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
//   /** Close when the dimmed area is tapped. Defaults to true */
//   dismissOnBackdrop?: boolean;
//   style?: StyleProp<ViewStyle>;
// };

// export function BottomSheet({
//   visible,
//   onClose,
//   children,
//   dismissOnBackdrop = true,
//   style,
// }: BottomSheetProps) {
//   const { colors } = useTheme();
//   const insets = useSafeAreaInsets();
//   const styles = useMemo(() => createStyles(colors), [colors]);

//   // Keeps the Modal mounted until the closing animation finishes
//   const [mounted, setMounted] = useState(visible);
//   const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
//   const backdrop = useRef(new Animated.Value(0)).current;

//   const onCloseRef = useRef(onClose);
//   onCloseRef.current = onClose;

//   useEffect(() => {
//     if (visible) {
//       setMounted(true);
//       Animated.parallel([
//         Animated.timing(backdrop, {
//           toValue: 1,
//           duration: 250,
//           useNativeDriver: true,
//         }),
//         Animated.timing(translateY, {
//           toValue: 0,
//           duration: 320,
//           easing: Easing.out(Easing.cubic),
//           useNativeDriver: true,
//         }),
//       ]).start();
//     } else {
//       Animated.parallel([
//         Animated.timing(backdrop, {
//           toValue: 0,
//           duration: 220,
//           useNativeDriver: true,
//         }),
//         Animated.timing(translateY, {
//           toValue: SCREEN_HEIGHT,
//           duration: 260,
//           easing: Easing.in(Easing.cubic),
//           useNativeDriver: true,
//         }),
//       ]).start(({ finished }) => {
//         if (finished) setMounted(false);
//       });
//     }
//   }, [visible, backdrop, translateY]);

//   // Swipe down on the handle area to dismiss
//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
//       onPanResponderMove: (_, g) => {
//         if (g.dy > 0) translateY.setValue(g.dy);
//       },
//       onPanResponderRelease: (_, g) => {
//         if (g.dy > 100 || g.vy > 0.8) {
//           onCloseRef.current();
//         } else {
//           Animated.spring(translateY, {
//             toValue: 0,
//             useNativeDriver: true,
//             bounciness: 0,
//           }).start();
//         }
//       },
//     }),
//   ).current;

//   return (
//     <Modal
//       visible={mounted}
//       transparent
//       animationType="none"
//       statusBarTranslucent
//       onRequestClose={onClose}
//     >
//       <View style={styles.root}>
//         <Animated.View style={[styles.backdrop, { opacity: backdrop }]}>
//           <Pressable
//             style={StyleSheet.absoluteFill}
//             onPress={dismissOnBackdrop ? onClose : undefined}
//             accessibilityLabel="Close"
//           />
//         </Animated.View>

//         <Animated.View
//           style={[
//             styles.sheet,
//             { paddingBottom: insets.bottom + 24, transform: [{ translateY }] },
//             style,
//           ]}
//         >
//           <View style={styles.handleArea} {...panResponder.panHandlers}>
//             <View style={styles.handle} />
//           </View>

//           {children}
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// }

// const createStyles = (c: ThemeColors) =>
//   StyleSheet.create({
//     root: {
//       flex: 1,
//       justifyContent: "flex-end",
//     },
//     backdrop: {
//       ...StyleSheet.absoluteFill,
//       backgroundColor: "rgba(0,0,0,0.5)",
//     },
//     sheet: {
//       backgroundColor: c.surface,
//       borderTopLeftRadius: 28,
//       borderTopRightRadius: 28,
//       paddingHorizontal: 24,
//     },
//     handleArea: {
//       alignItems: "center",
//       paddingTop: 12,
//       paddingBottom: 20,
//     },
//     handle: {
//       width: 44,
//       height: 5,
//       borderRadius: 3,
//       backgroundColor: c.handle,
//     },
//   });

import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Close when the dimmed area is tapped. Defaults to true */
  dismissOnBackdrop?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function BottomSheet({
  visible,
  onClose,
  children,
  dismissOnBackdrop = true,
  style,
}: BottomSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Keeps the Modal mounted until the closing animation finishes
  const [mounted, setMounted] = useState(visible);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 260,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, backdrop, translateY]);

  // Swipe down on the handle area to dismiss
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 100 || g.vy > 0.8) {
          onCloseRef.current();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView style={styles.root} behavior="padding">
        <Animated.View style={[styles.backdrop, { opacity: backdrop }]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={dismissOnBackdrop ? onClose : undefined}
            accessibilityLabel="Close"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            { paddingBottom: insets.bottom + 24, transform: [{ translateY }] },
            style,
          ]}
        >
          <View style={styles.handleArea} {...panResponder.panHandlers}>
            <View style={styles.handle} />
          </View>

          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: "flex-end",
    },
    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    sheet: {
      backgroundColor: c.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 24,
    },
    handleArea: {
      alignItems: "center",
      paddingTop: 12,
      paddingBottom: 20,
    },
    handle: {
      width: 44,
      height: 5,
      borderRadius: 3,
      backgroundColor: c.handle,
    },
  });
