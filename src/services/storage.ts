/**
 * Local persistence layer using AsyncStorage.
 * Caches collectible lists, details, and favorite IDs for offline access.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CollectibleItem, CollectibleListItem } from './api';

const KEYS = {
  COLLECTIBLES: '@spacetime/collectibles',
  COLLECTIBLE_DETAIL_PREFIX: '@spacetime/detail/',
  FAVORITE_IDS: '@spacetime/favorite_ids',
  TIMELINE: '@spacetime/timeline',
  LAST_SYNC: '@spacetime/last_sync',
};

// ── Collectible list cache ─────────────────────────────────

export async function cacheCollectibles(items: CollectibleListItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.COLLECTIBLES, JSON.stringify(items));
    await AsyncStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
  } catch {
    // AsyncStorage may fail in certain environments — ignore
  }
}

export async function getCachedCollectibles(): Promise<CollectibleListItem[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.COLLECTIBLES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function getLastSyncTime(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.LAST_SYNC);
  } catch {
    return null;
  }
}

// ── Collectible detail cache ───────────────────────────────

export async function cacheCollectibleDetail(item: CollectibleItem): Promise<void> {
  try {
    await AsyncStorage.setItem(
      `${KEYS.COLLECTIBLE_DETAIL_PREFIX}${item.id}`,
      JSON.stringify(item),
    );
  } catch {
    // ignore
  }
}

export async function getCachedCollectibleDetail(
  id: string,
): Promise<CollectibleItem | null> {
  try {
    const raw = await AsyncStorage.getItem(`${KEYS.COLLECTIBLE_DETAIL_PREFIX}${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Favorites ──────────────────────────────────────────────

export async function getFavoriteIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.FAVORITE_IDS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveFavoriteIds(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.FAVORITE_IDS, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export async function toggleFavoriteId(id: string): Promise<boolean> {
  const ids = await getFavoriteIds();
  const index = ids.indexOf(id);
  if (index >= 0) {
    ids.splice(index, 1);
    await saveFavoriteIds(ids);
    return false;
  } else {
    ids.push(id);
    await saveFavoriteIds(ids);
    return true;
  }
}

export async function isFavoriteId(id: string): Promise<boolean> {
  const ids = await getFavoriteIds();
  return ids.includes(id);
}

// ── Timeline cache ─────────────────────────────────────────

export async function cacheTimeline(
  timeline: Array<{ dateLabel: string; items: CollectibleListItem[] }>,
): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.TIMELINE, JSON.stringify(timeline));
  } catch {
    // ignore
  }
}

export async function getCachedTimeline(): Promise<
  Array<{ dateLabel: string; items: CollectibleListItem[] }> | null
> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.TIMELINE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
