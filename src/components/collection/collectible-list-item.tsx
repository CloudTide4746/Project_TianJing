import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { ThemedText } from '../themed-text';
import { GlowCard } from '../ui/glow-card';
import { PrimaryButton } from '../ui/primary-button';
import { StatusPill } from '../ui/status-pill';

type ListItemData = {
  id: string;
  kind?: string;
  title?: string;
  subtitle?: string;
  siteName?: string;
  eraLabel?: string;
  thumbnailUrl?: string;
  generationStatus?: string;
  isFavorite?: boolean;
  tags?: string[];
  updatedAt?: string;
  createdAt?: string;
};

type CollectibleListItemProps = {
  item: ListItemData;
  onPress: () => void;
};

function formatDateLabel(value?: string) {
  if (!value) return '--';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '--';
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

function getDisplayTitle(item: ListItemData): string {
  return item.title || item.siteName || '';
}

export function CollectibleListItem({ item, onPress }: CollectibleListItemProps) {
  return (
    <GlowCard
      interactive
      onPress={onPress}
      padding="sm"
      tone={item.kind}>
      <View style={styles.row}>
        {item.thumbnailUrl ? (
          <Image
            contentFit="cover"
            source={{ uri: item.thumbnailUrl }}
            style={styles.thumbnail}
          />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailPlaceholder]} />
        )}

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
            <ThemedText style={styles.title}>{getDisplayTitle(item)}</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              {item.subtitle}
            </ThemedText>
            <ThemedText themeColor="textMuted" style={styles.meta}>
              {item.siteName} · {item.eraLabel}
            </ThemedText>
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.tagRow}>
              {(item.tags ?? []).slice(0, 2).map((tag) => (
                <StatusPill
                  key={tag}
                  dot={false}
                  label={tag}
                  size="sm"
                  tone={(item.kind as any) ?? 'ruin'}
                />
              ))}
            </View>
            <PrimaryButton
              fullWidth={false}
              label="查看详情"
              onPress={onPress}
              size="sm"
              tone={(item.kind as any) ?? 'ruin'}
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
    width: 104,
    minHeight: 156,
    borderRadius: 20,
  },
  thumbnailPlaceholder: {
    backgroundColor: 'rgba(176, 138, 89, 0.06)',
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
    lineHeight: 26,
    fontWeight: 600,
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
