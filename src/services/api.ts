/**
 * API client for 时空印记 backend.
 *
 * Change MANUAL_BASE_URL to your backend server IP when testing on a physical device.
 * Find your computer's LAN IP (e.g. 192.168.1.100) and set it below.
 * The backend must be running: uvicorn main:app --reload --host 0.0.0.0 --port 8000
 *
 * For Android emulator: http://10.0.2.2:8000
 * For iOS simulator: http://localhost:8000
 * For physical device: http://<your-lan-ip>:8000
 */

import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as FileSystem from 'expo-file-system/legacy';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

// ═══ SET YOUR COMPUTER'S LAN IP HERE ═══
const MANUAL_BASE_URL = 'http://10.200.186.154:8000';

const getBaseUrl = (): string => {
  if (__DEV__) {
    // Manual override — use this for physical device testing
    if (MANUAL_BASE_URL) return MANUAL_BASE_URL;

    // Physical device — can't use localhost, prompt via console
    if (Device.isDevice) {
      console.warn(
        '[API] Running on physical device. Set MANUAL_BASE_URL in src/services/api.ts to your computer LAN IP (e.g. http://192.168.x.x:8000)',
      );
      // Fall back to localhost — will fail but the warning is visible in logs
      return 'http://localhost:8000';
    }

    // Android emulator uses 10.0.2.2 to reach host localhost
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000';
    }
    return 'http://localhost:8000';
  }
  return 'https://your-production-api.com';
};

const BASE_URL = getBaseUrl();

// ── Types (mirrors backend models) ──────────────────────────

export type CollectibleKind = 'ruin' | 'message' | 'crystal';
export type LocationStyleId = 'terracotta' | 'ink' | 'mural' | 'cyber';
export type GenerationStatus = 'idle' | 'queued' | 'generating' | 'complete' | 'failed';

export interface SpacetimeAnchor {
  latitude: number;
  longitude: number;
  timestamp: string;
  weatherCondition: string;
  temperature: number;
  windDirection: string;
  windLevel: number;
  aqi: number;
  aqiLevel: string;
  locationName: string;
  mintNumber: number;
  earliestImprint: string;
  goldenLine: string;
}

export interface CollectibleImageSet {
  heroUrl: string;
  thumbnailUrl: string;
  shareUrl: string;
  alt: string;
}

export interface CollectibleShareContent {
  title: string;
  caption: string;
  callToAction: string;
  hashtags: string[];
}

export interface CollectibleMetrics {
  viewCount: number;
  shareCount: number;
  saveCount: number;
}

export interface CollectibleItem {
  id: string;
  slug: string;
  kind: CollectibleKind;
  locationStyle: LocationStyleId;
  title: string;
  subtitle: string;
  shortDescription: string;
  siteName: string;
  province: string;
  district: string;
  eraLabel: string;
  createdAt: string;
  updatedAt: string;
  images: CollectibleImageSet;
  story: string;
  tags: string[];
  materialKeywords: string[];
  collectorNote?: string;
  isFavorite: boolean;
  isFeatured: boolean;
  generationStatus: GenerationStatus;
  relatedIds: string[];
  metrics: CollectibleMetrics;
  share: CollectibleShareContent;
  anchor: SpacetimeAnchor;
}

export interface CollectibleListItem {
  id: string;
  kind: CollectibleKind;
  locationStyle: LocationStyleId;
  title: string;
  subtitle: string;
  siteName: string;
  province: string;
  district: string;
  createdAt: string;
  thumbnailUrl: string;
  generationStatus: GenerationStatus;
  anchor: SpacetimeAnchor;
}

export interface LocationInfo {
  locationName: string;
  province: string;
  district: string;
  eraLabel: string;
  locationStyle: LocationStyleId;
  suggestedKind: CollectibleKind;
  mintNumber: number;
  earliestImprint: string;
  weatherCondition: string;
  temperature: number;
  windDirection: string;
  windLevel: number;
  aqi: number;
  aqiLevel: string;
}

export interface GenerationPhase {
  id: string;
  label: string;
  detail: string;
  progress: number;
  tone: string;
  status: string;
  durationMs: number;
  canCancel: boolean;
}

export interface GenerationStatusOut {
  status: GenerationStatus;
  phases: GenerationPhase[];
  currentPhaseIndex: number;
  redirectCollectibleId?: string;
  errorMessage?: string;
}

export interface TimelineGroup {
  dateLabel: string;
  items: CollectibleListItem[];
}

