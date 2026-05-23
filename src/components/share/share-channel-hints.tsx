import { StyleSheet, View } from 'react-native';

import type { CollectibleThemeId } from '@/constants/collectible-theme';

import { ThemedText } from '../themed-text';
import { GlowCard } from '../ui/glow-card';
import { SectionHeader } from '../ui/section-header';

type ShareChannelHintsProps = {
  tone?: CollectibleThemeId | 'default';
};

const hintItems = [
  {
    title: '发朋友圈',
    description: '优先使用短句和海报图，首行尽量短，利于停留。',
  },
  {
    title: '发群分享',
    description: '复制正文后补一句个人感受，会更像真实转发。',
  },
  {
    title: '公众号草稿',
    description: '保留标题和正文主体，再按需要继续扩写。',
  },
] as const;

export function ShareChannelHints({ tone = 'default' }: ShareChannelHintsProps) {
  return (
    <GlowCard tone={tone}>
      <SectionHeader
        subtitle="不用切渠道，先知道这些内容更适合怎么发"
        title="微信场景提示"
      />

      <View style={styles.list}>
        {hintItems.map((item) => (
          <View key={item.title} style={styles.row}>
            <ThemedText style={styles.title}>{item.title}</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.description}>
              {item.description}
            </ThemedText>
          </View>
        ))}
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },
  row: {
    gap: 4,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 700,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
  },
});
