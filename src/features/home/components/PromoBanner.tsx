// import { useTheme } from "@/core/theme/ThemeProvider";
// import type { ThemeColors } from "@/core/theme/colors";
// import type { Banner } from "@/features/home/types";
// import { AppText } from "@/shared/components/AppText";
// import { DotNavigation } from "@/shared/components/DotNavigation";
// import { Image } from "expo-image";
// import { useEffect, useMemo, useRef, useState } from "react";
// import {
//     FlatList,
//     NativeScrollEvent,
//     NativeSyntheticEvent,
//     StyleSheet,
//     useWindowDimensions,
//     View,
// } from "react-native";

// type PromoBannerProps = {
//   banners: Banner[];
//   /** Horizontal padding of the screen, so the banner fills the width exactly */
//   horizontalPadding?: number;
//   intervalMs?: number;
// };

// export function PromoBanner({
//   banners,
//   horizontalPadding = 20,
//   intervalMs = 3500,
// }: PromoBannerProps) {
//   const { colors } = useTheme();
//   const styles = useMemo(() => createStyles(colors), [colors]);
//   const { width: screenWidth } = useWindowDimensions();
//   const bannerWidth = screenWidth - horizontalPadding * 2;

//   const listRef = useRef<FlatList<Banner>>(null);
//   const [index, setIndex] = useState(0);
//   const [paused, setPaused] = useState(false);

//   const scrollTo = (target: number) => {
//     listRef.current?.scrollToOffset({
//       offset: target * bannerWidth,
//       animated: true,
//     });
//     setIndex(target);
//   };

//   // Auto-advance, looping back to the first banner. Pauses while dragging.
//   useEffect(() => {
//     if (paused || banners.length < 2) return;
//     const timer = setTimeout(() => {
//       scrollTo((index + 1) % banners.length);
//     }, intervalMs);
//     return () => clearTimeout(timer);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [index, paused, banners.length, bannerWidth, intervalMs]);

//   const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
//     setIndex(Math.round(e.nativeEvent.contentOffset.x / bannerWidth));
//     setPaused(false);
//   };

//   return (
//     <View>
//       <FlatList
//         ref={listRef}
//         data={banners}
//         keyExtractor={(item) => item.id}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onScrollBeginDrag={() => setPaused(true)}
//         onMomentumScrollEnd={handleMomentumEnd}
//         renderItem={({ item }) => (
//           <View style={[styles.slide, { width: bannerWidth }]}>
//             <View style={styles.circle} />

//             <View
//               style={[
//                 styles.textBlock,
//                 { paddingRight: item.image ? bannerWidth * 0.32 : 24 },
//               ]}
//             >
//               <AppText size={17} weight="bold" align="center" numberOfLines={3}>
//                 {item.title}
//               </AppText>
//               <AppText
//                 size={12}
//                 weight="medium"
//                 color="textSecondary"
//                 align="center"
//               >
//                 {item.subtitle}
//               </AppText>
//             </View>

//             {item.image && (
//               <Image
//                 source={item.image}
//                 style={styles.image}
//                 contentFit="contain"
//               />
//             )}
//           </View>
//         )}
//       />

//       <DotNavigation
//         count={banners.length}
//         activeIndex={index}
//         onDotPress={scrollTo}
//         size={6}
//         activeWidth={6}
//         gap={6}
//         style={styles.dots}
//       />
//     </View>
//   );
// }

// const createStyles = (c: ThemeColors) =>
//   StyleSheet.create({
//     slide: {
//       height: 140,
//       borderRadius: 14,
//       backgroundColor: c.surfaceMuted,
//       overflow: "hidden",
//       justifyContent: "center",
//     },
//     circle: {
//       position: "absolute",
//       left: -36,
//       bottom: -36,
//       height: 130,
//       width: 130,
//       borderRadius: 65,
//       backgroundColor: c.primary + "33",
//     },
//     textBlock: {
//       paddingLeft: 24,
//       gap: 8,
//       alignItems: "center",
//     },
//     image: {
//       position: "absolute",
//       right: 0,
//       bottom: 0,
//       height: "100%",
//       width: "34%",
//     },
//     dots: {
//       marginTop: 12,
//     },
//   });

import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import type { Banner } from "@/features/home/types";
import { AppText } from "@/shared/components/AppText";
import { DotNavigation } from "@/shared/components/DotNavigation";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

type PromoBannerProps = {
  banners: Banner[];
  /** Horizontal padding of the screen, so the banner fills the width exactly */
  horizontalPadding?: number;
  intervalMs?: number;
};

