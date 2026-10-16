import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import type { Banner } from "@/features/home/types";
import { AppText } from "@/shared/components/AppText";
import { DotNavigation } from "@/shared/components/DotNavigation";
import { Image } from "expo-image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
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

export function PromoBanner({
  banners,
  horizontalPadding = 20,
  intervalMs = 3500,
}: PromoBannerProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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
          <View style={[styles.slide, { width: bannerWidth }]}>
            <View style={styles.circle} />

            <View
              style={[
                styles.textBlock,
                { paddingRight: item.image ? bannerWidth * 0.32 : 24 },
              ]}
            >
              <AppText size={17} weight="bold" align="center" numberOfLines={3}>
                {item.title}
              </AppText>
              <AppText
                size={12}
                weight="medium"
                color="textSecondary"
                align="center"
              >
                {item.subtitle}
              </AppText>
            </View>

            {item.image && (
              <Image
                source={item.image}
                style={styles.image}
                contentFit="contain"
              />
            )}
          </View>
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
      height: 140,
      borderRadius: 14,
      backgroundColor: c.surfaceMuted,
      overflow: "hidden",
      justifyContent: "center",
    },
    circle: {
      position: "absolute",
      left: -36,
      bottom: -36,
      height: 130,
      width: 130,
      borderRadius: 65,
      backgroundColor: c.primary + "33",
    },
    textBlock: {
      paddingLeft: 24,
      gap: 8,
      alignItems: "center",
    },
    image: {
      position: "absolute",
      right: 0,
      bottom: 0,
      height: "100%",
      width: "34%",
    },
    dots: {
      marginTop: 12,
    },
  });
