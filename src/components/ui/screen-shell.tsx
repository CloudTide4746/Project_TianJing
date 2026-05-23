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
  headerSlot,
  footer,
  scrollable = true,
  contentContainerStyle,
  style,
  scrollProps,
}: ScreenShellProps) {
  const accentColor = getAccentColor(tone);
  const content = (
    <View style={[styles.content, contentContainerStyle]}>
      {title || subtitle || eyebrow ? (
        <SectionHeader
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
            styles.glowTop,
            {
              backgroundColor: withAlpha(accentColor, 0.16),
            },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.glowBottom,
            {
              backgroundColor: withAlpha(FoundationColors.gold, 0.08),
            },
          ]}
        />
        {scrollable ? (
          <ScrollView
            bounces={false}
            contentContainerStyle={[
              styles.scrollContent,
              footer ? styles.scrollContentWithFooter : null,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            {...scrollProps}>
            {content}
          </ScrollView>
        ) : (
          <View style={styles.staticContent}>{content}</View>
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
  glowTop: {
    position: 'absolute',
    top: -40,
    right: -24,
    width: 180,
    height: 180,
    borderRadius: 999,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -96,
    left: -28,
    width: 220,
    height: 220,
    borderRadius: 999,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
  },
  scrollContentWithFooter: {
    paddingBottom: 136,
  },
  staticContent: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.four,
  },
  footerSafeArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withAlpha(FoundationColors.background, 0.98),
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
