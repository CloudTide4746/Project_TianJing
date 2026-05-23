import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';

import type { CollectibleKind } from '@/types/collectible';
import { Spacing } from '@/constants/theme';

import { ThemedText } from '../themed-text';
import { GlowCard } from './glow-card';
import { PrimaryButton } from './primary-button';
import { StatusPill } from './status-pill';

type UploadDropzoneProps = {
  imageUri?: string | null;
  onPick: () => void;
  onRemove?: () => void;
  onReplace?: () => void;
  title?: string;
  description?: string;
  hint?: string;
  errorMessage?: string;
  tone?: CollectibleKind | 'default';
  aspectRatio?: number;
  style?: StyleProp<ViewStyle>;
};

export function UploadDropzone({
  imageUri,
  onPick,
  onRemove,
  onReplace,
  title = '上传遗址照片',
  description = '支持 JPG / PNG，建议使用竖构图，方便后续生成海报与结果页主图。',
  hint = '可先用 mock 图占位，后续再接真实选择器。',
  errorMessage,
  tone = 'default',
  aspectRatio = 4 / 5,
  style,
}: UploadDropzoneProps) {
  const replaceAction = onReplace ?? onPick;
  const hasImage = Boolean(imageUri);

  return (
    <GlowCard
      interactive={!hasImage}
      onPress={!hasImage ? onPick : undefined}
      tone={errorMessage ? 'error' : tone}
      style={style}>
      <View style={styles.header}>
        <StatusPill
          label={hasImage ? '已载入预览' : '等待上传'}
          status={hasImage ? 'complete' : 'idle'}
          tone={errorMessage ? 'error' : tone}
        />
      </View>

      {hasImage ? (
        <Image
          contentFit="cover"
          source={{ uri: imageUri ?? undefined }}
          style={[
            styles.preview,
            {
              aspectRatio,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              aspectRatio,
            },
          ]}>
          <View style={styles.placeholderBadge}>
            <ThemedText style={styles.plus}>+</ThemedText>
          </View>
          <View style={styles.placeholderCopy}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <ThemedText
              themeColor="textSecondary"
              style={styles.description}>
              {description}
            </ThemedText>
          </View>
        </View>
      )}

      <View style={styles.copy}>
        {hasImage ? (
          <>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <ThemedText
              themeColor="textSecondary"
              style={styles.description}>
              {description}
            </ThemedText>
          </>
        ) : null}
        <ThemedText
          themeColor={errorMessage ? 'error' : 'textMuted'}
          style={styles.hint}>
          {errorMessage ?? hint}
        </ThemedText>
      </View>

      {hasImage ? (
        <View style={styles.actions}>
          <PrimaryButton
            fullWidth={false}
            label="替换照片"
            onPress={replaceAction}
            size="sm"
            tone={tone}
            variant="secondary"
          />
          {onRemove ? (
            <PrimaryButton
              fullWidth={false}
              label="移除"
              onPress={onRemove}
              size="sm"
              variant="ghost"
            />
          ) : null}
        </View>
      ) : (
        <PrimaryButton
          label="选择照片"
          onPress={onPick}
          tone={tone}
        />
      )}
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-start',
  },
  preview: {
    width: '100%',
    borderRadius: 20,
  },
  placeholder: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(168, 152, 128, 0.28)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },
  placeholderBadge: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 168, 83, 0.12)',
  },
  plus: {
    fontSize: 28,
    lineHeight: 28,
    fontWeight: 700,
  },
  placeholderCopy: {
    gap: Spacing.two,
    alignItems: 'center',
  },
  copy: {
    gap: Spacing.two,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 700,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
