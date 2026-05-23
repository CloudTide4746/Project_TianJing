import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';

import type { CollectibleKind } from '@/types/collectible';
import { Spacing } from '@/constants/theme';

import { ThemedText } from '../themed-text';
import { ArtImage } from './art-image';
import { GlowCard, type GlowCardPadding } from './glow-card';
import { PrimaryButton } from './primary-button';
import { StatusPill } from './status-pill';

type UploadDropzoneProps = {
  imageUri?: string | null;
  onPick: () => void;
  onPickFromGallery?: () => void;
  onRemove?: () => void;
  onReplace?: () => void;
  title?: string;
  description?: string;
  hint?: string;
  errorMessage?: string;
  tone?: CollectibleKind | 'default';
  aspectRatio?: number;
  padding?: GlowCardPadding;
  style?: StyleProp<ViewStyle>;
  artPlaceholderUri?: string | null;
};

export function UploadDropzone({
  imageUri,
  onPick,
  onPickFromGallery,
  onRemove,
  onReplace,
  title = '上传遗址照片',
  description = '支持拍照或相册导入',
  hint = '建议选择主体明确的照片',
  errorMessage,
  tone = 'default',
  aspectRatio = 16 / 9,
  padding = 'sm',
  style,
  artPlaceholderUri,
}: UploadDropzoneProps) {
  const replaceAction = onReplace ?? onPick;
  const hasImage = Boolean(imageUri);

  return (
    <GlowCard
      padding={padding}
      tone={errorMessage ? 'error' : tone}
      style={style}>
      <View style={styles.header}>
        <StatusPill
          size="sm"
          label={hasImage ? '已载入预览' : '上传照片'}
          status={hasImage ? 'complete' : 'idle'}
          tone={errorMessage ? 'error' : tone}
        />
      </View>

      {hasImage ? (
        <Image
          contentFit="cover"
          source={imageUri}
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
          {artPlaceholderUri ? (
            <View style={styles.artBackground}>
              <ArtImage
                borderRadius={20}
                contentFit="cover"
                opacity={0.38}
                src={artPlaceholderUri}
                style={styles.artBackgroundImage}
              />
              <View style={styles.artOverlay} />
            </View>
          ) : null}
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
            label="重选"
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
        <View style={styles.actions}>
          <PrimaryButton
            fullWidth={false}
            label="拍照"
            onPress={onPick}
            size="sm"
            tone={tone}
            variant="secondary"
          />
          {onPickFromGallery ? (
            <PrimaryButton
              fullWidth={false}
              label="相册"
              onPress={onPickFromGallery}
              size="sm"
              tone={tone}
              variant="secondary"
            />
          ) : null}
        </View>
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
    borderRadius: 18,
    maxHeight: 280,
  },
  placeholder: {
    width: '100%',
    maxHeight: 280,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(176, 138, 89, 0.18)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: Spacing.three,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 253, 248, 0.48)',
    overflow: 'hidden',
  },
  artBackground: {
    ...StyleSheet.absoluteFill,
  },
  artBackgroundImage: {
    width: '100%',
    height: '100%',
  },
  artOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(251, 248, 242, 0.64)',
  },
  placeholderBadge: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(176, 138, 89, 0.1)',
  },
  plus: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: 600,
  },
  placeholderCopy: {
    gap: Spacing.one,
    alignItems: 'center',
  },
  copy: {
    gap: Spacing.one,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 600,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  hint: {
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    alignItems: 'center',
  },
});
