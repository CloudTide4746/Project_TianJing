import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';

import { ThemedText } from '../themed-text';
import { GlowCard } from '../ui/glow-card';
import { StatusPill } from '../ui/status-pill';

type CollectionFilterBarProps = {
  kind: string;
  status: string;
  resultCount: number;
  onKindChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

const kindOptions: readonly { value: string; label: string; accent: string }[] = [
  { value: 'all', label: '全部类型', accent: '#b08a59' },
  { value: 'ruin', label: '废墟重建图', accent: '#9f7a59' },
  { value: 'message', label: '遗址遗言卡', accent: '#9a5547' },
  { value: 'crystal', label: '记忆结晶', accent: '#5e8783' },
];

const statusOptions: readonly { value: string; label: string }[] = [
  { value: 'all', label: '全部状态' },
  { value: 'complete', label: '已完成' },
  { value: 'queued', label: '排队中' },
  { value: 'generating', label: '生成中' },
  { value: 'failed', label: '失败待重试' },
];


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
            组合藏品类型与生成状态，快速找回任意一次显影记录。
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
          {kindOptions.filter(o => o.value !== 'all').map((option) => (
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
                  dot={selected && option.value !== 'all'}
                  label={option.label}
                  status={selected && option.value !== 'all' ? (option.value as any) : undefined}
                  tone={selected ? (option.value !== 'all' ? undefined : 'gold') : 'default'}
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
    fontWeight: 600,
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
