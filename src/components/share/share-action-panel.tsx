import { StyleSheet, View } from 'react-native';

import type { CollectibleThemeId } from '@/constants/collectible-theme';
import { Spacing } from '@/constants/theme';

import { ThemedText } from '../themed-text';
import { GlowCard } from '../ui/glow-card';
import { PrimaryButton } from '../ui/primary-button';
import { SectionHeader } from '../ui/section-header';

type ShareActionPanelProps = {
  tone?: CollectibleThemeId | 'default';
  statusMessage?: string;
  onShare: () => void;
  onCopy: () => void;
  onSave: () => void;
  onBack: () => void;
};

export function ShareActionPanel({
  tone = 'default',
  statusMessage,
  onShare,
  onCopy,
  onSave,
  onBack,
}: ShareActionPanelProps) {
  return (
    <GlowCard tone={tone}>
      <SectionHeader
        subtitle="整理完成后，按微信生态常用顺序操作"
        title="发布操作"
      />

      {statusMessage ? (
        <ThemedText themeColor="textSecondary" style={styles.status}>
          {statusMessage}
        </ThemedText>
      ) : null}

      <View style={styles.primaryAction}>
        <PrimaryButton label="去分享" onPress={onShare} tone={tone} />
      </View>

      <View style={styles.secondaryActions}>
        <PrimaryButton label="复制文案" onPress={onCopy} tone={tone} variant="secondary" />
        <PrimaryButton label="保存图片" onPress={onSave} tone={tone} variant="secondary" />
        <PrimaryButton label="返回作品" onPress={onBack} variant="ghost" />
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  status: {
    fontSize: 12,
    lineHeight: 18,
  },
  primaryAction: {
    gap: Spacing.two,
  },
  secondaryActions: {
    gap: Spacing.two,
  },
});
