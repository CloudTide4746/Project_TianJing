import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import {
  FoundationColors,
  getCollectibleTheme,
  type CollectibleThemeId,
} from '@/constants/collectible-theme';
import { Fonts, Spacing } from '@/constants/theme';

import { ThemedText } from '../themed-text';

export type PrimaryButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'destructive';

export type PrimaryButtonSize = 'sm' | 'md' | 'lg';

type PrimaryButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: PrimaryButtonVariant;
  tone?: CollectibleThemeId | 'default';
  size?: PrimaryButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function getVariantColors(
  variant: PrimaryButtonVariant,
  tone: CollectibleThemeId | 'default',
  disabled: boolean,
) {
  const theme = tone === 'default' ? null : getCollectibleTheme(tone);
  const accent = tone === 'default' ? FoundationColors.gold : (theme?.primary ?? FoundationColors.gold);

  if (disabled) {
    return {
      backgroundColor: FoundationColors.backgroundSelected,
      borderColor: FoundationColors.border,
      textColor: FoundationColors.textMuted,
      highlight: FoundationColors.backgroundBright,
    };
  }

  switch (variant) {
    case 'secondary':
      return {
        backgroundColor: FoundationColors.backgroundBright,
        borderColor: accent,
        textColor: FoundationColors.text,
        highlight: FoundationColors.background,
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        borderColor: FoundationColors.border,
        textColor: FoundationColors.textSecondary,
        highlight: FoundationColors.backgroundBright,
      };
    case 'destructive':
      return {
        backgroundColor: FoundationColors.error,
        borderColor: FoundationColors.error,
        textColor: FoundationColors.backgroundBright,
        highlight: FoundationColors.error,
      };
    case 'primary':
    default:
      return {
        backgroundColor: accent,
        borderColor: accent,
        textColor: FoundationColors.backgroundBright,
        highlight: FoundationColors.backgroundBright,
      };
  }
}

function getSizeStyle(size: PrimaryButtonSize) {
  switch (size) {
    case 'sm':
      return styles.small;
    case 'lg':
      return styles.large;
    case 'md':
    default:
      return styles.medium;
  }
}

export function PrimaryButton({
  label,
  variant = 'primary',
  tone = 'default',
  size = 'md',
  fullWidth = true,
  loading = false,
  loadingLabel = '处理中...',
  disabled = false,
  leading,
  trailing,
  style,
  onPressIn,
  onPressOut,
  ...pressableProps
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;
  const colors = getVariantColors(variant, tone, isDisabled);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={({ pressed }) => [
        !fullWidth && styles.inlineButton,
        styles.pressable,
        pressed && !isDisabled && styles.pressed,
      ]}
      {...pressableProps}>
      <View
        style={[
          styles.button,
          getSizeStyle(size),
          {
            backgroundColor: colors.backgroundColor,
            borderColor: colors.borderColor,
            alignSelf: fullWidth ? 'stretch' : 'flex-start',
            opacity: isDisabled ? 0.72 : 1,
          },
          style,
        ]}>
        <View
          pointerEvents="none"
          style={[
            styles.highlight,
            {
              backgroundColor: variant === 'ghost' ? 'transparent' : colors.highlight,
              opacity: variant === 'ghost' ? 0 : 0.22,
            },
          ]}
        />
        <View style={styles.inner}>
          {loading ? (
            <ActivityIndicator
              color={colors.textColor}
              size="small"
            />
          ) : (
            leading
          )}
          <ThemedText
            style={[
              styles.label,
              size === 'sm' && styles.labelSmall,
              {
                color: colors.textColor,
              },
            ]}>
            {loading ? loadingLabel : label}
          </ThemedText>
          {loading ? <View style={styles.placeholder} /> : (trailing ?? <View style={styles.placeholder} />)}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  medium: {
    minHeight: 54,
  },
  small: {
    minHeight: 42,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
  },
  large: {
    minHeight: 60,
    borderRadius: 22,
    paddingHorizontal: Spacing.five,
  },
  inlineButton: {
    alignSelf: 'flex-start',
  },
  pressable: {
    borderRadius: 20,
  },
  pressed: {
    transform: [{ scale: 0.982 }, { translateY: 1 }],
  },
  inner: {
    minHeight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: 700,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  labelSmall: {
    fontSize: 14,
    lineHeight: 18,
  },
  placeholder: {
    width: 14,
    height: 14,
  },
  highlight: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    height: '50%',
    borderRadius: 18,
  },
});
