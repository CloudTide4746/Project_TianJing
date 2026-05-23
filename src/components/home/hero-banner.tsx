import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { getCollectibleTheme } from '@/constants/collectible-theme';
import { Spacing } from '@/constants/theme';
import type { CollectibleItem } from '@/types/collectible';

import { ThemedText } from '../themed-text';
import { GlowCard } from '../ui/glow-card';
import { PrimaryButton } from '../ui/primary-button';
import { StatusPill } from '../ui/status-pill';

type HeroBannerProps = {
  item: CollectibleItem;
  onCreatePress: () => void;
  onExplorePress: () => void;
};

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function HeroBanner({ item, onCreatePress, onExplorePress }: HeroBannerProps) {
  const theme = getCollectibleTheme(item.kind);

  return (
    <GlowCard
      padding="none"
      style={styles.card}
      tone={item.kind}>
      <View style={styles.mediaFrame}>
        <Image
          contentFit="cover"
          source={{ uri: item.images.heroUrl }}
          style={styles.image}
        />
        <View
          pointerEvents="none"
          style={[
            styles.imageTint,
            {
              backgroundColor: withAlpha(theme.secondary, 0.24),
            },
          ]}
        />
        <View style={styles.overlay}>
          <View style={styles.topMeta}>
            <StatusPill
              label="品牌叙事"
              tone={item.kind}
            />
            <StatusPill
              label={theme.title}
              tone="gold"
            />
          </View>

          <View style={styles.copy}>
            <ThemedText style={styles.kicker}>从一张遗址照片开始的显影实验</ThemedText>
            <ThemedText type="subtitle" style={styles.title}>
              让历史碎片，以数字藏品的方式重新发声
            </ThemedText>
            <ThemedText style={styles.description}>
              我们把遗址现场的结构、情绪与时间纹理，转换成可收藏、可分享、可继续创作的作品模板。当前精选故事来自
              {item.siteName}，以 {item.title} 作为首页主叙事样本。
            </ThemedText>
          </View>

          <View style={styles.storyCard}>
            <ThemedText style={styles.storyTitle}>{item.title}</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.storyText}>
              {item.story}
            </ThemedText>
            <View style={styles.storyMeta}>
              <StatusPill
                label={item.eraLabel}
                tone={item.kind}
              />
              <StatusPill
                label={`${item.province} · ${item.district}`}
                tone="default"
              />
            </View>
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              label="开始创作"
              onPress={onCreatePress}
              tone={item.kind}
            />
            <PrimaryButton
              label="浏览收藏"
              onPress={onExplorePress}
              variant="secondary"
              tone={item.kind}
            />
          </View>
        </View>
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 520,
  },
  mediaFrame: {
    minHeight: 520,
    overflow: 'hidden',
    borderRadius: 28,
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  imageTint: {
    ...StyleSheet.absoluteFill,
  },
  overlay: {
    minHeight: 520,
    justifyContent: 'space-between',
    padding: Spacing.four,
    backgroundColor: 'rgba(26, 23, 20, 0.52)',
    gap: Spacing.four,
  },
  topMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  copy: {
    gap: Spacing.three,
  },
  kicker: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 700,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
  },
  description: {
    maxWidth: 520,
    fontSize: 15,
    lineHeight: 23,
  },
  storyCard: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: 20,
    backgroundColor: 'rgba(26, 23, 20, 0.68)',
    borderWidth: 1,
    borderColor: 'rgba(240, 232, 216, 0.12)',
  },
  storyTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 700,
  },
  storyText: {
    fontSize: 14,
    lineHeight: 21,
  },
  storyMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  actions: {
    gap: Spacing.two,
  },
});
