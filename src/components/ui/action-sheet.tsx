import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { CollectibleKind } from '@/types/collectible';
import { Spacing } from '@/constants/theme';

import { ThemedText } from '../themed-text';
import { GlowCard } from './glow-card';
import {
  PrimaryButton,
  type PrimaryButtonVariant,
} from './primary-button';

export type ActionSheetAction = {
  id: string;
  label: string;
  onPress?: () => void;
  variant?: PrimaryButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  tone?: CollectibleKind | 'default';
};

type ActionSheetProps = {
  title?: string;
  description?: string;
  tone?: CollectibleKind | 'default';
  actions: readonly ActionSheetAction[];
  style?: StyleProp<ViewStyle>;
};

export function ActionSheet({
  title = '下一步操作',
  description,
  tone = 'default',
  actions,
  style,
}: ActionSheetProps) {
  return (
    <GlowCard
      padding="sm"
      style={style}
      tone={tone}>
      <View style={styles.copy}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {description ? (
          <ThemedText
            themeColor="textSecondary"
            style={styles.description}>
            {description}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.actions}>
        {actions.map((action) => (
          <PrimaryButton
            key={action.id}
            disabled={action.disabled}
            label={action.label}
            loading={action.loading}
            onPress={action.onPress}
            tone={action.tone ?? tone}
            variant={action.variant ?? 'primary'}
          />
        ))}
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  copy: {
    gap: Spacing.one,
    paddingHorizontal: Spacing.one,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 600,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
  },
  actions: {
    gap: Spacing.two,
  },
});
