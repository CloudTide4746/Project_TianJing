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
      surface: FoundationColors.backgroundBright,
    };
  }

  if (tone === 'success') {
    return {
      border: FoundationColors.success,
      glow: FoundationColors.success,
      accent: FoundationColors.success,
      surface: FoundationColors.backgroundBright,
    };
  }

  if (tone === 'error') {
    return {
      border: FoundationColors.error,
      glow: FoundationColors.error,
      accent: FoundationColors.error,
      surface: FoundationColors.backgroundBright,
    };
  }

  if (tone === 'default') {
    return {
      border: FoundationColors.border,
      glow: FoundationColors.gold,
      accent: FoundationColors.textSecondary,
      surface: FoundationColors.backgroundElement,
    };
  }

  const theme = getCollectibleTheme(tone);
  if (!theme) {
    return {
      border: FoundationColors.border,
      glow: FoundationColors.gold,
      accent: FoundationColors.textSecondary,
      surface: FoundationColors.backgroundElement,
    };
  }
  return {
    border: theme.secondary,
    glow: theme.primary,
    accent: theme.accent,
    surface: theme.surface,
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
          backgroundColor: palette.surface,
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
          styles.highlight,
          {
            backgroundColor: withAlpha(palette.accent, 0.18),
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
      <View
        pointerEvents="none"
        style={[
          styles.cornerWash,
          {
            borderColor: withAlpha(palette.border, 0.26),
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
        styles.pressable,
        pressed && !disabled && styles.pressed,
      ]}>
      {cardBody}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: FoundationColors.backgroundElement,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  glow: {
    position: 'absolute',
    top: -52,
    right: -22,
    width: 160,
    height: 160,
    borderRadius: 999,
  },
  highlight: {
    position: 'absolute',
    top: 1,
    left: Spacing.three,
    right: Spacing.three,
    height: 56,
    borderRadius: 999,
  },
  accentBar: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
    top: 0,
    height: 2,
    borderBottomLeftRadius: 999,
    borderBottomRightRadius: 999,
  },
  cornerWash: {
    position: 'absolute',
    right: -26,
    bottom: -26,
    width: 140,
    height: 140,
    borderWidth: 1,
    borderRadius: 999,
  },
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  paddingMedium: {
    padding: 22,
    gap: Spacing.three,
  },
  paddingLarge: {
    padding: 30,
    gap: Spacing.four,
  },
  pressable: {
    borderRadius: 30,
  },
  pressed: {
    transform: [{ scale: 0.985 }, { translateY: 2 }],
  },
});
