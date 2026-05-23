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
  actionLabel,
  onAction,
  trailing,
  style,
}: SectionHeaderProps) {
  const accentColor = getAccentColor(tone);
  const isCentered = align === 'center';

  return (
    <View
      style={[
        styles.container,
        isCentered && styles.containerCentered,
        style,
      ]}>
      <View style={styles.copy}>
        {eyebrow ? (
          <ThemedText
            style={[
              styles.eyebrow,
              isCentered && styles.textCentered,
              { color: accentColor },
            ]}>
            {eyebrow}
          </ThemedText>
        ) : null}
        <ThemedText
          type="subtitle"
          style={[
            styles.title,
            isCentered && styles.textCentered,
          ]}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText
            themeColor="textSecondary"
            style={[
              styles.subtitle,
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
  copy: {
    flex: 1,
    gap: Spacing.two,
  },
  eyebrow: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 700,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
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
