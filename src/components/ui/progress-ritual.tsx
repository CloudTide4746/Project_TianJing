import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { FoundationColors } from '@/constants/collectible-theme';
import { Spacing } from '@/constants/theme';
import type { GenerationPhase } from '@/types/collectible';

import { ThemedText } from '../themed-text';
import { GlowCard, type GlowCardTone } from './glow-card';
import { StatusPill } from './status-pill';

type ProgressRitualProps = {
  currentPhase: GenerationPhase;
  phases?: readonly GenerationPhase[];
  progress?: number;
  title?: string;
  subtitle?: string;
  tone?: GlowCardTone;
  style?: StyleProp<ViewStyle>;
};

function getToneFromPhase(phase: GenerationPhase): GlowCardTone {
  switch (phase.tone) {
    case 'gold':
      return 'gold';
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'textSecondary':
    default:
      return 'default';
  }
}

export function ProgressRitual({
  currentPhase,
  phases,
  progress,
  title = 'AI 正在显影',
  subtitle,
  tone,
  style,
}: ProgressRitualProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const normalizedProgress = Math.max(0, Math.min(progress ?? currentPhase.progress, 1));
  const toneFromPhase = tone ?? getToneFromPhase(currentPhase);
  const barWidth = useSharedValue(0);
  const pulse = useSharedValue(0.55);

  useEffect(() => {
    barWidth.value = withTiming(trackWidth * normalizedProgress, {
      duration: 420,
    });
  }, [barWidth, normalizedProgress, trackWidth]);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1400 }),
      -1,
      true,
    );

    return () => {
      cancelAnimation(pulse);
    };
  }, [pulse]);

  const activeIndex = useMemo(
    () => phases?.findIndex((phase) => phase.id === currentPhase.id) ?? -1,
    [currentPhase.id, phases],
  );

  const progressBarStyle = useAnimatedStyle(() => ({
    width: Math.max(barWidth.value, trackWidth > 0 ? 24 : 0),
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0.55, 1], [0.38, 0.92]),
    transform: [
      {
        scale: interpolate(pulse.value, [0.55, 1], [0.96, 1.14]),
      },
    ],
  }));

  return (
    <GlowCard
      padding="lg"
      style={style}
      tone={toneFromPhase}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText
            themeColor="textSecondary"
            style={styles.subtitle}>
            {subtitle ?? currentPhase.detail}
          </ThemedText>
        </View>
        <StatusPill
          label={`${Math.round(normalizedProgress * 100)}%`}
          status={currentPhase.status}
          tone={toneFromPhase === 'default' ? undefined : toneFromPhase}
        />
      </View>

      <View
        onLayout={(event) => {
          setTrackWidth(event.nativeEvent.layout.width);
        }}
        style={styles.track}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pulse,
            pulseStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.fill,
            progressBarStyle,
            currentPhase.status === 'failed' && styles.fillError,
            currentPhase.status === 'complete' && styles.fillSuccess,
          ]}
        />
      </View>

      <View style={styles.phaseList}>
        {(phases ?? [currentPhase]).map((phase, index) => {
          const completed = activeIndex >= 0 ? index < activeIndex : phase.progress <= normalizedProgress;
          const active = phase.id === currentPhase.id;

          return (
            <View
              key={phase.id}
              style={styles.phaseRow}>
              <View
                style={[
                  styles.phaseDot,
                  completed && styles.phaseDotComplete,
                  active && styles.phaseDotActive,
                  phase.status === 'failed' && styles.phaseDotError,
                ]}
              />
              <View style={styles.phaseCopy}>
                <ThemedText style={styles.phaseLabel}>{phase.label}</ThemedText>
                <ThemedText
                  themeColor={active ? 'textSecondary' : 'textMuted'}
                  style={styles.phaseDetail}>
                  {phase.detail}
                </ThemedText>
              </View>
              <StatusPill
                dot={active}
                size="sm"
                status={phase.status}
              />
            </View>
          );
        })}
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  copy: {
    flex: 1,
    gap: Spacing.two,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  track: {
    overflow: 'hidden',
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(61, 50, 43, 0.86)',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    left: 0,
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: 'rgba(212, 168, 83, 0.16)',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: FoundationColors.gold,
  },
  fillSuccess: {
    backgroundColor: FoundationColors.success,
  },
  fillError: {
    backgroundColor: FoundationColors.error,
  },
  phaseList: {
    gap: Spacing.three,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  phaseDot: {
    width: 10,
    height: 10,
    marginTop: 6,
    borderRadius: 999,
    backgroundColor: FoundationColors.border,
  },
  phaseDotActive: {
    backgroundColor: FoundationColors.gold,
  },
  phaseDotComplete: {
    backgroundColor: FoundationColors.success,
  },
  phaseDotError: {
    backgroundColor: FoundationColors.error,
  },
  phaseCopy: {
    flex: 1,
    gap: 2,
  },
  phaseLabel: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 700,
  },
  phaseDetail: {
    fontSize: 13,
    lineHeight: 18,
  },
});
