import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { FoundationColors } from '@/constants/collectible-theme';
import { Fonts, Spacing } from '@/constants/theme';

import { ThemedText } from '../themed-text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type OnboardingSlideProps = {
  illustration: ReactNode;
  title: string;
  subtitle: string;
  isActive: boolean;
  index: number;
};

function FloatingOrb({
  size,
  x,
  y,
  color,
  delay,
  duration,
}: {
  size: number;
  x: number;
  y: number;
  color: string;
  delay: number;
  duration: number;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.5, { duration: duration * 0.3, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.15, { duration: duration * 0.7, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: duration * 0.5, easing: Easing.inOut(Easing.quad) }),
          withTiming(8, { duration: duration * 0.5, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
    translateX.value = withDelay(
      delay + 200,
      withRepeat(
        withSequence(
          withTiming(6, { duration: duration * 0.4, easing: Easing.inOut(Easing.quad) }),
          withTiming(-6, { duration: duration * 0.6, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: duration * 0.4, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.6, { duration: duration * 0.6, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
    return () => {
      cancelAnimation(opacity);
      cancelAnimation(translateY);
      cancelAnimation(translateX);
      cancelAnimation(scale);
    };
  }, [opacity, translateY, translateX, scale, delay, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          left: x,
          top: y,
        },
        animatedStyle,
      ]}
    />
  );
}

function AnimatedRing({
  size,
  color,
  alpha,
  delay,
  duration,
}: {
  size: number;
  color: string;
  alpha: number;
  delay: number;
  duration: number;
}) {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(alpha);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.08, { duration: duration * 0.45, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.92, { duration: duration * 0.55, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(alpha * 1.4, { duration: duration * 0.4, easing: Easing.inOut(Easing.quad) }),
          withTiming(alpha * 0.6, { duration: duration * 0.6, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [scale, opacity, delay, duration, alpha]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1,
          borderColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

export function OnboardingSlide({
  illustration,
  title,
  subtitle,
  isActive,
  index,
}: OnboardingSlideProps) {
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(24);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(16);
  const iconScale = useSharedValue(0.8);

  useEffect(() => {
    if (isActive) {
      titleOpacity.value = withDelay(150, withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) }));
      titleTranslateY.value = withDelay(150, withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) }));
      subtitleOpacity.value = withDelay(350, withTiming(1, { duration: 450, easing: Easing.out(Easing.quad) }));
      subtitleTranslateY.value = withDelay(350, withTiming(0, { duration: 450, easing: Easing.out(Easing.quad) }));
      iconScale.value = withDelay(100, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
    } else {
      titleOpacity.value = 0;
      titleTranslateY.value = 24;
      subtitleOpacity.value = 0;
      subtitleTranslateY.value = 16;
      iconScale.value = 0.8;
    }
  }, [isActive, titleOpacity, titleTranslateY, subtitleOpacity, subtitleTranslateY, iconScale]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <View style={styles.slide}>
      <View style={styles.illustration}>
        {/* Ambient floating orbs */}
        <FloatingOrb
          color={FoundationColors.gold}
          delay={0}
          duration={4000}
          size={8}
          x={SCREEN_WIDTH * 0.15}
          y={SCREEN_WIDTH * 0.28}
        />
        <FloatingOrb
          color={FoundationColors.gold}
          delay={800}
          duration={3500}
          size={5}
          x={SCREEN_WIDTH * 0.6}
          y={SCREEN_WIDTH * 0.12}
        />
        <FloatingOrb
          color={FoundationColors.gold}
          delay={1600}
          duration={4200}
          size={6}
          x={SCREEN_WIDTH * 0.18}
          y={SCREEN_WIDTH * 0.5}
        />
        <FloatingOrb
          color={FoundationColors.gold}
          delay={400}
          duration={3800}
          size={4}
          x={SCREEN_WIDTH * 0.55}
          y={SCREEN_WIDTH * 0.45}
        />

        {/* Animated concentric rings */}
        <AnimatedRing
          alpha={0.18}
          color={FoundationColors.gold}
          delay={0}
          duration={4000}
          size={200}
        />
        <AnimatedRing
          alpha={0.12}
          color={FoundationColors.gold}
          delay={600}
          duration={3500}
          size={170}
        />
        <AnimatedRing
          alpha={0.08}
          color={FoundationColors.gold}
          delay={1200}
          duration={4500}
          size={140}
        />

        {/* Icon circle */}
        <Animated.View
          style={[
            styles.iconCircle,
            { borderColor: `${FoundationColors.gold}40` },
            iconStyle,
          ]}
        >
          {/* Inner highlight */}
          <View style={styles.iconHighlight} />
          {illustration}
        </Animated.View>
      </View>

      <View style={styles.textBlock}>
        <Animated.View style={titleStyle}>
          <ThemedText style={styles.title}>{title}</ThemedText>
        </Animated.View>
        <Animated.View style={subtitleStyle}>
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
    gap: Spacing.six,
  },
  illustration: {
    width: SCREEN_WIDTH * 0.75,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: FoundationColors.backgroundBright,
    overflow: 'hidden',
  },
  iconHighlight: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    height: '45%',
    borderRadius: 50,
    backgroundColor: `${FoundationColors.gold}14`,
  },
  textBlock: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    fontWeight: '700',
    color: FoundationColors.text,
    textAlign: 'center',
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    color: FoundationColors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
});
