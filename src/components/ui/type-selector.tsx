import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { collectibleThemeEntries } from '@/constants/collectible-theme';
import { Spacing } from '@/constants/theme';
import type { CollectibleKind } from '@/types/collectible';

import { ThemedText } from '../themed-text';
import { GlowCard } from './glow-card';
import { StatusPill } from './status-pill';

export type TypeSelectorOption = {
  value: CollectibleKind;
  label: string;
  description: string;
  badge?: string;
};

type TypeSelectorProps = {
  value: CollectibleKind;
  onChange: (value: CollectibleKind) => void;
  options?: readonly TypeSelectorOption[];
  disabled?: boolean;
  layout?: 'stack' | 'grid';
  style?: StyleProp<ViewStyle>;
};

const defaultDescriptions: Record<CollectibleKind, string> = {
  ruin: '把遗址轮廓补全成具备空间想象力的重建图。',
  message: '将碎片与痕迹压缩成带情绪张力的遗言卡。',
  crystal: '提炼光、雾与质感，生成可分享的记忆结晶。',
};

const defaultBadges: Record<CollectibleKind, string> = {
  ruin: '空间叙事',
  message: '文案张力',
  crystal: '视觉冲击',
};

const defaultOptions = collectibleThemeEntries.map((theme) => ({
  value: theme.id,
  label: theme.title,
  description: defaultDescriptions[theme.id],
  badge: defaultBadges[theme.id],
})) as readonly TypeSelectorOption[];

export function TypeSelector({
  value,
  onChange,
  options = defaultOptions,
  disabled = false,
  layout = 'stack',
  style,
}: TypeSelectorProps) {
  return (
    <View
      style={[
        styles.container,
        layout === 'grid' && styles.gridContainer,
        style,
      ]}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <View
            key={option.value}
            style={[
              styles.item,
              layout === 'grid' && styles.itemGrid,
            ]}>
            <GlowCard
              disabled={disabled}
              interactive
              onPress={() => onChange(option.value)}
              padding="sm"
              tone={selected ? option.value : 'default'}
              style={selected && styles.selectedCard}>
              <View style={styles.header}>
                <StatusPill
                  label={selected ? '当前选择' : option.badge}
                  size="sm"
                  status={selected ? 'complete' : undefined}
                  tone={selected ? option.value : 'default'}
                />
              </View>
              <View style={styles.copy}>
                <ThemedText style={styles.title}>{option.label}</ThemedText>
                <ThemedText
                  themeColor="textSecondary"
                  style={styles.description}>
                  {option.description}
                </ThemedText>
              </View>
            </GlowCard>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    width: '100%',
  },
  itemGrid: {
    width: '48%',
  },
  selectedCard: {
    borderWidth: 1.2,
  },
  header: {
    alignItems: 'flex-start',
  },
  copy: {
    gap: Spacing.two,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 700,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});
