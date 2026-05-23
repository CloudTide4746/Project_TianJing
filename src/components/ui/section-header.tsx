import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import {
  FoundationColors,
  getCollectibleTheme,
  type CollectibleThemeId,
} from '@/constants/collectible-theme';
import { Spacing } from '@/constants/theme';

import { ThemedText } from '../themed-text';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tone?: CollectibleThemeId | 'default';
  align?: 'left' | 'center';
  density?: 'default' | 'compact';
  actionLabel?: string;
  onAction?: () => void;
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function getAccentColor(tone: CollectibleThemeId | 'default') {
  return tone === 'default' ? FoundationColors.gold : getCollectibleTheme(tone).accent;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  tone = 'default',
  align = 'left',
  density = 'default',
  actionLabel,
  onAction,
  trailing,
  style,
}: SectionHeaderProps) {
  const accentColor = getAccentColor(tone);
  const isCentered = align === 'center';
  const isCompact = density === 'compact';

  return (
    <View
      style={[
        styles.container,
        isCentered && styles.containerCentered,
        isCompact && styles.containerCompact,
        style,
      ]}>
      <View style={[styles.copy, isCompact && styles.copyCompact]}>
        {eyebrow ? (
          <View style={[styles.eyebrowWrap, isCentered && styles.eyebrowWrapCentered]}>
            <View
              style={[
                styles.eyebrowDot,
                { backgroundColor: accentColor },
              ]}
            />
            <ThemedText
              style={[
                styles.eyebrow,
                isCompact && styles.eyebrowCompact,
                isCentered && styles.textCentered,
                { color: accentColor },
              ]}>
              {eyebrow}
            </ThemedText>
          </View>
        ) : null}
        <ThemedText
          type="subtitle"
          style={[
            styles.title,
            isCompact && styles.titleCompact,
            isCentered && styles.textCentered,
          ]}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText
            themeColor="textSecondary"
            style={[
              styles.subtitle,
              isCompact && styles.subtitleCompact,
              isCentered && styles.textCentered,
            ]}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>

      {trailing ? (
        trailing
      ) : actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={({ pressed }) => [
            styles.action,
            pressed && styles.actionPressed,
          ]}>
          <ThemedText
            style={[
              styles.actionLabel,
              { color: accentColor },
            ]}>
            {actionLabel}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  containerCentered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerCompact: {
    gap: Spacing.two,
  },
  copy: {
    flex: 1,
    gap: 10,
  },
  copyCompact: {
    gap: 6,
  },
  eyebrowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eyebrowWrapCentered: {
    justifyContent: 'center',
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  eyebrow: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 700,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  eyebrowCompact: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 30,
    lineHeight: 40,
    fontWeight: 600,
  },
  titleCompact: {
    fontSize: 24,
    lineHeight: 32,
  },
  subtitle: {
    maxWidth: 560,
    fontSize: 15,
    lineHeight: 24,
  },
  subtitleCompact: {
    maxWidth: 520,
    fontSize: 14,
    lineHeight: 20,
  },
  textCentered: {
    textAlign: 'center',
  },
  action: {
    minHeight: 32,
    justifyContent: 'center',
  },
  actionPressed: {
    opacity: 0.72,
  },
  actionLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
});
