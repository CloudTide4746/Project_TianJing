import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, Sparkles, Library } from 'lucide-react-native';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { FoundationColors } from '@/constants/collectible-theme';
import { Fonts, Spacing } from '@/constants/theme';

import { PrimaryButton } from '../ui/primary-button';
import { ThemedText } from '../themed-text';
import { OnboardingSlide } from './onboarding-slide';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type OnboardingOverlayProps = {
  onComplete: () => void;
};

const DOT_GAP = 8;
const DOT_HEIGHT = 4;
const DOT_ACTIVE_WIDTH = 24;
const DOT_INACTIVE_WIDTH = 8;

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: FoundationColors.background,
    zIndex: 999,
  },
  bgGradient: {
    position: 'absolute',
    top: '-20%',
    left: '-20%',
    width: '140%',
    height: '140%',
    opacity: 0.4,
  },
  skipRow: {
    position: 'absolute',
    top: 60,
    right: Spacing.three,
    zIndex: 1,
  },
  flatList: {
    flex: 1,
  },
  illustrationBox: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  footer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: Spacing.five,
  },
  pageIndicator: {
    flexDirection: 'row',
    gap: DOT_GAP,
    alignItems: 'center',
  },
  dot: {
    height: DOT_HEIGHT,
    width: DOT_INACTIVE_WIDTH,
    borderRadius: DOT_HEIGHT / 2,
    backgroundColor: FoundationColors.border,
    overflow: 'hidden',
  },
  dotFill: {
    height: '100%',
    width: '100%',
    borderRadius: DOT_HEIGHT / 2,
    backgroundColor: FoundationColors.gold,
  },
  buttonSlot: {
    width: SCREEN_WIDTH * 0.7,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: FoundationColors.textMuted,
    letterSpacing: 0.5,
  },
  ctaGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 32,
    borderWidth: 2,
  },
  ctaWrapper: {
    position: 'relative',
    width: SCREEN_WIDTH * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const PAGES = [
  {
    key: 'capture',
    title: '定格每一刻',
    subtitle: '拍下任何触动你的画面——三只鹅、一片湖、一场活动、一个拍摄现场，任何场景都值得被记住',
    icon: Camera,
  },
  {
    key: 'enrich',
    title: '赋予故事与灵魂',
    subtitle: 'AI为每张照片生成专属的背景故事、时空信息和视觉风格，让记忆真正活起来',
    icon: Sparkles,
  },
  {
    key: 'collect',
    title: '构建你的记忆馆',
    subtitle: '收藏、整理、分享你的记忆卡片，让每一段时光都有归属',
    icon: Library,
  },
];

function SlideIllustration({ index }: { index: number }) {
  const page = PAGES[index];
  if (!page) return null;
  const Icon = page.icon;

  return (
    <View style={styles.illustrationBox}>
      <Icon color={FoundationColors.gold} size={44} strokeWidth={1.5} />
    </View>
  );
}

function AnimatedDot({
  isActive,
  onPress,
}: {
  isActive: boolean;
  onPress: () => void;
}) {
  const width = useSharedValue(DOT_INACTIVE_WIDTH);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    if (isActive) {
      width.value = withSpring(DOT_ACTIVE_WIDTH, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 250 });
    } else {
      width.value = withSpring(DOT_INACTIVE_WIDTH, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(0.5, { duration: 250 });
    }
  }, [isActive, width, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    opacity: opacity.value,
  }));

  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Animated.View style={[styles.dot, animatedStyle]}>
        <View style={styles.dotFill} />
      </Animated.View>
    </Pressable>
  );
}

function GlowBorder() {
  const opacity = useSharedValue(0.4);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.3, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.98, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
    return () => {
      cancelAnimation(opacity);
      cancelAnimation(scale);
    };
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.ctaGlow,
        { borderColor: FoundationColors.gold },
        animatedStyle,
      ]}
    />
  );
}

export function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<typeof PAGES[number]>>(null);
  const isLastPage = currentIndex === PAGES.length - 1;
  const overlayOpacity = useSharedValue(1);
  const rootScale = useSharedValue(1);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      setCurrentIndex(index);
    },
    [],
  );

  const handleSkip = useCallback(() => {
    overlayOpacity.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.quad) }, (finished) => {
      if (finished) runOnJS(onComplete)();
    });
  }, [onComplete, overlayOpacity]);

  const handleComplete = useCallback(() => {
    rootScale.value = withTiming(0.96, { duration: 150 });
    overlayOpacity.value = withDelay(
      100,
      withTiming(0, { duration: 400, easing: Easing.inOut(Easing.quad) }, (finished) => {
        if (finished) runOnJS(onComplete)();
      }),
    );
  }, [onComplete, overlayOpacity, rootScale]);

  const handleDotPress = useCallback(
    (i: number) => {
      flatListRef.current?.scrollToOffset({ offset: i * SCREEN_WIDTH, animated: true });
    },
    [],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: (typeof PAGES)[number]; index: number }) => (
      <OnboardingSlide
        illustration={<SlideIllustration index={index} />}
        index={index}
        isActive={index === currentIndex}
        subtitle={item.subtitle}
        title={item.title}
      />
    ),
    [currentIndex],
  );

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    transform: [{ scale: rootScale.value }],
  }));

  return (
    <Animated.View style={[styles.root, overlayStyle]}>
      <View style={styles.bgGradient}>
        <View
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: `${FoundationColors.gold}0D`,
            transform: [{ translateX: -150 }],
          }}
        />
      </View>

      <View style={[styles.skipRow, { top: insets.top + Spacing.three }]}>
        <PrimaryButton
          label="跳过"
          size="sm"
          variant="ghost"
          fullWidth={false}
          onPress={handleSkip}
        />
      </View>

      <FlatList
        ref={flatListRef}
        bounces={false}
        data={PAGES}
        decelerationRate="fast"
        horizontal
        keyExtractor={(item) => item.key}
        onScroll={handleScroll}
        pagingEnabled
        renderItem={renderItem}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        style={styles.flatList}
      />

      <View style={styles.footer}>
        <View style={styles.pageIndicator}>
          {PAGES.map((_, i) => (
            <AnimatedDot
              key={i}
              isActive={i === currentIndex}
              onPress={() => handleDotPress(i)}
            />
          ))}
        </View>

        <View style={styles.buttonSlot}>
          {isLastPage ? (
            <View style={styles.ctaWrapper}>
              <GlowBorder />
              <PrimaryButton
                label="开始体验"
                size="lg"
                onPress={handleComplete}
              />
            </View>
          ) : (
            <ThemedText style={styles.hint}>向右滑动浏览</ThemedText>
          )}
        </View>
      </View>
    </Animated.View>
  );
}
