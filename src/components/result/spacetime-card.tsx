import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { getLocationTheme, type LocationStyleId } from '@/constants/collectible-theme';
import { Spacing } from '@/constants/theme';
import type { SpacetimeAnchor } from '@/types/collectible';

import { ThemedText } from '../themed-text';
import { GlowCard } from '../ui/glow-card';

dayjs.extend(customParseFormat);

type SpacetimeCardProps = {
  imageUrl: string;
  imageAlt: string;
  anchor: SpacetimeAnchor;
  locationStyle: LocationStyleId;
  collectibleTitle?: string;
  onImagePress?: () => void;
};

function formatTime(ts: string) {
  if (!ts) return '--';
  // Backend may send "YYYY.MM.DD HH:mm" or ISO 8601
  const d = dayjs(ts, 'YYYY.MM.DD HH:mm', true);
  if (d.isValid()) return d.format('YYYY.MM.DD HH:mm');
  const iso = dayjs(ts);
  if (iso.isValid()) return iso.format('YYYY.MM.DD HH:mm');
  return '--';
}

export function SpacetimeCard({ imageUrl, imageAlt, anchor, locationStyle, collectibleTitle, onImagePress }: SpacetimeCardProps) {
  const theme = getLocationTheme(locationStyle);
  const displayTitle = collectibleTitle || anchor.locationName;

  return (
    <GlowCard padding="none" style={styles.card} tone="default">
      {/* AI风格化图像 */}
      <Pressable onPress={onImagePress} disabled={!onImagePress}>
        <Image
          contentFit="cover"
          source={{ uri: imageUrl }}
          style={styles.image}
          accessibilityLabel={imageAlt}
        />
      </Pressable>

      {/* 地点名 */}
      <View style={styles.locationBanner}>
        <ThemedText style={[styles.locationDash, { color: theme.accent }]}>—</ThemedText>
        <ThemedText style={[styles.locationName, { color: theme.primary }]}>
          {displayTitle}
        </ThemedText>
        <ThemedText style={[styles.locationDash, { color: theme.accent }]}>—</ThemedText>
      </View>

      {/* 时空印记区 */}
      <View style={[styles.anchorPanel, { borderColor: theme.accent + '40' }]}>
        <View style={[styles.anchorPanelHeader, { borderBottomColor: theme.accent + '30' }]}>
          <ThemedText style={[styles.anchorPanelTitle, { color: theme.primary }]}>
            时空印记
          </ThemedText>
        </View>

        {/* 数据网格 */}
        <View style={styles.anchorGrid}>
          <AnchorRow label="地点" value={anchor.locationName} />
          <AnchorRow label="时间" value={formatTime(anchor.timestamp)} />
          <AnchorRow label="天气" value={`${anchor.weatherCondition} · ${anchor.temperature}°C`} />
          <AnchorRow label="风" value={`${anchor.windDirection} ${anchor.windLevel}级`} />
          <AnchorRow label="空气" value={`${anchor.aqiLevel} · AQI ${anchor.aqi}`} />
        </View>

        {/* 铸造者序号 */}
        <View style={[styles.mintRow, { borderTopColor: theme.accent + '30' }]}>
          <View style={styles.mintBlock}>
            <ThemedText style={[styles.mintNumber, { color: theme.primary }]}>
              第{anchor.mintNumber}位
            </ThemedText>
            <ThemedText themeColor="textMuted" style={styles.mintLabel}>
              此处铸造者
            </ThemedText>
          </View>
          <View style={[styles.mintDivider, { backgroundColor: theme.accent + '40' }]} />
          <View style={styles.mintBlock}>
            <ThemedText style={[styles.mintNumber, { color: theme.secondary }]}>
              {anchor.earliestImprint}
            </ThemedText>
            <ThemedText themeColor="textMuted" style={styles.mintLabel}>
              最早印记
            </ThemedText>
          </View>
        </View>
      </View>

      {/* 一行金句 */}
      <View style={[styles.goldenLineWrap, { backgroundColor: theme.surface }]}>
        <ThemedText style={[styles.goldenLine, { color: theme.primary }]}>
          "{anchor.goldenLine}"
        </ThemedText>
      </View>
    </GlowCard>
  );
}

function AnchorRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.anchorRow}>
      <ThemedText themeColor="textMuted" style={styles.anchorLabel}>
        {label}
      </ThemedText>
      <ThemedText style={styles.anchorValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 560,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 420,
  },
  locationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  locationDash: {
    fontSize: 20,
    fontWeight: 300,
  },
  locationName: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: 700,
    letterSpacing: 2,
  },
  anchorPanel: {
    marginHorizontal: Spacing.three,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  anchorPanelHeader: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
  },
  anchorPanelTitle: {
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 4,
    textAlign: 'center',
  },
  anchorGrid: {
    padding: Spacing.three,
    gap: 8,
  },
  anchorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  anchorLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  anchorValue: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 600,
  },
  mintRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  mintBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  mintNumber: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 700,
  },
  mintLabel: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1,
  },
  mintDivider: {
    width: 1,
    alignSelf: 'stretch',
  },
  goldenLineWrap: {
    marginHorizontal: Spacing.three,
    marginVertical: Spacing.three,
    borderRadius: 16,
    padding: Spacing.three,
  },
  goldenLine: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: 600,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
