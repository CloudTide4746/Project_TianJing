import { Image } from 'expo-image';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import type { CollectibleItem } from '@/types/collectible';

import { ThemedText } from '../themed-text';
import { GlowCard } from '../ui/glow-card';
import { SectionHeader } from '../ui/section-header';
import { StatusPill } from '../ui/status-pill';

type RecentCollectibleStripProps = {
  items: readonly CollectibleItem[];
  onPressItem: (item: CollectibleItem) => void;
  onPressMore?: () => void;
};

function formatCompactDate(value: string) {
  const date = new Date(value);

  return `${date.getMonth() + 1}.${date.getDate()}`;
}

export function RecentCollectibleStrip({
  items,
  onPressItem,
  onPressMore,
}: RecentCollectibleStripProps) {
  return (
    <View style={styles.container}>
      <SectionHeader
        actionLabel={onPressMore ? '查看全部' : undefined}
        onAction={onPressMore}
        subtitle="最近完成或仍在显影中的作品，保留移动端快速扫览的节奏。"
        title="最近作品"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {items.map((item) => (
          <GlowCard
            interactive
            key={item.id}
            onPress={() => onPressItem(item)}
            padding="none"
            style={styles.card}
            tone={item.kind}>
            <Image
              contentFit="cover"
              source={{ uri: item.images.thumbnailUrl }}
              style={styles.image}
            />
            <View style={styles.cardCopy}>
              <View style={styles.metaRow}>
                <StatusPill
                  size="sm"
                  status={item.generationStatus}
                />
                <StatusPill
                  dot={false}
                  label={formatCompactDate(item.updatedAt)}
                  size="sm"
                  tone="default"
                />
              </View>
              <View style={styles.textBlock}>
                <ThemedText style={styles.title}>{item.title}</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                  {item.shortDescription}
                </ThemedText>
              </View>
              <ThemedText themeColor="textMuted" style={styles.caption}>
                {item.siteName}
              </ThemedText>
            </View>
          </GlowCard>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  scrollContent: {
    gap: Spacing.three,
    paddingRight: Spacing.three,
  },
  card: {
    width: 248,
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardCopy: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  textBlock: {
    gap: Spacing.two,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
  },
});
