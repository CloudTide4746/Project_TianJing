/** @format */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { SpacetimeCard } from '@/components/result/spacetime-card';
import { EmptyState } from '@/components/ui/empty-state';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ScreenShell } from '@/components/ui/screen-shell';
import { StatusPill } from '@/components/ui/status-pill';
import { Spacing } from '@/constants/theme';
import { getCollectible, toggleFavorite, type CollectibleItem } from '@/services/api';
import { cacheCollectibleDetail, toggleFavoriteId } from '@/services/storage';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const resolvedId = typeof params.id === 'string' ? params.id : undefined;

  const [item, setItem] = useState<CollectibleItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);

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
        setIsFav(data.isFavorite);
        // Cache for offline access
        cacheCollectibleDetail(data);
      } catch (err: any) {
        setError(err.message || '加载失败');
      } finally {
        setLoading(false);
      }
    })();
  }, [resolvedId]);

  const handleToggleFavorite = async () => {
    if (!resolvedId || favLoading) return;
    setFavLoading(true);
    try {
      const newState = await toggleFavorite(resolvedId);
      setIsFav(newState);
      // Also update local storage
      await toggleFavoriteId(resolvedId);
    } catch {
      // Fallback: toggle locally
      const newState = await toggleFavoriteId(resolvedId);
      setIsFav(newState);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <ScreenShell
        eyebrow="时空印记"
        subtitle="正在从时空数据库中提取档案..."
        title="加载中"
        tone="ruin">
        <EmptyState
          badge="加载中"
          description="正在连接时空印记服务器获取数据。"
          title="读取时空印记..."
          tone="ruin"
        />
      </ScreenShell>
    );
  }

  if (error || !item) {
    return (
      <ScreenShell
        eyebrow="结果"
        subtitle="当前链接没有匹配到已铸造的印记，可以回到收藏页重新选择，或直接开始新的创作。"
        title="印记不存在">
        <EmptyState
          actionLabel="返回收藏"
          badge="无效链接"
          description="这件时空印记可能尚未铸造完成，或链接已失效。"
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
      <ThemedText themeColor="textMuted" style={styles.footerHint}>
        这不是滤镜。这是你在时空中的一个坐标，被正式存档了。
      </ThemedText>
      <PrimaryButton
        label="分享印记"
        onPress={() => router.push(`/share/${item.id}` as never)}
        tone={item.kind}
      />
      <PrimaryButton
        label={isFav ? '已收藏' : '收藏入库'}
        loading={favLoading}
        loadingLabel="同步中..."
        onPress={handleToggleFavorite}
        tone={item.kind}
        variant="secondary"
      />
    </View>
  );

  return (
    <ScreenShell
      eyebrow="时空印记"
      footer={footer}
      subtitle="你的坐标已被正式存档。沉默的连接比社交网络有价值。"
      title={item.title || item.anchor.locationName}
      tone={item.kind}>
      <SpacetimeCard
        anchor={{
          latitude: item.anchor.latitude,
          longitude: item.anchor.longitude,
          timestamp: item.anchor.timestamp,
          weatherCondition: item.anchor.weatherCondition,
          temperature: item.anchor.temperature,
          windDirection: item.anchor.windDirection,
          windLevel: item.anchor.windLevel,
          aqi: item.anchor.aqi,
          aqiLevel: item.anchor.aqiLevel,
          locationName: item.anchor.locationName,
          mintNumber: item.anchor.mintNumber,
          earliestImprint: item.anchor.earliestImprint,
          goldenLine: item.anchor.goldenLine,
        }}
        collectibleTitle={item.title}
        imageAlt={item.images.alt}
        imageUrl={item.images.heroUrl}
        locationStyle={item.locationStyle}
        onImagePress={() => setFullscreenVisible(true)}
      />

      {/* Fullscreen image modal */}
      <Modal
        visible={fullscreenVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setFullscreenVisible(false)}
      >
        <View style={styles.fullscreenContainer}>
          <Pressable
            onPress={() => setFullscreenVisible(false)}
            style={styles.closeButton}
            accessibilityLabel="关闭大图"
          >
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>
          <Image
            source={{ uri: item.images.heroUrl }}
            style={styles.fullscreenImage}
            contentFit="contain"
            accessibilityLabel={item.images.alt}
          />
        </View>
      </Modal>

      <View style={styles.mintInfo}>
        <StatusPill
          dot={false}
          label={`第${item.anchor.mintNumber}位铸造者`}
          tone={item.kind}
        />
        <StatusPill
          dot={false}
          label={`最早印记: ${item.anchor.earliestImprint}`}
          tone="default"
        />
        <StatusPill dot status="complete" />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: Spacing.two,
  },
  footerHint: {
    fontSize: 12,
    lineHeight: 16,
  },
  mintInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
