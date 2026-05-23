export type CollectibleThemeId = 'ruin' | 'message' | 'crystal';

/** 地点气质决定的视觉风格 */
export type LocationStyleId = 'terracotta' | 'ink' | 'mural' | 'cyber';

export const FoundationColors = {
  background: '#f6f2e9',
  backgroundElement: '#fbf8f2',
  backgroundSelected: '#eee6d9',
  backgroundLight: '#f1ebe0',
  backgroundBright: '#fffdf8',
  text: '#1b1714',
  textSecondary: '#5f564e',
  textMuted: '#8c837a',
  border: '#d8cec0',
  success: '#5d7760',
  error: '#9a5547',
  gold: '#b08a59',
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
    primary: '#9f7a59',
    secondary: '#6d5b4d',
    accent: '#c8a06f',
    surface: '#efe5d6',
    gradient: ['#f6efe5', '#e6d7c4', '#caa77b'],
  },
  message: {
    id: 'message',
    title: '遗址遗言卡',
    primary: '#9a5547',
    secondary: '#76554d',
    accent: '#d39a7d',
    surface: '#f1e3dc',
    gradient: ['#f7efea', '#ead6cb', '#c88f75'],
  },
  crystal: {
    id: 'crystal',
    title: '记忆结晶',
    primary: '#5e8783',
    secondary: '#4d696a',
    accent: '#8fb6af',
    surface: '#e2ece7',
    gradient: ['#f2f7f5', '#dcebe5', '#9dbdb7'],
  },
};

export type LocationTheme = {
  id: LocationStyleId;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  gradient: readonly [string, string, string];
  fontStyle: 'serif' | 'sans';
};

export const LocationThemes: Record<LocationStyleId, LocationTheme> = {
  terracotta: {
    id: 'terracotta',
    name: '陶土',
    description: '兵马俑/古迹 — 陶土质感、秦篆字体、铜锈色调',
    primary: '#8b5e3c',
    secondary: '#6d4c2e',
    accent: '#c8a06f',
    surface: '#f5ede0',
    gradient: ['#f6efe5', '#e8d5c0', '#b8956e'],
    fontStyle: 'serif',
  },
  ink: {
    id: 'ink',
    name: '水墨',
    description: '西湖/山水 — 水墨渲染、留白构图、青绿色系',
    primary: '#4a6741',
    secondary: '#2d4a3a',
    accent: '#7ba587',
    surface: '#e8f0e5',
    gradient: ['#f2f7f0', '#dce8d5', '#9dbb8e'],
    fontStyle: 'serif',
  },
  mural: {
    id: 'mural',
    name: '壁画',
    description: '敦煌/石窟 — 壁画肌理、飞天线条、矿物颜料色',
    primary: '#9a5547',
    secondary: '#7a3d2e',
    accent: '#d4935b',
    surface: '#f8ede4',
    gradient: ['#fbf3e8', '#f0dbc6', '#c8966d'],
    fontStyle: 'serif',
  },
  cyber: {
    id: 'cyber',
    name: '赛博',
    description: '现代都市 — 赛博、霓虹、玻璃折射',
    primary: '#5b4d9e',
    secondary: '#3d2e7a',
    accent: '#7b6fd4',
    surface: '#ece8f8',
    gradient: ['#f4f2fc', '#e4dff8', '#9b8fd4'],
    fontStyle: 'sans',
  },
};

export const locationThemeEntries = Object.values(LocationThemes);

export function getLocationTheme(id: LocationStyleId) {
  return LocationThemes[id];
}

export const collectibleThemeEntries = Object.values(CollectibleThemes);

export function getCollectibleTheme(id: CollectibleThemeId) {
  return CollectibleThemes[id];
}
