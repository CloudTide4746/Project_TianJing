import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CollectionFilterBar } from '@/components/collection/collection-filter-bar';
import { CollectibleListItem } from '@/components/collection/collectible-list-item';
import { ThemedText } from '@/components/themed-text';
import { EmptyState } from '@/components/ui/empty-state';
import { GlowCard } from '@/components/ui/glow-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ScreenShell } from '@/components/ui/screen-shell';
import { SectionHeader } from '@/components/ui/section-header';
import { collectibleStatusCounts, recentCollectibles } from '@/data/mock-collectibles';
import { getCollectibleTheme } from '@/constants/collectible-theme';
import { Spacing } from '@/constants/theme';
import type { CollectibleFilterValue, CollectibleStatus } from '@/types/collectible';

function matchesFilters(
  kind: CollectibleFilterValue,
  status: CollectibleStatus | 'all',
  item: (typeof recentCollectibles)[number],
) {
  const kindMatched = kind === 'all' || item.kind === kind;
  const statusMatched = status === 'all' || item.generationStatus === status;

  return kindMatched && statusMatched;
}

export default function ExploreScreen() {
  const router = useRouter();
  const [kind, setKind] = useState<CollectibleFilterValue>('all');
  const [status, setStatus] = useState<CollectibleStatus | 'all'>('all');

  const items = useMemo(
    () => recentCollectibles.filter((item) => matchesFilters(kind, status, item)),
    [kind, status],
  );

  const selectedTone = kind === 'all' ? 'default' : kind;
  const selectedTheme = kind === 'all' ? null : getCollectibleTheme(kind);
  const handleOpenCreate = () => {
    router.push('/create' as never);
  };

  return (
    <ScreenShell
      eyebrow="收藏页模板"
      subtitle="支持按类型与生成状态筛选，列表项保留状态标签、地点信息和跳详情入口。"
      title="我的收藏">
      <CollectionFilterBar
        kind={kind}
        onKindChange={setKind}
        onStatusChange={setStatus}
        resultCount={items.length}
        status={status}
      />

      {items.length > 0 ? (
        <View style={styles.listSection}>
          <SectionHeader
            subtitle={
              status === 'all'
                ? '从最近生成到排队中的草稿，都在这里按时间倒序排布。'
                : `当前筛选聚焦在${status === 'complete' ? '已完成作品' : '指定状态'}。`
            }
            title="作品列表"
          />
          <View style={styles.list}>
            {items.map((item) => (
              <CollectibleListItem
                item={item}
                key={item.id}
                onPress={() => router.push(`/result/${item.id}` as never)}
              />
            ))}
          </View>
        </View>
      ) : (
        <EmptyState
          actionLabel={kind === 'all' && status === 'all' ? '开始创作' : '清空筛选'}
          badge={kind === 'all' ? '没有匹配结果' : selectedTheme?.title}
          description={
            kind === 'all' && status === 'all'
              ? '完成第一次生成后，作品会自动归档到收藏页。'
              : '当前筛选没有命中任何作品。你可以清空条件，或直接进入创作流开启新的显影。'
          }
          onAction={() => {
            if (kind === 'all' && status === 'all') {
              handleOpenCreate();
              return;
            }

            setKind('all');
            setStatus('all');
          }}
          secondaryActionLabel="返回首页"
          onSecondaryAction={() => router.push('/')}
          title={kind === 'all' && status === 'all' ? '还没有收藏作品' : '暂时没有匹配到作品'}
          tone={selectedTone}
        />
      )}

      <GlowCard tone={selectedTone}>
        <SectionHeader
          subtitle="保留一个稳定的页尾入口，方便从收藏直接回到创作或查看全部状态分布。"
          title="继续创作"
        />
        <View style={styles.summary}>
          <ThemedText themeColor="textSecondary" style={styles.summaryText}>
            已完成 {collectibleStatusCounts.complete} 件，排队中 {collectibleStatusCounts.queued}{' '}
            件，生成中 {collectibleStatusCounts.generating} 件。
          </ThemedText>
        </View>
        <PrimaryButton
          label="开始新的创作"
          onPress={handleOpenCreate}
          tone={selectedTone}
        />
      </GlowCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  listSection: {
    gap: Spacing.three,
  },
  list: {
    gap: Spacing.three,
  },
  summary: {
    gap: Spacing.two,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
