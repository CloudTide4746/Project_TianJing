import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { FoundationColors } from '@/constants/collectible-theme';
import { Spacing } from '@/constants/theme';

import { ThemedText } from '../themed-text';

type CollapsibleSectionProps = {
  title: string;
  subtitle?: string;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export function CollapsibleSection({
  title,
  subtitle,
  expanded,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [
          styles.header,
          pressed && styles.headerPressed,
        ]}
      >
        <View style={styles.headerLeft}>
          <ThemedText style={styles.chevron}>
            {expanded ? '▾' : '▸'}
          </ThemedText>
          <View style={styles.headerCopy}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            {subtitle ? (
              <ThemedText themeColor="textMuted" style={styles.subtitle}>
                {subtitle}
              </ThemedText>
            ) : null}
          </View>
        </View>
        <ThemedText themeColor="textMuted" style={styles.hint}>
          {expanded ? '收起' : '展开'}
        </ThemedText>
      </Pressable>
      {expanded ? (
        <View style={styles.body}>{children}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(176, 138, 89, 0.18)',
    paddingTop: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  headerPressed: {
    opacity: 0.7,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chevron: {
    fontSize: 14,
    lineHeight: 18,
    color: FoundationColors.gold,
    width: 16,
  },
  headerCopy: {
    gap: 2,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  hint: {
    fontSize: 11,
    lineHeight: 14,
  },
  body: {
    paddingTop: Spacing.two,
    gap: Spacing.two,
  },
});