export interface MapPoint {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  locationStyle: LocationStyleId;
  thumbnailUrl: string;
  mintNumber: number;
}

export interface CityAggregation {
  province: string;
  city: string;
  count: number;
  thumbnailUrl: string;
}

export interface UploadResponse {
  collectibleId: string;
  imageUrl: string;
  anchor: SpacetimeAnchor;
}

// ── API helpers ──────────────────────────────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}

function toCamelAnchor(raw: Record<string, unknown>): SpacetimeAnchor {
  return {
    latitude: (raw.latitude ?? raw.lat ?? 0) as number,
    longitude: (raw.longitude ?? raw.lng ?? 0) as number,
    timestamp: (raw.timestamp ?? '') as string,
    weatherCondition: (raw.weather_condition ?? raw.weatherCondition ?? '') as string,
    temperature: (raw.temperature ?? 0) as number,
    windDirection: (raw.wind_direction ?? raw.windDirection ?? '') as string,
    windLevel: (raw.wind_level ?? raw.windLevel ?? 0) as number,
    aqi: (raw.aqi ?? 0) as number,
    aqiLevel: (raw.aqi_level ?? raw.aqiLevel ?? '') as string,
    locationName: (raw.location_name ?? raw.locationName ?? '') as string,
    mintNumber: (raw.mint_number ?? raw.mintNumber ?? 0) as number,
    earliestImprint: (raw.earliest_imprint ?? raw.earliestImprint ?? '') as string,
    goldenLine: (raw.golden_line ?? raw.goldenLine ?? '') as string,
  };
}

// ── API endpoints ────────────────────────────────────────────

/** Get location info (weather + geocode + mint counter) for a coordinate. */
export async function getLocationInfo(lat: number, lng: number): Promise<LocationInfo> {
  const raw = await request<Record<string, unknown>>(`/api/location/info?lat=${lat}&lng=${lng}`);
  return {
    locationName: (raw.location_name ?? raw.locationName ?? '') as string,
    province: (raw.province ?? '') as string,
    district: (raw.district ?? '') as string,
    eraLabel: (raw.era_label ?? raw.eraLabel ?? '') as string,
    locationStyle: (raw.location_style ?? raw.locationStyle ?? 'terracotta') as LocationStyleId,
    suggestedKind: (raw.suggested_kind ?? raw.suggestedKind ?? 'ruin') as CollectibleKind,
    mintNumber: (raw.mint_number ?? raw.mintNumber ?? 0) as number,
    earliestImprint: (raw.earliest_imprint ?? raw.earliestImprint ?? '') as string,
    weatherCondition: (raw.weather_condition ?? raw.weatherCondition ?? '') as string,
    temperature: (raw.temperature ?? 0) as number,
    windDirection: (raw.wind_direction ?? raw.windDirection ?? '') as string,
    windLevel: (raw.wind_level ?? raw.windLevel ?? 0) as number,
    aqi: (raw.aqi ?? 0) as number,
    aqiLevel: (raw.aqi_level ?? raw.aqiLevel ?? '') as string,
  };
}

import type { GenerateOptions } from '@/types/generate-options';

