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
  leading?: ReactNode;
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function getVariantColors(
  variant: PrimaryButtonVariant,
  tone: CollectibleThemeId | 'default',
  disabled: boolean,
) {
  const accent = tone === 'default' ? FoundationColors.gold : getCollectibleTheme(tone).primary;

  if (disabled) {
    return {
      backgroundColor: FoundationColors.backgroundSelected,
      borderColor: FoundationColors.border,
      textColor: FoundationColors.textMuted,
    };
  }

  switch (variant) {
    case 'secondary':
      return {
        backgroundColor: FoundationColors.backgroundElement,
        borderColor: accent,
        textColor: FoundationColors.text,
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        borderColor: FoundationColors.border,
        textColor: FoundationColors.textSecondary,
      };
    case 'destructive':
      return {
        backgroundColor: FoundationColors.error,
        borderColor: FoundationColors.error,
        textColor: FoundationColors.text,
      };
    case 'primary':
    default:
      return {
        backgroundColor: accent,
        borderColor: accent,
        textColor: FoundationColors.background,
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
            {loading ? '处理中...' : label}
          </ThemedText>
          {loading ? <View style={styles.placeholder} /> : (trailing ?? <View style={styles.placeholder} />)}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  medium: {
    minHeight: 52,
  },
  small: {
    minHeight: 42,
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
  },
  large: {
    minHeight: 58,
    borderRadius: 20,
    paddingHorizontal: Spacing.five,
  },
  inlineButton: {
    alignSelf: 'flex-start',
  },
  pressed: {
    transform: [{ scale: 0.985 }],
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
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 700,
    textAlign: 'center',
  },
  labelSmall: {
    fontSize: 14,
    lineHeight: 18,
  },
  placeholder: {
    width: 14,
    height: 14,
  },
});
