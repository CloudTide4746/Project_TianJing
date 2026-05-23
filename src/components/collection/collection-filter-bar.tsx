import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { collectibleKindOptions } from '@/data/mock-collectibles';
import { Spacing } from '@/constants/theme';
import type { CollectibleFilterValue, CollectibleStatus } from '@/types/collectible';

import { ThemedText } from '../themed-text';
import { GlowCard } from '../ui/glow-card';
import { StatusPill } from '../ui/status-pill';

type CollectionFilterBarProps = {
  kind: CollectibleFilterValue;
  status: CollectibleStatus | 'all';
  resultCount: number;
  onKindChange: (value: CollectibleFilterValue) => void;
  onStatusChange: (value: CollectibleStatus | 'all') => void;
};

const statusOptions: readonly { value: CollectibleStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部状态' },
  { value: 'complete', label: '已完成' },
  { value: 'queued', label: '排队中' },
  { value: 'generating', label: '生成中' },
  { value: 'failed', label: '失败待重试' },
  { value: 'idle', label: '待开始' },
];

function isStatusValue(value: CollectibleStatus | 'all'): value is CollectibleStatus {
  return value !== 'all';
}

export function CollectionFilterBar({
  kind,
  status,
  resultCount,
  onKindChange,
  onStatusChange,
}: CollectionFilterBarProps) {
  return (
    <GlowCard padding="sm" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <ThemedText style={styles.title}>筛选收藏</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            组合藏品类型与生成状态，检索任意一次显影记录。
          </ThemedText>
        </View>
        <StatusPill
          dot={false}
          label={`${resultCount} 件`}
          tone="gold"
        />
      </View>

      <View style={styles.section}>
        <ThemedText themeColor="textMuted" style={styles.label}>
          按类型
        </ThemedText>
        <ScrollView
          contentContainerStyle={styles.row}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <Pressable onPress={() => onKindChange('all')}>
            <StatusPill
              dot={false}
              label="全部"
              tone={kind === 'all' ? 'gold' : 'default'}
            />
          </Pressable>
          {collectibleKindOptions.map((option) => (
            <Pressable key={option.value} onPress={() => onKindChange(option.value)}>
              <StatusPill
                dot={false}
                label={option.label}
                tone={kind === option.value ? option.value : 'default'}
              />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <ThemedText themeColor="textMuted" style={styles.label}>
          按状态
        </ThemedText>
        <ScrollView
          contentContainerStyle={styles.row}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {statusOptions.map((option) => {
            const selected = option.value === status;

            return (
              <Pressable key={option.value} onPress={() => onStatusChange(option.value)}>
                <StatusPill
                  dot={selected && isStatusValue(option.value)}
                  label={option.label}
                  status={selected && isStatusValue(option.value) ? option.value : undefined}
                  tone={
                    selected
                      ? isStatusValue(option.value)
                        ? undefined
                        : 'gold'
                      : 'default'
                  }
                />
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  copy: {
    flex: 1,
    gap: Spacing.one,
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
  section: {
    gap: Spacing.two,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 700,
    letterSpacing: 0.3,
  },
  row: {
    gap: Spacing.two,
    paddingRight: Spacing.two,
  },
});
