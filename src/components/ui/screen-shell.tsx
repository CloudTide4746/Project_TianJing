import type { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  FoundationColors,
  getCollectibleTheme,
  type CollectibleThemeId,
} from '@/constants/collectible-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';

import { SectionHeader } from './section-header';

type ScreenShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  tone?: CollectibleThemeId | 'default';
  headerDensity?: 'default' | 'compact';
  headerSlot?: ReactNode;
  footer?: ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  scrollProps?: Omit<ScrollViewProps, 'children' | 'contentContainerStyle'>;
};

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function getAccentColor(tone: CollectibleThemeId | 'default') {
  return tone === 'default' ? FoundationColors.gold : getCollectibleTheme(tone).primary;
}

export function ScreenShell({
  children,
  title,
  subtitle,
  eyebrow,
  tone = 'default',
  headerDensity = 'default',
  headerSlot,
  footer,
  scrollable = true,
  contentContainerStyle,
  style,
  scrollProps,
}: ScreenShellProps) {
  const accentColor = getAccentColor(tone);
  const isCompactHeader = headerDensity === 'compact';
  const content = (
    <View
      style={[
        styles.content,
        isCompactHeader && styles.contentCompact,
        contentContainerStyle,
      ]}>
      {title || subtitle || eyebrow ? (
        <SectionHeader
          density={headerDensity}
          eyebrow={eyebrow}
          subtitle={subtitle}
          title={title ?? ''}
          tone={tone}
        />
      ) : null}
      {headerSlot}
      {children}
    </View>
  );

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, style]}>
      <View style={styles.root}>
        <View
          pointerEvents="none"
          style={[
            styles.inkWash,
            { backgroundColor: withAlpha(accentColor, 0.1) },
          ]}
        />
        <View
          pointerEvents="none"
          style={styles.paperGlow}
        />
        <View
          pointerEvents="none"
          style={styles.frame}
        />
        {scrollable ? (
          <ScrollView
            bounces={false}
            contentContainerStyle={[
              styles.scrollContent,
              isCompactHeader && styles.scrollContentCompact,
              footer ? styles.scrollContentWithFooter : null,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            {...scrollProps}>
            {content}
          </ScrollView>
        ) : (
          <View style={[styles.staticContent, isCompactHeader && styles.staticContentCompact]}>
            {content}
          </View>
        )}

        {footer ? (
          <SafeAreaView
            edges={['bottom']}
            style={styles.footerSafeArea}>
            <View style={styles.footer}>{footer}</View>
          </SafeAreaView>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: FoundationColors.background,
  },
  root: {
    flex: 1,
    backgroundColor: FoundationColors.background,
  },
  inkWash: {
    position: 'absolute',
    top: -64,
    right: -40,
    width: 240,
    height: 240,
    borderRadius: 999,
  },
  paperGlow: {
    position: 'absolute',
    left: -72,
    bottom: 80,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: withAlpha(FoundationColors.backgroundBright, 0.72),
  },
  frame: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    bottom: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: withAlpha(FoundationColors.border, 0.62),
    borderRadius: 28,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
  },
  scrollContentCompact: {
    paddingTop: 14,
  },
  scrollContentWithFooter: {
    paddingBottom: 150,
  },
  staticContent: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
  },
  staticContentCompact: {
    paddingTop: 14,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: 28,
  },
  contentCompact: {
    gap: 18,
  },
  footerSafeArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withAlpha(FoundationColors.backgroundBright, 0.94),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: withAlpha(FoundationColors.border, 0.8),
  },
  footer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
  },
});
