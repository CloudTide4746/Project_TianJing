/** @format */

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { HeroBanner } from '@/components/home/hero-banner';
import { RecentCollectibleStrip } from '@/components/home/recent-collectible-strip';
import { ScreenShell } from '@/components/ui/screen-shell';
import { listCollectibles, type CollectibleListItem } from '@/services/api';
import { cacheCollectibles, getCachedCollectibles } from '@/services/storage';

export default function HomeScreen() {
  const router = useRouter();
  const [items, setItems] = useState<CollectibleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      // Load cached data first for instant display
      const cached = await getCachedCollectibles();
      if (cached.length > 0) setItems(cached);

      const data = await listCollectibles({ limit: 20, sort: 'newest' });
      setItems(data.items);
      cacheCollectibles(data.items);
      setError(null);
    } catch (err: any) {
      // Only show error if no cached data
      const cached = await getCachedCollectibles();
      if (cached.length === 0) {
        setError(err.message || '加载失败');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const recentItems = items.filter(
    (it) => it.generationStatus === 'complete',
  );

  const handleOpenDetail = (item: { id: string }) => {
    router.push(`/result/${item.id}` as never);
  };

  return (
    <ScreenShell>
      <HeroBanner
        item={recentItems[0] ?? null}
        itemCount={items.length}
        loading={loading}
        onPressCreate={() =>
          router.navigate('/create' as never)
        }
      />

      <RecentCollectibleStrip
        error={error}
        items={recentItems}
        loading={loading}
        onPressItem={handleOpenDetail}
        onPressMore={() => router.navigate('/explore' as never)}
      />
    </ScreenShell>
  );
}
