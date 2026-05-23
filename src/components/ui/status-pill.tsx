import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import {
  FoundationColors,
  getCollectibleTheme,
  type CollectibleThemeId,
} from '@/constants/collectible-theme';
import { Fonts, Spacing } from '@/constants/theme';
import type { CollectibleStatus } from '@/types/collectible';

import { ThemedText } from '../themed-text';

export type StatusPillTone =
  | CollectibleThemeId
  | 'default'
  | 'muted'
  | 'gold'
  | 'success'
  | 'error';

export type StatusPillSize = 'sm' | 'md';

type StatusPillProps = {
  label?: string;
  status?: CollectibleStatus;
  tone?: StatusPillTone;
  size?: StatusPillSize;
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
};

const statusLabelMap: Record<CollectibleStatus, string> = {
  idle: '待开始',
  queued: '排队中',
  generating: '生成中',
  complete: '已完成',
  failed: '失败待重试',
};

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function resolveTone(status?: CollectibleStatus, tone?: StatusPillTone): Exclude<StatusPillTone, 'muted' | 'default'> | 'muted' | 'default' {
  if (tone) {
    return tone;
  }

  switch (status) {
    case 'complete':
      return 'success';
    case 'failed':
      return 'error';
    case 'generating':
      return 'gold';
    case 'queued':
      return 'default';
    case 'idle':
    default:
      return 'muted';
  }
}

function getToneColors(resolvedTone: StatusPillTone) {
  if (resolvedTone === 'gold') {
    return {
      borderColor: withAlpha(FoundationColors.gold, 0.5),
      backgroundColor: withAlpha(FoundationColors.gold, 0.12),
      textColor: FoundationColors.gold,
      dotColor: FoundationColors.gold,
    };
  }

  if (resolvedTone === 'success') {
    return {
      borderColor: withAlpha(FoundationColors.success, 0.45),
      backgroundColor: withAlpha(FoundationColors.success, 0.12),
      textColor: FoundationColors.success,
      dotColor: FoundationColors.success,
    };
  }

  if (resolvedTone === 'error') {
    return {
      borderColor: withAlpha(FoundationColors.error, 0.45),
      backgroundColor: withAlpha(FoundationColors.error, 0.12),
      textColor: FoundationColors.error,
      dotColor: FoundationColors.error,
    };
  }

  if (resolvedTone === 'muted') {
    return {
      borderColor: withAlpha(FoundationColors.border, 0.92),
      backgroundColor: withAlpha(FoundationColors.backgroundSelected, 0.78),
      textColor: FoundationColors.textMuted,
      dotColor: FoundationColors.textMuted,
    };
  }

  if (resolvedTone === 'default') {
    return {
      borderColor: withAlpha(FoundationColors.border, 0.92),
      backgroundColor: withAlpha(FoundationColors.backgroundSelected, 0.62),
      textColor: FoundationColors.textSecondary,
      dotColor: FoundationColors.gold,
    };
  }

  const theme = getCollectibleTheme(resolvedTone);
  return {
    borderColor: withAlpha(theme.primary, 0.45),
    backgroundColor: withAlpha(theme.primary, 0.12),
    textColor: theme.accent,
    dotColor: theme.primary,
  };
}

export function StatusPill({
  label,
  status,
  tone,
  size = 'md',
  dot = true,
  style,
}: StatusPillProps) {
  const resolvedTone = resolveTone(status, tone);
  const colors = getToneColors(resolvedTone);
  const content = label ?? (status ? statusLabelMap[status] : '状态');

  return (
    <View
      style={[
        styles.base,
        size === 'sm' ? styles.small : styles.medium,
        {
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
        },
        style,
      ]}>
      {dot ? (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: colors.dotColor,
            },
          ]}
        />
      ) : null}
      <ThemedText
        style={[
          styles.label,
          size === 'sm' && styles.labelSmall,
          {
            color: colors.textColor,
          },
        ]}>
        {content}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    gap: Spacing.two,
  },
  medium: {
    minHeight: 32,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  small: {
    minHeight: 26,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  label: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 14,
  },
});
