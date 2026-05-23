import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import {
  FoundationColors,
  getCollectibleTheme,
  type CollectibleThemeId,
} from '@/constants/collectible-theme';
import { Spacing } from '@/constants/theme';

export type GlowCardTone =
  | CollectibleThemeId
  | 'default'
  | 'gold'
  | 'success'
  | 'error';

export type GlowCardPadding = 'none' | 'sm' | 'md' | 'lg';

type GlowCardProps = {
  children: ReactNode;
  tone?: GlowCardTone;
  padding?: GlowCardPadding;
  interactive?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function getTonePalette(tone: GlowCardTone) {
  if (tone === 'gold') {
    return {
      border: FoundationColors.gold,
      glow: FoundationColors.gold,
      accent: FoundationColors.gold,
    };
  }

  if (tone === 'success') {
    return {
      border: FoundationColors.success,
      glow: FoundationColors.success,
      accent: FoundationColors.success,
    };
  }

  if (tone === 'error') {
    return {
      border: FoundationColors.error,
      glow: FoundationColors.error,
      accent: FoundationColors.error,
    };
  }

  if (tone === 'default') {
    return {
      border: FoundationColors.border,
      glow: FoundationColors.gold,
      accent: FoundationColors.textSecondary,
    };
  }

  const theme = getCollectibleTheme(tone);
  return {
    border: theme.secondary,
    glow: theme.primary,
    accent: theme.accent,
  };
}

function getPaddingStyle(padding: GlowCardPadding) {
  switch (padding) {
    case 'none':
      return styles.paddingNone;
    case 'sm':
      return styles.paddingSmall;
    case 'lg':
      return styles.paddingLarge;
    case 'md':
    default:
      return styles.paddingMedium;
  }
}

export function GlowCard({
  children,
  tone = 'default',
  padding = 'md',
  interactive = false,
  disabled = false,
  onPress,
  onLongPress,
  style,
  contentStyle,
}: GlowCardProps) {
  const palette = getTonePalette(tone);
  const isInteractive = Boolean(onPress || onLongPress || interactive);

  const cardBody = (
    <View
      style={[
        styles.card,
        {
          borderColor: withAlpha(palette.border, 0.68),
          shadowColor: palette.glow,
          opacity: disabled ? 0.64 : 1,
        },
        style,
      ]}>
      <View
        pointerEvents="none"
        style={[
          styles.glow,
          {
            backgroundColor: withAlpha(palette.glow, 0.09),
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.accentBar,
          {
            backgroundColor: withAlpha(palette.accent, 0.7),
          },
        ]}
      />
      <View style={[getPaddingStyle(padding), contentStyle]}>{children}</View>
    </View>
  );

  if (!isInteractive) {
    return cardBody;
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onLongPress={onLongPress}
      onPress={onPress}
      style={({ pressed }) => [
        pressed && !disabled && styles.pressed,
      ]}>
      {cardBody}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: 28,
    borderWidth: 1,
    backgroundColor: FoundationColors.backgroundElement,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 8,
  },
  glow: {
    position: 'absolute',
    top: -36,
    right: -12,
    width: 120,
    height: 120,
    borderRadius: 999,
  },
  accentBar: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
    top: 0,
    height: 1.5,
    borderBottomLeftRadius: 999,
    borderBottomRightRadius: 999,
  },
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  paddingMedium: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  paddingLarge: {
    padding: Spacing.five,
    gap: Spacing.four,
  },
  pressed: {
    transform: [{ scale: 0.988 }],
  },
});