type BannerSlideProps = {
  banner: Banner;
  width: number;
};

function BannerSlide({ banner, width }: BannerSlideProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [imageFailed, setImageFailed] = useState(false);

  const hasPhoto = !!banner.image && !imageFailed;
  const cta = banner.cta;

  const handlePress = () => {
    if (!cta) return;
    router.push({
      pathname: "/products",
      params: {
        title: cta.title ?? banner.title,
        ...(cta.categoryId ? { category: cta.categoryId } : {}),
      },
    });
  };

  return (
    <Pressable
      style={[styles.slide, { width }, !hasPhoto && styles.slidePlain]}
      onPress={handlePress}
      disabled={!cta}
      accessibilityRole={cta ? "button" : "image"}
      accessibilityLabel={`${banner.title}. ${banner.subtitle}`}
    >
      {hasPhoto ? (
        <>
          <Image
            source={banner.image}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={300}
            onError={() => setImageFailed(true)}
          />
          {/* Darkens the left side so the text is readable on any photo */}
          <LinearGradient
            colors={[
              "rgba(0,0,0,0.72)",
              "rgba(0,0,0,0.42)",
              "rgba(0,0,0,0.05)",
            ]}
            locations={[0, 0.55, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </>
      ) : (
        <>
          <View style={styles.circleLarge} />
          <View style={styles.circleSmall} />
        </>
      )}

      <View style={styles.content}>
        {!!banner.tag && (
          <View style={styles.tag}>
            <AppText size={11} weight="bold" color="#FFFFFF">
              {banner.tag}
            </AppText>
          </View>
        )}

        <AppText
          size={20}
          weight="bold"
          color="#FFFFFF"
          lineHeight={26}
          numberOfLines={3}
        >
          {banner.title}
        </AppText>

        <AppText size={12} weight="medium" color="rgba(255,255,255,0.85)">
          {banner.subtitle}
        </AppText>

        {!!cta && (
          <View style={styles.cta}>
            <AppText size={13} weight="bold" color="primary">
              {cta.label}
            </AppText>
            <Feather name="arrow-right" size={14} color={colors.primary} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

export function PromoBanner({
  banners,
  horizontalPadding = 20,
  intervalMs = 3500,
}: PromoBannerProps) {
  const { width: screenWidth } = useWindowDimensions();
  const bannerWidth = screenWidth - horizontalPadding * 2;

  const listRef = useRef<FlatList<Banner>>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollTo = (target: number) => {
    listRef.current?.scrollToOffset({
      offset: target * bannerWidth,
      animated: true,
    });
    setIndex(target);
  };

  // Auto-advance, looping back to the first banner. Pauses while dragging.
  useEffect(() => {
    if (paused || banners.length < 2) return;
    const timer = setTimeout(() => {
      scrollTo((index + 1) % banners.length);
    }, intervalMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, banners.length, bannerWidth, intervalMs]);

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / bannerWidth));
    setPaused(false);
  };

  return (
    <View>
      <FlatList
        ref={listRef}
        data={banners}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => setPaused(true)}
        onMomentumScrollEnd={handleMomentumEnd}
        renderItem={({ item }) => (
          <BannerSlide banner={item} width={bannerWidth} />
        )}
      />

      <DotNavigation
        count={banners.length}
        activeIndex={index}
        onDotPress={scrollTo}
        size={6}
        activeWidth={6}
        gap={6}
        style={styles.dots}
      />
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    slide: {
      height: 170,
      borderRadius: 18,
      overflow: "hidden",
      justifyContent: "center",
      backgroundColor: c.surfaceMuted,
    },
    // Used when a banner has no photo, or the photo could not load
    slidePlain: {
      backgroundColor: c.primary,
    },
    circleLarge: {
      position: "absolute",
      right: -50,
      top: -50,
      height: 190,
      width: 190,
      borderRadius: 95,
      backgroundColor: "rgba(255,255,255,0.12)",
    },
    circleSmall: {
      position: "absolute",
      right: 60,
      bottom: -40,
      height: 100,
      width: 100,
      borderRadius: 50,
      backgroundColor: "rgba(255,255,255,0.1)",
    },
    content: {
      maxWidth: "72%",
      paddingHorizontal: 20,
      gap: 8,
      alignItems: "flex-start",
    },
    tag: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.22)",
    },
    cta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      height: 34,
      paddingHorizontal: 16,
      borderRadius: 17,
      backgroundColor: "#FFFFFF",
      marginTop: 4,
    },
  });

const styles = StyleSheet.create({
  dots: {
    marginTop: 12,
  },
});
