/** @format */

import { Image } from "expo-image";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";

import {
  FoundationColors,
  getCollectibleTheme,
} from "@/constants/collectible-theme";
import { Fonts, Spacing } from "@/constants/theme";

import { ThemedText } from "../themed-text";

type HeroBannerItem = {
  id?: string;
  kind?: string;
  siteName?: string;
  title?: string;
  subtitle?: string;
  anchor?: {
    locationName?: string;
    mintNumber?: number;
  };
} | null;

type HeroBannerProps = {
  item: HeroBannerItem;
  itemCount?: number;
  loading?: boolean;
  onPressCreate?: () => void;
};

const HOME_POSTER = require("../../../assets/home_poster_20260523_123231.png");

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function HeroBanner({ item, itemCount, loading, onPressCreate }: HeroBannerProps) {
  const kind = (item?.kind ?? 'ruin') as 'ruin' | 'message' | 'crystal';
  const theme = getCollectibleTheme(kind);
  const { width } = useWindowDimensions();
  const isCompactScreen = width <= 430;
  const siteName = item?.siteName ?? item?.anchor?.locationName ?? '刻迹';
  const subtitle = item?.subtitle ?? (loading ? '正在连接时空服务器...' : '拍照即锚定: 坐标、时间、天气自动存档');

  return (
    <View style={styles.card}>
      <View
        pointerEvents='none'
        style={[
          styles.glowWash,
          { backgroundColor: withAlpha(theme.primary, 0.12) },
        ]}
      />
      <View
        pointerEvents='none'
        style={[
          styles.cornerRing,
          { borderColor: withAlpha(theme.secondary, 0.18) },
        ]}
      />
      <View
        style={[
          styles.posterStage,
          isCompactScreen && styles.posterStageCompact,
          { borderColor: withAlpha(theme.secondary, 0.08) },
        ]}
      >
        <View
          pointerEvents='none'
          style={[
            styles.posterTopWash,
            { backgroundColor: withAlpha(theme.accent, 0.14) },
          ]}
        />
        <View
          style={[
            styles.posterFrame,
            { borderColor: withAlpha(theme.primary, 0.42) },
          ]}
        >
          <Image
            contentFit='cover'
            source={HOME_POSTER}
            style={styles.posterImage}
          />
          <View
            pointerEvents='none'
            style={[
              styles.titleOverlay,
              isCompactScreen && styles.titleOverlayCompact,
              {
                backgroundColor: withAlpha(
                  FoundationColors.backgroundBright,
                  0.1,
                ),
                borderColor: withAlpha(theme.primary, 0.16),
              },
            ]}
          >
            <ThemedText
              themeColor='textMuted'
              style={[
                styles.overline,
                isCompactScreen && styles.overlineCompact,
                { color: theme.secondary },
              ]}
            >
              {siteName}
            </ThemedText>
            <View style={styles.titleWrap}>
              <ThemedText
                style={[
                  styles.titleGlow,
                  isCompactScreen && styles.titleGlowCompact,
                ]}
              >
                时间的回响
              </ThemedText>
              <ThemedText
                style={[
                  styles.titleInk,
                  isCompactScreen && styles.titleInkCompact,
                ]}
              >
                时间的回响
              </ThemedText>
            </View>
          </View>
          <View
            pointerEvents='none'
            style={[
              styles.posterSeal,
              { backgroundColor: withAlpha(theme.primary, 0.88) },
            ]}
          >
            <ThemedText style={styles.posterSealText}>展</ThemedText>
          </View>
          {onPressCreate ? (
            <View style={styles.overlayAction}>
              <Pressable
                accessibilityRole='button'
                onPress={onPressCreate}
                style={({ pressed }) => [
                  styles.heroAction,
                  pressed && styles.heroActionPressed,
                ]}
              >
                <View
                  pointerEvents='none'
                  style={[
                    styles.heroActionGlow,
                    { backgroundColor: withAlpha(theme.accent, 0.36) },
                  ]}
                />
                <View
                  pointerEvents='none'
                  style={[
                    styles.heroActionRing,
                    { borderColor: withAlpha(theme.accent, 0.38) },
                  ]}
                />
                <ThemedText style={styles.heroActionTextGlow}>创</ThemedText>
                <ThemedText style={styles.heroActionText}>创</ThemedText>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    gap: Spacing.two,
    overflow: "hidden",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(216, 206, 192, 0.8)",
    backgroundColor: FoundationColors.backgroundBright,
    padding: 16,
  },
  glowWash: {
    position: "absolute",
    top: -64,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 999,
  },
  cornerRing: {
    position: "absolute",
    right: -18,
    bottom: -18,
    width: 160,
    height: 160,
    borderRadius: 999,
    borderWidth: 1,
  },
  overline: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  titleWrap: {
    position: "relative",
    alignSelf: "flex-start",
  },
  titleGlow: {
    fontFamily: Fonts.serif,
    fontSize: 40,
    lineHeight: 50,
    fontWeight: "600",
    color: "rgba(196, 149, 106, 0.42)",
    textShadowColor: "rgba(196, 149, 106, 0.32)",
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 12,
  },
  titleInk: {
    position: "absolute",
    top: 0,
    left: 0,
    fontFamily: Fonts.serif,
    fontSize: 40,
    lineHeight: 50,
    fontWeight: "600",
    color: "#40362d",
    textShadowColor: "rgba(74, 57, 40, 0.12)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 8,
  },
  posterStage: {
    minHeight: 760,
    borderRadius: 28,
    borderWidth: 0,
    backgroundColor: "transparent",
    padding: 0,
  },
  posterStageCompact: {
    minHeight: 620,
  },
  posterTopWash: {
    position: "absolute",
    top: -52,
    left: -10,
    right: -10,
    height: 140,
    borderRadius: 999,
  },
  posterFrame: {
    flex: 1,
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255, 253, 248, 0.96)",
    overflow: "hidden",
    shadowColor: "#a98758",
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 3,
  },
  posterImage: {
    width: "100%",
    height: "100%",
  },
  titleOverlay: {
    position: "absolute",
    top: 24,
    left: 20,
    right: 104,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  titleOverlayCompact: {
    top: 18,
    left: 16,
    right: 88,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  overlineCompact: {
    fontSize: 10,
    lineHeight: 14,
  },
  titleGlowCompact: {
    fontSize: 32,
    lineHeight: 40,
  },
  titleInkCompact: {
    fontSize: 32,
    lineHeight: 40,
  },
  posterSeal: {
    position: "absolute",
    right: 18,
    bottom: 18,
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  posterSealText: {
    color: FoundationColors.backgroundBright,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
  },
  overlayAction: {
    position: "absolute",
    left: 16,
    bottom: 16,
  },
  heroAction: {
    width: 62,
    height: 62,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 244, 221, 0.22)",
    backgroundColor: "rgba(29, 22, 16, 0.16)",
    overflow: "hidden",
  },
  heroActionPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.94,
  },
  heroActionGlow: {
    position: "absolute",
    left: -6,
    right: -6,
    top: -10,
    height: 34,
    borderRadius: 999,
  },
  heroActionRing: {
    position: "absolute",
    inset: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  heroActionTextGlow: {
    position: "absolute",
    fontFamily: Fonts.serif,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "600",
    color: "rgba(255, 223, 177, 0.56)",
    textShadowColor: "rgba(255, 216, 156, 0.68)",
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 12,
  },
  heroActionText: {
    fontFamily: Fonts.serif,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "600",
    color: "#fff4df",
    textShadowColor: "rgba(74, 50, 18, 0.32)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 8,
    letterSpacing: 1.2,
  },
});
