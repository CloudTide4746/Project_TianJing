import type { CollectibleThemeId } from '@/constants/collectible-theme';

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

export interface CollectibleItem {
  id: string;
  slug: string;
  kind: CollectibleKind;
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
