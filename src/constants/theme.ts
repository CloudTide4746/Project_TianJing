/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

import { FoundationColors } from '@/constants/collectible-theme';

const productThemeColors = {
  text: FoundationColors.text,
  background: FoundationColors.background,
  backgroundElement: FoundationColors.backgroundElement,
  backgroundLight: FoundationColors.backgroundLight,
  backgroundBright: FoundationColors.backgroundBright,
  backgroundSelected: FoundationColors.backgroundSelected,
  textSecondary: FoundationColors.textSecondary,
  textMuted: FoundationColors.textMuted,
  border: FoundationColors.border,
  success: FoundationColors.success,
  error: FoundationColors.error,
  gold: FoundationColors.gold,
} as const;

export const Colors = {
  light: productThemeColors,
  dark: productThemeColors,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-sans)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-accent)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const MaxContentWidth = 800;
