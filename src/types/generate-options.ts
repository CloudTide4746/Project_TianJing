/** Art style options for image generation. */
export type ArtStyleId =
  | 'ink-wash'
  | 'dunhuang-mural'
  | 'oil-painting'
  | 'woodblock'
  | 'watercolor'
  | 'cyber-neon';

/** Color tone options. */
export type ColorToneId =
  | 'warm-earth'
  | 'cool-jade'
  | 'vintage-fade'
  | 'monochrome';

/** Time texture options. */
export type TimeTextureId =
  | 'ancient-weathered'
  | 'century-patina'
  | 'contemporary'
  | 'future-gloss';

/** Mood / emotional tone. */
export type MoodId =
  | 'lonely'
  | 'lively'
  | 'serene'
  | 'vast'
  | 'mysterious'
  | 'romantic'
  | 'tragic'
  | 'hopeful';

/** Narrative perspective for the generated story. */
export type NarrativePerspectiveId =
  | 'third-person'
  | 'first-person'
  | 'archaeological'
  | 'poetic';

/** Detail density for the generated image. */
export type DetailDensityId = 'minimal' | 'moderate' | 'elaborate';

/** Contrast preference. */
export type ContrastId = 'soft' | 'standard' | 'high';

/** Grain / surface texture. */
export type GrainId = 'smooth' | 'film-grain' | 'mural-peel';

/** Seasonal atmosphere injection. */
export type SeasonId = 'spring' | 'summer' | 'autumn' | 'winter';

/** Dynasty for time-collage overlay. */
export type DynastyId = 'qin' | 'han' | 'tang' | 'song' | 'ming' | 'qing';

export interface GenerateOptions {
  artStyle: ArtStyleId | null;
  colorTone: ColorToneId | null;
  customColorHex: string | null;
  timeTexture: TimeTextureId | null;
  customKeywords: string;
  mood: MoodId | null;
  narrativePerspective: NarrativePerspectiveId | null;
  detailDensity: DetailDensityId | null;
  contrast: ContrastId | null;
  grain: GrainId | null;
  season: SeasonId | null;
  dynastyCollage: DynastyId | null;
  aiPoetry: boolean;
}

export const DEFAULT_GENERATE_OPTIONS: GenerateOptions = {
  artStyle: null,
  colorTone: null,
  customColorHex: null,
  timeTexture: null,
  customKeywords: '',
  mood: null,
  narrativePerspective: null,
  detailDensity: null,
  contrast: null,
  grain: null,
  season: null,
  dynastyCollage: null,
  aiPoetry: false,
};

// ── Option constants ──────────────────────────────────────────

export interface ArtStyleOption {
  id: ArtStyleId;
  label: string;
  description: string;
  swatch: string;
}

export const ART_STYLE_OPTIONS: ArtStyleOption[] = [
  { id: 'ink-wash', label: '水墨意境', description: '留白晕染、青绿山水', swatch: '#4a6741' },
  { id: 'dunhuang-mural', label: '敦煌壁画', description: '矿物颜料、飞天线条', swatch: '#c47d3a' },
  { id: 'oil-painting', label: '油画厚重', description: '可见笔触、光影层次', swatch: '#8b5a2b' },
  { id: 'woodblock', label: '木刻版画', description: '刀痕力度、黑白张力', swatch: '#3a3a3a' },
  { id: 'watercolor', label: '水彩记忆', description: '透明湿润、柔和渐变', swatch: '#7ba4b8' },
  { id: 'cyber-neon', label: '赛博霓虹', description: '全息感、玻璃折射', swatch: '#7b6fd4' },
];

export interface ColorToneOption {
  id: ColorToneId;
  label: string;
  swatch: string;
}

export const COLOR_TONE_OPTIONS: ColorToneOption[] = [
  { id: 'warm-earth', label: '暖土色', swatch: '#c8a06f' },
  { id: 'cool-jade', label: '冷玉色', swatch: '#7ba587' },
  { id: 'vintage-fade', label: '旧照片', swatch: '#b09a7a' },
  { id: 'monochrome', label: '黑白灰', swatch: '#6e6e6e' },
];

export interface TimeTextureOption {
  id: TimeTextureId;
  label: string;
}

export const TIME_TEXTURE_OPTIONS: TimeTextureOption[] = [
  { id: 'ancient-weathered', label: '千年风化' },
  { id: 'century-patina', label: '百年斑驳' },
  { id: 'contemporary', label: '当代清新' },
  { id: 'future-gloss', label: '未来光泽' },
];

export interface MoodOption {
  id: MoodId;
  label: string;
  emoji: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { id: 'lonely', label: '孤独', emoji: '🌫' },
  { id: 'lively', label: '热闹', emoji: '🔥' },
  { id: 'serene', label: '宁静', emoji: '🍃' },
  { id: 'vast', label: '壮阔', emoji: '⛰' },
  { id: 'mysterious', label: '神秘', emoji: '🌙' },
  { id: 'romantic', label: '浪漫', emoji: '🌸' },
  { id: 'tragic', label: '悲壮', emoji: '⚔' },
  { id: 'hopeful', label: '希望', emoji: '☀' },
];

export interface NarrativePerspectiveOption {
  id: NarrativePerspectiveId;
  label: string;
  description: string;
}

export const NARRATIVE_PERSPECTIVE_OPTIONS: NarrativePerspectiveOption[] = [
  { id: 'third-person', label: '第三人称纪实', description: '如纪录片旁白' },
  { id: 'first-person', label: '第一人称日记', description: '亲历者口吻' },
  { id: 'archaeological', label: '考古报告体', description: '学术发掘视角' },
  { id: 'poetic', label: '诗歌体', description: '古风韵文叙事' },
];

export interface DetailDensityOption {
  id: DetailDensityId;
  label: string;
}

export const DETAIL_DENSITY_OPTIONS: DetailDensityOption[] = [
  { id: 'minimal', label: '极简' },
  { id: 'moderate', label: '适中' },
  { id: 'elaborate', label: '极致繁复' },
];

export interface ContrastOption {
  id: ContrastId;
  label: string;
}

export const CONTRAST_OPTIONS: ContrastOption[] = [
  { id: 'soft', label: '柔和' },
  { id: 'standard', label: '标准' },
  { id: 'high', label: '高对比' },
];

export interface GrainOption {
  id: GrainId;
  label: string;
}

export const GRAIN_OPTIONS: GrainOption[] = [
  { id: 'smooth', label: '光滑数字感' },
  { id: 'film-grain', label: '胶片噪点' },
  { id: 'mural-peel', label: '壁画剥落感' },
];

export interface SeasonOption {
  id: SeasonId;
  label: string;
  emoji: string;
}

export const SEASON_OPTIONS: SeasonOption[] = [
  { id: 'spring', label: '春', emoji: '🌸' },
  { id: 'summer', label: '夏', emoji: '☀️' },
  { id: 'autumn', label: '秋', emoji: '🍂' },
  { id: 'winter', label: '冬', emoji: '❄️' },
];

export interface DynastyOption {
  id: DynastyId;
  label: string;
  era: string;
}

export const DYNASTY_OPTIONS: DynastyOption[] = [
  { id: 'qin', label: '秦', era: '公元前221-206' },
  { id: 'han', label: '汉', era: '公元前202-公元220' },
  { id: 'tang', label: '唐', era: '618-907' },
  { id: 'song', label: '宋', era: '960-1279' },
  { id: 'ming', label: '明', era: '1368-1644' },
  { id: 'qing', label: '清', era: '1644-1912' },
];
