import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import {
  FoundationColors,
  getCollectibleTheme,
  type CollectibleThemeId,
} from '@/constants/collectible-theme';
import { Spacing } from '@/constants/theme';
import { ThemedText } from '../themed-text';
import { SectionHeader } from '../ui/section-header';
import { StatusPill } from '../ui/status-pill';

type StripItem = {
  id: string;
  title: string;
  siteName?: string;
  eraLabel?: string;
  thumbnailUrl?: string;
  generationStatus?: string;
  kind?: string;
  locationStyle?: string;
};

type RecentCollectibleStripProps = {
  items: readonly StripItem[];
  onPressItem: (item: StripItem) => void;
  onPressMore?: () => void;
  tone?: CollectibleThemeId;
  loading?: boolean;
  error?: string | null;
};

const ITEM_GAP = 14;
const LEAD_CARD_WIDTH = 216;
const CARD_WIDTH = 192;
const IMAGE_HEIGHT = 176;

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function RecentCollectibleStrip({
  items,
  onPressItem,
  onPressMore,
  tone = 'ruin',
  loading,
  error,
}: RecentCollectibleStripProps) {
  const theme = getCollectibleTheme(tone);
  const hasItems = items.length > 0;

  return (
    <View style={styles.container}>
      <SectionHeader
        actionLabel={onPressMore ? '查看全部' : undefined}
        onAction={onPressMore}
        subtitle="最近铸造的时空印记，按时间顺序展开。"
        title="近期印记"
        tone={tone}
      />

      {loading ? (
        <View style={styles.emptyWrap}>
          <ThemedText style={styles.emptyText} themeColor="textMuted">
            正在加载时空印记...
          </ThemedText>
        </View>
      ) : error ? (
        <View style={styles.emptyWrap}>
          <ThemedText style={styles.emptyText} themeColor="textMuted">
            无法连接时空印记服务器
          </ThemedText>
        </View>
      ) : hasItems ? (
        <View>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            decelerationRate="fast"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {items.map((item, index) => {
              const isLead = index === 0;
              const cardWidth = isLead ? LEAD_CARD_WIDTH : CARD_WIDTH;
              const isComplete = item.generationStatus === 'complete';
              const isInProgress =
                !isComplete &&
                item.generationStatus !== 'failed' &&
                item.generationStatus !== 'idle';

              return (
                <Pressable
                  key={item.id}
                  onPress={() => onPressItem(item)}
                  style={({ pressed }) => [
                    styles.card,
                    {
                      width: cardWidth,
                      backgroundColor: FoundationColors.backgroundBright,
                      borderColor: withAlpha(theme.primary, 0.16),
                      shadowColor: theme.primary,
                    },
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View style={[styles.imageFrame, { height: IMAGE_HEIGHT }]}>
                    {item.thumbnailUrl ? (
                      <Image
                        contentFit="cover"
                        source={{ uri: item.thumbnailUrl }}
                        style={styles.image}
                        transition={300}
                      />
                    ) : (
                      <View style={[styles.image, styles.imagePlaceholder]} />
                    )}

                    <View style={styles.statusOverlay}>
                      <StatusPill
                        dot={!isComplete}
                        size="sm"
                        status={item.generationStatus}
                      />
                    </View>

                    {isInProgress && (
                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressFill,
                            { backgroundColor: theme.accent },
                          ]}
                        />
                      </View>
                    )}
                  </View>

                  <View style={styles.cardBody}>
                    <ThemedText numberOfLines={1} style={styles.title}>
                      {item.title}
                    </ThemedText>
                    <ThemedText
                      numberOfLines={1}
                      style={styles.meta}
                      themeColor="textSecondary"
                    >
                      {item.siteName} · {item.eraLabel}
                    </ThemedText>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          {items.length > 1 && (
            <View style={styles.progressDots}>
              {items.map((item, i) => (
                <View
                  key={item.id}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        i === 0
                          ? theme.accent
                          : withAlpha(theme.accent, 0.28),
                      width: i === 0 ? 18 : 6,
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.emptyWrap}>
          <ThemedText style={styles.emptyText} themeColor="textMuted">
            暂无近期作品，开始你的第一次创作吧
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  scrollContent: {
    gap: ITEM_GAP,
    paddingHorizontal: Spacing.three,
    paddingBottom: 24,
  },
  // Card
  card: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.975 }],
  },
  // Image
  imageFrame: {
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: 'rgba(176, 138, 89, 0.06)',
  },
  statusOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  progressTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  progressFill: {
    height: '100%',
    width: '60%',
    borderRadius: 999,
  },
  // Card body
  cardBody: {
    padding: 13,
    gap: 3,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 600,
    color: FoundationColors.text,
  },
  meta: {
    fontSize: 13,
    lineHeight: 18,
  },
  // Progress dots
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 999,
  },
  // Empty
  emptyWrap: {
    paddingVertical: Spacing.five,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