/** Upload a photo and create a collectible. Returns collectible ID and initial anchor data. */
export async function uploadCollectible(
  imageUri: string,
  latitude: number,
  longitude: number,
  message: string = '',
  options?: GenerateOptions,
  imprintTitle: string = '',
): Promise<UploadResponse> {
  const filename = imageUri.split('/').pop() ?? 'photo.jpg';

  // Compress image to avoid exceeding upload size limits (max ~1MB)
  const compressed = await manipulateAsync(
    imageUri,
    [{ resize: { width: 1920 } }],
    { compress: 0.8, format: SaveFormat.JPEG },
  );
  const compressedUri = compressed.uri;

  // Read compressed image as base64
  const base64Data = await FileSystem.readAsStringAsync(compressedUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const formData = new FormData();
  formData.append('imageBase64', base64Data);
  formData.append('imageFilename', filename);
  formData.append('latitude', String(latitude));
  formData.append('longitude', String(longitude));
  formData.append('message', message);
  formData.append('imprintTitle', imprintTitle);

  if (options) {
    if (options.artStyle) formData.append('artStyle', options.artStyle);
    if (options.colorTone) formData.append('colorTone', options.colorTone);
    if (options.timeTexture) formData.append('timeTexture', options.timeTexture);
    if (options.customKeywords) formData.append('customKeywords', options.customKeywords);
    if (options.mood) formData.append('mood', options.mood);
    if (options.narrativePerspective) formData.append('narrativePerspective', options.narrativePerspective);
    if (options.detailDensity) formData.append('detailDensity', options.detailDensity);
    if (options.contrast) formData.append('contrast', options.contrast);
    if (options.grain) formData.append('grain', options.grain);
    if (options.season) formData.append('season', options.season);
    if (options.dynastyCollage) formData.append('dynastyCollage', options.dynastyCollage);
    formData.append('aiPoetry', String(options.aiPoetry));
  }

  const url = `${BASE_URL}/api/generate/upload`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Upload failed ${res.status}: ${body}`);
  }
  const raw = await res.json();
  return {
    collectibleId: raw.collectible_id ?? raw.collectibleId,
    imageUrl: raw.image_url ?? raw.imageUrl,
    anchor: toCamelAnchor(raw.anchor ?? {}),
  };
}

/** Get generation status (for polling). */
export async function getGenerationStatus(collectibleId: string): Promise<GenerationStatusOut> {
  const raw = await request<Record<string, unknown>>(`/api/generate/${collectibleId}/status`);
  return {
    status: (raw.status ?? 'idle') as GenerationStatus,
    phases: ((raw.phases ?? []) as Array<Record<string, unknown>>).map((p) => ({
      id: p.id as string,
      label: p.label as string,
      detail: p.detail as string,
      progress: p.progress as number,
      tone: p.tone as string,
      status: p.status as string,
      durationMs: p.duration_ms ?? p.durationMs ?? 1000,
      canCancel: Boolean(p.can_cancel ?? p.canCancel),
    })),
    currentPhaseIndex: (raw.current_phase_index ?? raw.currentPhaseIndex ?? 0) as number,
    redirectCollectibleId: (raw.redirect_collectible_id ?? raw.redirectCollectibleId) as string | undefined,
    errorMessage: (raw.error_message ?? raw.errorMessage) as string | undefined,
  };
}

/** Retry generation for a collectible. */
export async function retryGeneration(collectibleId: string): Promise<void> {
  await request(`/api/generate/${collectibleId}/trigger`, { method: 'POST' });
}

/** Get a single collectible by ID. */
export async function getCollectible(id: string): Promise<CollectibleItem> {
  const raw = await request<Record<string, unknown>>(`/api/collectibles/${id}`);
  return mapCollectible(raw);
}

/** List collectibles with optional filters. */
export async function listCollectibles(params?: {
  kind?: string;
  status?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: CollectibleListItem[]; total: number }> {
  const searchParams = new URLSearchParams();
  if (params?.kind) searchParams.set('kind', params.kind);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));
  const qs = searchParams.toString();
  const raw = await request<{ items: Array<Record<string, unknown>>; total: number }>(
    `/api/collectibles/${qs ? `?${qs}` : ''}`,
  );
  return {
    items: raw.items.map(mapListItem),
    total: raw.total,
  };
}

/** Get timeline (collectibles grouped by date). */
export async function getTimeline(): Promise<TimelineGroup[]> {
  const raw = await request<Array<{ date_label: string; items: Array<Record<string, unknown>> }>>(
    '/api/collectibles/timeline',
  );
  return raw.map((g) => ({
    dateLabel: g.date_label ?? g.dateLabel,
    items: g.items.map(mapListItem),
  }));
}

/** Get map points for all collectibles. */
export async function getMapPoints(): Promise<MapPoint[]> {
  return request<MapPoint[]>('/api/collectibles/map');
}

/** Get city aggregation. */
export async function getCityAggregation(): Promise<CityAggregation[]> {
  return request<CityAggregation[]>('/api/collectibles/cities');
}

/** Delete a collectible. */
export async function deleteCollectible(id: string): Promise<void> {
  await request(`/api/collectibles/${id}`, { method: 'DELETE' });
}

/** Toggle favorite status. Returns new is_favorite state. */
export async function toggleFavorite(id: string): Promise<boolean> {
  try {
    const raw = await request<{ ok: boolean; is_favorite: boolean }>(
      `/api/collectibles/${id}/favorite`,
      { method: 'PATCH' },
    );
    return raw.is_favorite;
  } catch {
    // Fall back to local-only
    const { toggleFavoriteId } = await import('./storage');
    return toggleFavoriteId(id);
  }
}

// ── Mappers ──────────────────────────────────────────────────

function mapCollectible(raw: Record<string, unknown>): CollectibleItem {
  return {
    id: raw.id as string,
    slug: (raw.slug ?? '') as string,
    kind: (raw.kind ?? 'ruin') as CollectibleKind,
    locationStyle: (raw.location_style ?? raw.locationStyle ?? 'terracotta') as LocationStyleId,
    title: (raw.title ?? '') as string,
    subtitle: (raw.subtitle ?? '') as string,
    shortDescription: (raw.short_description ?? raw.shortDescription ?? '') as string,
    siteName: (raw.site_name ?? raw.siteName ?? '') as string,
    province: (raw.province ?? '') as string,
    district: (raw.district ?? '') as string,
    eraLabel: (raw.era_label ?? raw.eraLabel ?? '') as string,
    createdAt: (raw.created_at ?? raw.createdAt ?? '') as string,
    updatedAt: (raw.updated_at ?? raw.updatedAt ?? '') as string,
    images: {
      heroUrl: fullUrl((raw.images as Record<string, unknown>)?.hero_url ?? (raw.images as Record<string, unknown>)?.heroUrl ?? raw.hero_url ?? raw.heroUrl ?? ''),
      thumbnailUrl: fullUrl((raw.images as Record<string, unknown>)?.thumbnail_url ?? (raw.images as Record<string, unknown>)?.thumbnailUrl ?? raw.thumbnail_url ?? raw.thumbnailUrl ?? ''),
      shareUrl: fullUrl((raw.images as Record<string, unknown>)?.share_url ?? (raw.images as Record<string, unknown>)?.shareUrl ?? raw.share_url ?? raw.shareUrl ?? ''),
      alt: (raw.images as Record<string, unknown>)?.alt ?? raw.image_alt ?? raw.imageAlt ?? '',
    },
    story: (raw.story ?? '') as string,
    tags: (raw.tags ?? []) as string[],
    materialKeywords: (raw.material_keywords ?? raw.materialKeywords ?? []) as string[],
    collectorNote: (raw.collector_note ?? raw.collectorNote) as string | undefined,
    isFavorite: Boolean(raw.is_favorite ?? raw.isFavorite ?? false),
    isFeatured: Boolean(raw.is_featured ?? raw.isFeatured ?? false),
    generationStatus: (raw.generation_status ?? raw.generationStatus ?? 'idle') as GenerationStatus,
    relatedIds: (raw.related_ids ?? raw.relatedIds ?? []) as string[],
    metrics: {
      viewCount: ((raw.metrics as Record<string, unknown>)?.view_count ?? (raw.metrics as Record<string, unknown>)?.viewCount ?? raw.view_count ?? raw.viewCount ?? 0) as number,
      shareCount: ((raw.metrics as Record<string, unknown>)?.share_count ?? (raw.metrics as Record<string, unknown>)?.shareCount ?? raw.share_count ?? raw.shareCount ?? 0) as number,
      saveCount: ((raw.metrics as Record<string, unknown>)?.save_count ?? (raw.metrics as Record<string, unknown>)?.saveCount ?? raw.save_count ?? raw.saveCount ?? 0) as number,
    },
    share: {
      title: ((raw.share as Record<string, unknown>)?.title ?? '') as string,
      caption: ((raw.share as Record<string, unknown>)?.caption ?? '') as string,
      callToAction: ((raw.share as Record<string, unknown>)?.call_to_action ?? (raw.share as Record<string, unknown>)?.callToAction ?? '') as string,
      hashtags: ((raw.share as Record<string, unknown>)?.hashtags ?? []) as string[],
    },
    anchor: toCamelAnchor((raw.anchor ?? raw) as Record<string, unknown>),
  };
}

function mapListItem(raw: Record<string, unknown>): CollectibleListItem {
  return {
    id: raw.id as string,
    kind: (raw.kind ?? 'ruin') as CollectibleKind,
    locationStyle: (raw.location_style ?? raw.locationStyle ?? 'terracotta') as LocationStyleId,
    title: (raw.title ?? '') as string,
    subtitle: (raw.subtitle ?? '') as string,
    siteName: (raw.site_name ?? raw.siteName ?? '') as string,
    province: (raw.province ?? '') as string,
    district: (raw.district ?? '') as string,
    createdAt: (raw.created_at ?? raw.createdAt ?? '') as string,
    thumbnailUrl: fullUrl(raw.thumbnail_url ?? raw.thumbnailUrl ?? ''),
    generationStatus: (raw.generation_status ?? raw.generationStatus ?? 'idle') as GenerationStatus,
    anchor: toCamelAnchor((raw.anchor ?? raw) as Record<string, unknown>),
  };
}

function fullUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
}
