export type CollectibleThemeId = 'ruin' | 'message' | 'crystal';

export const FoundationColors = {
  background: '#1a1714',
  backgroundElement: '#2d2520',
  backgroundSelected: '#3d322b',
  backgroundLight: '#e8dfd2',
  backgroundBright: '#f5f0e8',
  text: '#f0e8d8',
  textSecondary: '#a89880',
  textMuted: '#6b5d4f',
  border: '#3d322b',
  success: '#6b8c5a',
  error: '#c75040',
  gold: '#d4a853',
} as const;

export type CollectibleTheme = {
  id: CollectibleThemeId;
  title: string;
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  gradient: readonly [string, string, string];
};

export const CollectibleThemes: Record<CollectibleThemeId, CollectibleTheme> = {
  ruin: {
    id: 'ruin',
    title: '废墟重建图',
    primary: '#c4956a',
    secondary: '#8b7355',
    accent: '#f2c87a',
    surface: '#4a4a52',
    gradient: ['#4a4a52', '#8b7355', '#c4956a'],
  },
  message: {
    id: 'message',
    title: '遗址遗言卡',
    primary: '#c75040',
    secondary: '#2c2c2c',
    accent: '#e8c8a0',
    surface: '#6b8c5a',
    gradient: ['#2c2c2c', '#e8c8a0', '#f5f0e8'],
  },
  crystal: {
    id: 'crystal',
    title: '记忆结晶',
    primary: '#4a9b8a',
    secondary: '#2d6b5a',
    accent: '#d4a853',
    surface: '#4a7ab0',
    gradient: ['#2d6b5a', '#4a9b8a', '#d4a853'],
  },
};

export const collectibleThemeEntries = Object.values(CollectibleThemes);

export function getCollectibleTheme(id: CollectibleThemeId) {
  return CollectibleThemes[id];
}
