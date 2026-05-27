import { StyleSheet, View } from 'react-native';

import { getLocationTheme, type LocationStyleId } from '@/constants/collectible-theme';
import { Spacing } from '@/constants/theme';
import type { CollectibleShareContent, SpacetimeAnchor } from '@/types/collectible';

import { ThemedText } from '../themed-text';
import { GlowCard } from '../ui/glow-card';
import { SpacetimeCard } from '../result/spacetime-card';

type SharePosterPreviewProps = {
  imageUrl: string;
  imageAlt: string;
  anchor: SpacetimeAnchor;
  locationStyle: LocationStyleId;
  isCirculating?: boolean;
  shareContent?: CollectibleShareContent;
};

export function SharePosterPreview({
  imageUrl,
  imageAlt,
  anchor,
  locationStyle,
  isCirculating = false,
  shareContent,
}: SharePosterPreviewProps) {
  const theme = getLocationTheme(locationStyle);

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.previewTitle}>海报预览</ThemedText>
        <ThemedText themeColor="textMuted" style={styles.previewHint}>
          适合朋友圈 / 群分享
        </ThemedText>
      </View>

      <SpacetimeCard
        anchor={anchor}
        imageAlt={imageAlt}
        imageUrl={imageUrl}
        locationStyle={locationStyle}
      />

      <GlowCard padding="sm" tone="default">
        <View style={styles.shareCopyHeader}>
          <ThemedText style={styles.shareCopyTitle}>分享文案</ThemedText>
          <ThemedText themeColor="textMuted" style={styles.autoTag}>
            {isCirculating ? 'AI 生成' : '用户编写'}
          </ThemedText>
        </View>
        <View style={[styles.shareTextBox, { backgroundColor: theme.surface }]}>
          {shareContent?.title ? (
            <ThemedText style={[styles.shareTitle, { color: theme.primary }]}>
              {shareContent.title}
            </ThemedText>
          ) : null}
          {shareContent?.caption ? (
            <ThemedText style={[styles.shareCaption, { color: theme.secondary }]}>
              {shareContent.caption}
            </ThemedText>
          ) : null}
          {shareContent?.callToAction ? (
            <ThemedText style={[styles.cta, { color: theme.primary }]}>
              {shareContent.callToAction}
            </ThemedText>
          ) : null}
          {shareContent?.hashtags && shareContent.hashtags.length > 0 ? (
            <ThemedText style={[styles.hashtags, { color: theme.secondary }]}>
              {shareContent.hashtags.map((t) => `#${t}`).join(' ')}
            </ThemedText>
          ) : null}
        </View>
      </GlowCard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.three,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  previewTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 700,
  },
  previewHint: {
    fontSize: 12,
    lineHeight: 16,
  },
  shareCopyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shareCopyTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 700,
  },
  autoTag: {
    fontSize: 11,
    lineHeight: 14,
  },
  shareTextBox: {
    borderRadius: 16,
    padding: Spacing.three,
    marginTop: Spacing.two,
    gap: Spacing.two,
  },
  shareTitle: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: 700,
    textAlign: 'center',
  },
  shareCaption: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: 400,
    textAlign: 'center',
  },
  goldenLine: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: 500,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  cta: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: 600,
    textAlign: 'center',
  },
  hashtags: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: 500,
    textAlign: 'center',
  },
});
