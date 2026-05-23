import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import type { CollectibleItem } from '@/types/collectible';

import { ThemedText } from '../themed-text';
import { GlowCard } from '../ui/glow-card';
import { PrimaryButton } from '../ui/primary-button';
import { StatusPill } from '../ui/status-pill';

type CollectibleListItemProps = {
  item: CollectibleItem;
  onPress: () => void;
};

function formatDateLabel(value: string) {
  const date = new Date(value);

  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

export function CollectibleListItem({ item, onPress }: CollectibleListItemProps) {
  return (
    <GlowCard
      interactive
      onPress={onPress}
      padding="sm"
      tone={item.kind}>
      <View style={styles.row}>
        <Image
          contentFit="cover"
          source={{ uri: item.images.thumbnailUrl }}
          style={styles.thumbnail}
        />

        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.badges}>
              <StatusPill
                size="sm"
                status={item.generationStatus}
              />
              {item.isFavorite ? (
                <StatusPill
                  dot={false}
                  label="已收藏"
                  size="sm"
                  tone="gold"
                />
              ) : null}
            </View>
            <StatusPill
              dot={false}
              label={formatDateLabel(item.updatedAt)}
              size="sm"
              tone="default"
            />
          </View>

          <View style={styles.copy}>
            <ThemedText style={styles.title}>{item.title}</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              {item.subtitle}
            </ThemedText>
            <ThemedText themeColor="textMuted" style={styles.meta}>
              {item.siteName} · {item.eraLabel}
            </ThemedText>
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.tagRow}>
              {item.tags.slice(0, 2).map((tag) => (
                <StatusPill
                  key={tag}
                  dot={false}
                  label={tag}
                  size="sm"
                  tone={item.kind}
                />
              ))}
            </View>
            <PrimaryButton
              fullWidth={false}
              label="查看详情"
              onPress={onPress}
              size="sm"
              tone={item.kind}
              variant="ghost"
            />
          </View>
        </View>
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.three,
  },
  thumbnail: {
    width: 96,
    minHeight: 150,
    borderRadius: 18,
  },
  content: {
    flex: 1,
    gap: Spacing.three,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  badges: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  copy: {
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
  meta: {
    fontSize: 13,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  tagRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
