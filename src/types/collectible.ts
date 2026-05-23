import type { CollectibleThemeId, LocationStyleId } from '@/constants/collectible-theme';

export type CollectibleKind = CollectibleThemeId;

export type CollectibleStatus = 'idle' | 'queued' | 'generating' | 'complete' | 'failed';

export type CollectibleFilterValue = 'all' | CollectibleKind;

export type CollectibleSurface = 'home' | 'collection' | 'detail' | 'share';

export type CollectibleAccentTone = 'gold' | 'success' | 'error' | 'textSecondary';

export type GenerationPhaseId =
  | 'queued'
  | 'analyze'
  | 'restore'
  | 'compose'
  | 'refine'
  | 'seal'
  | 'complete'
  | 'failed';

export type GenerationScenarioId = 'success' | 'retryable-failure';

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
  generationStatus: CollectibleStatus;
  relatedIds: string[];
  metrics: CollectibleMetrics;
  share: CollectibleShareContent;
  anchor: SpacetimeAnchor;
}

export interface GenerationPhase {
  id: GenerationPhaseId;
  label: string;
  detail: string;
  progress: number;
  tone: CollectibleAccentTone;
  status: CollectibleStatus;
  durationMs: number;
  canCancel: boolean;
}

export interface GenerationScenario {
  id: GenerationScenarioId;
  title: string;
  description: string;
  completionStatus: Extract<CollectibleStatus, 'complete' | 'failed'>;
  phases: GenerationPhase[];
  redirectCollectibleId?: string;
  retryLabel?: string;
}
