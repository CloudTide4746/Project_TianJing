import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import type { CollectibleItem } from '@/types/collectible';

import { ThemedText } from '../themed-text';
import { GlowCard } from '../ui/glow-card';
import { StatusPill } from '../ui/status-pill';

type ResultHeroProps = {
  item: CollectibleItem;
};

export function ResultHero({ item }: ResultHeroProps) {
  return (
    <GlowCard
      padding="none"
      style={styles.card}
      tone={item.kind}>
      <Image
        contentFit="cover"
        source={{ uri: item.images.heroUrl }}
        style={styles.image}
      />

      <View style={styles.overlay}>
        <View style={styles.metaRow}>
          <StatusPill
            dot={false}
            label={item.siteName}
            tone={item.kind}
          />
          <StatusPill status={item.generationStatus} />
        </View>

        <View style={styles.copy}>
          <ThemedText style={styles.title}>{item.title}</ThemedText>
          <ThemedText
            themeColor="textSecondary"
            style={styles.subtitle}>
            {item.subtitle}
          </ThemedText>
          <ThemedText
            themeColor="textSecondary"
            style={styles.description}>
            {item.shortDescription}
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <View style={styles.infoGroup}>
            <ThemedText
              themeColor="textMuted"
              style={styles.infoLabel}>
              地点
            </ThemedText>
            <ThemedText style={styles.infoValue}>
              {item.province} · {item.district}
            </ThemedText>
          </View>
          <View style={styles.infoGroup}>
            <ThemedText
              themeColor="textMuted"
              style={styles.infoLabel}>
              时代表记
            </ThemedText>
            <ThemedText style={styles.infoValue}>{item.eraLabel}</ThemedText>
          </View>
          <View style={styles.infoGroup}>
            <ThemedText
              themeColor="textMuted"
              style={styles.infoLabel}>
              数据表现
            </ThemedText>
            <ThemedText style={styles.infoValue}>
              {item.metrics.viewCount} 浏览 · {item.metrics.shareCount} 分享
            </ThemedText>
          </View>
        </View>
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 560,
  },
  image: {
    width: '100%',
    height: 560,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    padding: Spacing.four,
    backgroundColor: 'rgba(246, 242, 233, 0.16)',
    gap: Spacing.four,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  copy: {
    marginTop: 'auto',
    gap: Spacing.two,
  },
  title: {
    fontSize: 34,
    lineHeight: 44,
    fontWeight: 600,
  },
  subtitle: {
    maxWidth: 520,
    fontSize: 17,
    lineHeight: 24,
  },
  description: {
    maxWidth: 560,
    fontSize: 14,
    lineHeight: 21,
  },
  footer: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 253, 248, 0.86)',
    borderWidth: 1,
    borderColor: 'rgba(216, 206, 192, 0.72)',
  },
  infoGroup: {
    gap: Spacing.one,
  },
  infoLabel: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
  },
  infoValue: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: 600,
  },
});
