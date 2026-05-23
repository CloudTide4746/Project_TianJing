import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { CollectibleKind } from '@/types/collectible';
import { Spacing } from '@/constants/theme';

import { ThemedText } from '../themed-text';
import { GlowCard } from './glow-card';
import { PrimaryButton } from './primary-button';
import { StatusPill } from './status-pill';

type EmptyStateProps = {
  title: string;
  description: string;
  tone?: CollectibleKind | 'default';
  eyebrow?: string;
  badge?: string;
  artwork?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function EmptyState({
  title,
  description,
  tone = 'default',
  eyebrow = '还没有内容',
  badge,
  artwork,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  style,
}: EmptyStateProps) {
  return (
    <GlowCard
      padding="lg"
      style={style}
      tone={tone}>
      <View style={styles.hero}>
        <View style={styles.artwork}>
          {artwork ?? <View style={styles.placeholderOrb} />}
        </View>
        <View style={styles.copy}>
          <StatusPill
            dot={Boolean(badge)}
            label={badge ?? eyebrow}
            tone={tone}
          />
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText
            themeColor="textSecondary"
            style={styles.description}>
            {description}
          </ThemedText>
        </View>
      </View>

      {actionLabel && onAction ? (
        <PrimaryButton
          label={actionLabel}
          onPress={onAction}
          tone={tone}
        />
      ) : null}

      {secondaryActionLabel && onSecondaryAction ? (
        <PrimaryButton
          label={secondaryActionLabel}
          onPress={onSecondaryAction}
          variant="ghost"
        />
      ) : null}
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: Spacing.four,
    alignItems: 'center',
  },
  artwork: {
    width: 88,
    height: 88,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 168, 83, 0.08)',
  },
  placeholderOrb: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: 'rgba(212, 168, 83, 0.2)',
  },
  copy: {
    gap: Spacing.two,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 700,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
