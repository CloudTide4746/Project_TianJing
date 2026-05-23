import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

import { SharePosterPreview } from '@/components/share/share-poster-preview';
import { ThemedText } from '@/components/themed-text';
import { EmptyState } from '@/components/ui/empty-state';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ScreenShell } from '@/components/ui/screen-shell';
import { Spacing } from '@/constants/theme';
import { getCollectible, type CollectibleItem } from '@/services/api';

function buildShareText(item: CollectibleItem): string {
  const parts: string[] = [];

  if (item.share.title) parts.push(item.share.title);
  if (item.share.caption) parts.push(item.share.caption);
  if (item.share.callToAction) parts.push(item.share.callToAction);
  if (item.share.hashtags.length > 0) parts.push(item.share.hashtags.map((t) => `#${t}`).join(' '));

  return parts.join('\n\n');
}

export default function ShareScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const resolvedId = typeof params.id === 'string' ? params.id : undefined;

  const [item, setItem] = useState<CollectibleItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('海报与文案已就绪，可直接分享。');

  useEffect(() => {
    if (!resolvedId) {
      setError('无效链接');
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await getCollectible(resolvedId);
        setItem(data);
      } catch (err: any) {
        setError(err?.message || '加载失败');
      } finally {
        setLoading(false);
      }
    })();
  }, [resolvedId]);

  const isCirculating = item?.generationStatus === 'complete';

  const shareText = useMemo(() => (item ? buildShareText(item) : ''), [item]);

  const shareImageAndText = useCallback(async () => {
    if (!item) return;
    try {
      setStatusMessage('文案已复制到剪贴板，正在准备图片...');

      await Clipboard.setStringAsync(shareText);

      const localUri = `${FileSystem.cacheDirectory}share-${item.id}.jpg`;
      await FileSystem.downloadAsync(item.images.shareUrl, localUri);

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        setStatusMessage('当前平台不支持文件分享，但文案已复制。');
        return;
      }

      await Sharing.shareAsync(localUri, {
        mimeType: 'image/jpeg',
        dialogTitle: item.share.title || item.title,
      });

      setStatusMessage('分享完成！文案在剪贴板中，可直接粘贴到微信。');
    } catch (e: any) {
      if (e?.message?.includes('User did not share') || e?.message?.includes('cancel')) {
        setStatusMessage('分享取消。文案仍在剪贴板中，可稍后粘贴。');
      } else {
        setStatusMessage(`分享失败: ${e?.message || ''}`);
      }
    }
  }, [item, shareText]);

  const copyTextOnly = useCallback(async () => {
    if (!shareText) return;
    try {
      await Clipboard.setStringAsync(shareText);
      setStatusMessage('文案已复制到剪贴板，可直接粘贴到微信。');
    } catch (e: any) {
      setStatusMessage(`复制失败: ${e?.message || ''}`);
    }
  }, [shareText]);

  if (loading) {
    return (
      <ScreenShell eyebrow="分享" subtitle="正在加载印记数据..." title="分享刻迹">
        <EmptyState
          badge="加载中"
          description="正在连接刻迹服务器..."
          title="加载中"
          tone="default"
        />
      </ScreenShell>
    );
  }

  if (error || !item) {
    return (
      <ScreenShell eyebrow="分享" subtitle="当前链接没有找到可分享的刻迹。" title="印记不存在">
        <EmptyState
          actionLabel="返回收藏"
          badge="无效链接"
          description="这件刻迹可能还未铸造完成，或链接已失效。"
          onAction={() => router.replace('/explore' as never)}
          onSecondaryAction={() => router.replace('/create' as never)}
          secondaryActionLabel="开始创作"
          title="没有找到对应印记"
          tone="default"
        />
      </ScreenShell>
    );
  }

  const footer = (
    <View style={styles.footer}>
      <ThemedText themeColor="textMuted" style={styles.statusText}>
        {statusMessage}
      </ThemedText>

      <PrimaryButton label="分享图片和文案" onPress={shareImageAndText} tone={item.kind} />

      <PrimaryButton
        label="仅复制文案"
        onPress={copyTextOnly}
        tone={item.kind}
        variant="secondary"
      />

      <PrimaryButton
        label="返回印记"
        onPress={() => router.push(`/result/${item.id}` as never)}
        variant="ghost"
      />
    </View>
  );

  return (
    <ScreenShell
      eyebrow="分享"
      footer={footer}
      subtitle="沉默的连接比社交网络有价值。你不认识他们，但你们都站在这片土地上。"
      title="分享刻迹"
      tone={item.kind}
    >
      <SharePosterPreview
        anchor={item.anchor}
        imageAlt={item.images.alt}
        imageUrl={item.images.shareUrl}
        locationStyle={item.locationStyle}
        isCirculating={isCirculating}
        shareContent={item.share}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: Spacing.two,
  },
  statusText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
