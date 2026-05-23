/** @format */

import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { CollectionFilterBar } from '@/components/collection/collection-filter-bar';
import { CollectibleListItem } from '@/components/collection/collectible-list-item';
import { ThemedText } from '@/components/themed-text';
import { EmptyState } from '@/components/ui/empty-state';
import { GlowCard } from '@/components/ui/glow-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ScreenShell } from '@/components/ui/screen-shell';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusPill } from '@/components/ui/status-pill';
import { Spacing } from '@/constants/theme';
import {
  getTimeline,
  listCollectibles,
  type CollectibleListItem as ApiCollectibleListItem,
  type TimelineGroup,
} from '@/services/api';
import {
  cacheCollectibles,
  cacheTimeline,
  getCachedCollectibles,
  getCachedTimeline,
  getFavoriteIds,
} from '@/services/storage';

type ViewMode = 'list' | 'timeline';
type FilterKind = 'all' | 'ruin' | 'message' | 'crystal' | 'favorites';
type FilterStatus = 'all' | 'complete' | 'generating' | 'queued' | 'failed';

export default function ExploreScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [kind, setKind] = useState<FilterKind>('all');
  const [status, setStatus] = useState<FilterStatus>('all');
  const [items, setItems] = useState<ApiCollectibleListItem[]>([]);
  const [timelineGroups, setTimelineGroups] = useState<TimelineGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError(null);
    try {
      // Load cached data first for instant display
      if (!isRefresh) {
        const cached = await getCachedCollectibles();
        if (cached.length > 0) setItems(cached);
        const cachedTL = await getCachedTimeline();
        if (cachedTL) setTimelineGroups(cachedTL);
      }

      if (viewMode === 'timeline') {
        const data = await getTimeline();
        setTimelineGroups(data);
        cacheTimeline(data);
        const allItems = data.flatMap((g) => g.items);
        setItems(allItems);
        cacheCollectibles(allItems);
      } else {
        const data = await listCollectibles({
          kind: kind === 'all' || kind === 'favorites' ? undefined : kind,
          status: status === 'all' ? undefined : status,
          limit: 100,
        });
        setItems(data.items);
        cacheCollectibles(data.items);
      }
    } catch (err: any) {
      // If we have cached data, don't show error
      const cached = await getCachedCollectibles();
      if (cached.length === 0) {
        setError(err.message || '加载失败');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [viewMode, kind, status]);

  // Refresh data + favorites every time tab is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
      getFavoriteIds().then(setFavoriteIds);
    }, [fetchData]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  const filteredItems = useMemo(() => {
    let result = items;
    if (kind === 'favorites') {
      result = result.filter((item) => favoriteIds.includes(item.id));
    } else if (kind !== 'all') {
      result = result.filter((item) => item.kind === kind);
    }
    if (status !== 'all') {
      result = result.filter((item) => item.generationStatus === status);
    }
    return result;
  }, [items, kind, status, favoriteIds]);

  const selectedTone = (kind === 'all' || kind === 'favorites' ? 'default' : kind) as 'default' | 'ruin' | 'message' | 'crystal';
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { complete: 0, generating: 0, queued: 0, failed: 0 };
    items.forEach((it) => {
      counts[it.generationStatus] = (counts[it.generationStatus] ?? 0) + 1;
    });
    return counts;
  }, [items]);

  return (
    <ScreenShell
      eyebrow="时空印记库"
      subtitle={viewMode === 'timeline' ? '按时间轴回溯你的在场证明' : '列表浏览所有时空印记'}
      title="在场证明">
      {/* View mode toggle */}
      <View style={styles.viewToggle}>
        <PrimaryButton
          fullWidth={false}
          label="时间轴"
          onPress={() => setViewMode('timeline')}
          size="sm"
          tone={viewMode === 'timeline' ? 'ruin' : 'default'}
          variant={viewMode === 'timeline' ? 'secondary' : 'ghost'}
        />
        <PrimaryButton
          fullWidth={false}
          label="列表"
          onPress={() => setViewMode('list')}
          size="sm"
          tone={viewMode === 'list' ? 'ruin' : 'default'}
          variant={viewMode === 'list' ? 'secondary' : 'ghost'}
        />
        <PrimaryButton
          fullWidth={false}
          label={`收藏 (${favoriteIds.length})`}
          onPress={() => setKind(kind === 'favorites' ? 'all' : 'favorites')}
          size="sm"
          tone={kind === 'favorites' ? 'message' : 'default'}
          variant={kind === 'favorites' ? 'secondary' : 'ghost'}
        />
      </View>

      {viewMode === 'list' && (
        <CollectionFilterBar
          kind={kind === 'favorites' ? 'all' : kind}
          onKindChange={(v) => setKind(v as FilterKind)}
          onStatusChange={(v) => setStatus(v as FilterStatus)}
          resultCount={filteredItems.length}
          status={status}
        />
      )}

      {loading && items.length === 0 ? (
        <EmptyState
          badge="加载中"
          description="正在连接时空印记服务器..."
          title="读取时空印记库..."
          tone="ruin"
        />
      ) : error && items.length === 0 ? (
        <EmptyState
          actionLabel="重试"
          badge="连接失败"
          description={error}
          onAction={() => fetchData()}
          title="无法加载时空印记"
          tone="default"
        />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          actionLabel="开始创作"
          badge={kind === 'favorites' ? '暂无收藏' : '空的印记库'}
          description={
            kind === 'favorites'
              ? '在结果页点击收藏按钮，收藏的印记会出现在这里。'
              : '完成第一次从时间里挖掘后，印记会自动归档到这里。'
          }
          onAction={() => router.navigate('/create' as never)}
          title={kind === 'favorites' ? '还没有收藏印记' : '还没有时空印记'}
          tone="ruin"
        />
      ) : viewMode === 'timeline' ? (
        <ScrollView
          style={styles.timelineScroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#b08a59" />
          }>
          {timelineGroups.map((group) => (
            <View key={group.dateLabel} style={styles.timelineGroup}>
              <View style={styles.timelineHeader}>
                <View style={styles.timelineDot} />
                <ThemedText style={styles.timelineLabel}>{group.dateLabel}</ThemedText>
                <ThemedText themeColor="textMuted" style={styles.timelineCount}>
                  {group.items.length}件印记
                </ThemedText>
              </View>
              <View style={styles.timelineItems}>
                {group.items.map((item) => (
                  <CollectibleListItem
                    key={item.id}
                    item={item}
                    onPress={() => router.push(`/result/${item.id}` as never)}
                  />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#b08a59" />
          }>
          {filteredItems.map((item) => (
            <CollectibleListItem
              key={item.id}
              item={item}
              onPress={() => router.push(`/result/${item.id}` as never)}
            />
          ))}
        </ScrollView>
      )}

      {/* Stats footer */}
      <GlowCard tone={selectedTone}>
        <SectionHeader subtitle="你的在场证明统计" title="印记统计" />
        <View style={styles.statsRow}>
          <StatusPill dot={false} label={`已完成 ${statusCounts.complete}`} tone="success" />
          <StatusPill dot={false} label={`生成中 ${statusCounts.generating}`} tone="gold" />
          <StatusPill dot={false} label={`失败 ${statusCounts.failed}`} tone="error" />
        </View>
        <View style={styles.summary}>
          <ThemedText themeColor="textMuted" style={styles.summaryText}>
            共 {filteredItems.length} 件时空印记。
            {items.length === 0
              ? ' 完成第一次从时间里挖掘后，这里会逐渐累积你的在场证明。'
              : ' 每一个坐标都不可重复，每一个时刻都只属于你。'}
          </ThemedText>
        </View>
        <PrimaryButton
          label="从时间里挖掘新的印记"
          onPress={() => router.navigate('/create' as never)}
          tone={selectedTone}
        />
      </GlowCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  viewToggle: {
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  list: {
    flex: 1,
  },
  timelineScroll: {
    flex: 1,
  },
  timelineGroup: {
    marginBottom: Spacing.four,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#b08a59',
  },
  timelineLabel: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 700,
  },
  timelineCount: {
    fontSize: 13,
    lineHeight: 18,
  },
  timelineItems: {
    gap: Spacing.three,
    paddingLeft: Spacing.two,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(176, 138, 89, 0.18)',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  summary: {
    gap: Spacing.two,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: Spacing.one,
  },
});
