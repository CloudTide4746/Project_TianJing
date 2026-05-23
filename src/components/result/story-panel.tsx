import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';

import { ThemedText } from '../themed-text';
import { GlowCard } from '../ui/glow-card';
import { SectionHeader } from '../ui/section-header';
import { StatusPill } from '../ui/status-pill';

type StoryPanelProps = {
  story: string;
  tags: readonly string[];
  materialKeywords: readonly string[];
  collectorNote?: string;
  tone?: 'ruin' | 'message' | 'crystal' | 'default';
};

export function StoryPanel({
  story,
  tags,
  materialKeywords,
  collectorNote,
  tone = 'default',
}: StoryPanelProps) {
  return (
    <GlowCard tone={tone}>
      <SectionHeader
        subtitle="把生成后的主叙事、标签和材质线索聚合在同一块结果面板里，方便详情页与分享页复用。"
        title="作品故事"
        trailing={
          <StatusPill
            dot={false}
            label={`${tags.length} 个标签`}
            tone={tone}
          />
        }
      />

      <ThemedText style={styles.story}>{story}</ThemedText>

      <View style={styles.block}>
        <ThemedText style={styles.blockTitle}>标签</ThemedText>
        <View style={styles.tagRow}>
          {tags.map((tag) => (
            <StatusPill
              key={tag}
              dot={false}
              label={tag}
              tone={tone}
            />
          ))}
        </View>
      </View>

      <View style={styles.block}>
        <ThemedText style={styles.blockTitle}>材质线索</ThemedText>
        <View style={styles.tagRow}>
          {materialKeywords.map((keyword) => (
            <StatusPill
              key={keyword}
              dot={false}
              label={keyword}
              tone="default"
            />
          ))}
        </View>
      </View>

      {collectorNote ? (
        <View style={styles.note}>
          <ThemedText style={styles.blockTitle}>收藏备注</ThemedText>
          <ThemedText
            themeColor="textSecondary"
            style={styles.noteText}>
            {collectorNote}
          </ThemedText>
        </View>
      ) : null}
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  story: {
    fontSize: 15,
    lineHeight: 26,
  },
  block: {
    gap: Spacing.two,
  },
  blockTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 600,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  note: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 253, 248, 0.72)',
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
