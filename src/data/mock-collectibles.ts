import { collectibleThemeEntries } from '@/constants/collectible-theme';
import type {
  CollectibleFilterValue,
  CollectibleItem,
  CollectibleKind,
  CollectibleStatus,
  CollectibleSurface,
  SpacetimeAnchor,
} from '@/types/collectible';

type MockImageSize =
  | 'portrait_16_9'
  | 'portrait_4_3'
  | 'landscape_4_3'
  | 'landscape_16_9'
  | 'square_hd';

function buildImageUrl(prompt: string, imageSize: MockImageSize) {
  return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`;
}

function sortByNewest(items: readonly CollectibleItem[]) {
  return [...items].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

function uniqueById(items: readonly CollectibleItem[]) {
  return items.filter((item, index, array) => array.findIndex((entry) => entry.id === item.id) === index);
}

export const collectibleKindOptions = collectibleThemeEntries.map((theme) => ({
  value: theme.id,
  label: theme.title,
  accent: theme.accent,
})) as readonly {
  value: CollectibleKind;
  label: string;
  accent: string;
}[];

// ── 刻迹 mock 数据 ──────────────────────────────────────────

export const mockCollectibles: CollectibleItem[] = [
  {
    id: 'spacetime-001',
    slug: 'terracotta-warriors-pit-1',
    kind: 'ruin',
    locationStyle: 'terracotta',
    title: '秦兵马俑一号坑',
    subtitle: '站在2200年前的军阵前',
    shortDescription: '陶土质感、秦篆字体、铜锈色调的刻迹卡',
    siteName: '秦兵马俑一号坑',
    province: '陕西',
    district: '西安·临潼区',
    eraLabel: '秦代 · 公元前210年',
    createdAt: '2026-05-23T14:37:00.000Z',
    updatedAt: '2026-05-23T14:37:00.000Z',
    images: {
      heroUrl: buildImageUrl(
        'terracotta warrior statues in Xi\'an pit 1, earthy clay texture, Qin dynasty small seal script calligraphy, bronze and copper rust tones, ancient ceramic surface, premium collectible card artwork, museum quality',
        'portrait_16_9',
      ),
      thumbnailUrl: buildImageUrl(
        'terracotta warrior statues in Xi\'an pit 1, earthy clay texture, Qin dynasty small seal script calligraphy, bronze and copper rust tones, ancient ceramic surface, premium collectible card artwork, museum quality',
        'portrait_4_3',
      ),
      shareUrl: buildImageUrl(
        'vertical poster of terracotta warriors, clay and bronze palette, Qin seal script, elegant museum poster design, premium cultural collectible',
        'portrait_16_9',
      ),
      alt: '秦兵马俑一号坑陶土风格刻迹',
    },
    story: '你站在这里的时候，这些陶俑已经站了2200年。',
    tags: ['兵马俑', '秦代', '陶俑'],
    materialKeywords: ['陶土', '铜锈', '夯土'],
    collectorNote: '首张刻迹卡，陶土质感与秦篆字体搭配',
    isFavorite: true,
    isFeatured: true,
    generationStatus: 'complete',
    relatedIds: ['spacetime-002', 'spacetime-003'],
    metrics: { viewCount: 1284, shareCount: 168, saveCount: 402 },
    share: {
      title: '我在兵马俑一号坑留下了第37个刻迹',
      caption: '你站在这里的时候，这些陶俑已经站了2200年。',
      callToAction: '打开时空卡，见证你的坐标被存档。',
      hashtags: ['#刻迹', '#兵马俑', '#秦俑'],
    },
    anchor: {
      latitude: 34.3852,
      longitude: 109.2731,
      timestamp: '2026-05-23T14:37:00.000Z',
      weatherCondition: '晴',
      temperature: 28,
      windDirection: '东南',
      windLevel: 2,
      aqi: 52,
      aqiLevel: '优',
      locationName: '秦兵马俑一号坑',
      mintNumber: 37,
      earliestImprint: '2024-03-15',
      goldenLine: '你站在这里的时候，这些陶俑已经站了2200年。',
    },
  },
  {
    id: 'spacetime-002',
    slug: 'west-lake-broken-bridge',
    kind: 'ruin',
    locationStyle: 'ink',
    title: '西湖断桥',
    subtitle: '每一滴雨都曾被一位诗人看见',
    shortDescription: '水墨渲染、留白构图、青绿色系的刻迹卡',
    siteName: '西湖断桥',
    province: '浙江',
    district: '杭州·西湖区',
    eraLabel: '千年人文景观',
    createdAt: '2026-05-23T09:15:00.000Z',
    updatedAt: '2026-05-23T09:15:00.000Z',
    images: {
      heroUrl: buildImageUrl(
        'West Lake Broken Bridge in Hangzhou, ink wash painting style, soft mist, negative space composition, jade green and celadon palette, poetic Chinese landscape, premium collectible card',
        'portrait_16_9',
      ),
      thumbnailUrl: buildImageUrl(
        'West Lake Broken Bridge in Hangzhou, ink wash painting style, soft mist, negative space composition, jade green and celadon palette, poetic Chinese landscape, premium collectible card',
        'portrait_4_3',
      ),
      shareUrl: buildImageUrl(
        'vertical ink wash poster of West Lake Broken Bridge, celadon green palette, misty atmosphere, poetic Chinese aesthetic, premium share poster',
        'portrait_16_9',
      ),
      alt: '西湖断桥水墨风格刻迹',
    },
    story: '每一滴落在湖面的雨，都曾被一位诗人看见。而你今天看见的这一滴，也有你的名字。',
    tags: ['西湖', '水墨', '断桥'],
    materialKeywords: ['水墨', '宣纸', '青绿'],
    collectorNote: '水墨风格与西湖气质完美匹配',
    isFavorite: true,
    isFeatured: true,
    generationStatus: 'complete',
    relatedIds: ['spacetime-001', 'spacetime-003'],
    metrics: { viewCount: 2156, shareCount: 432, saveCount: 891 },
    share: {
      title: '我在西湖断桥留下了第312个刻迹',
      caption: '每一滴落在湖面的雨，都曾被一位诗人看见。',
      callToAction: '打开时空卡，见证你的坐标被存档。',
      hashtags: ['#刻迹', '#西湖', '#水墨'],
    },
    anchor: {
      latitude: 30.2592,
      longitude: 120.1467,
      timestamp: '2026-05-23T09:15:00.000Z',
      weatherCondition: '小雨',
      temperature: 22,
      windDirection: '北',
      windLevel: 1,
      aqi: 35,
      aqiLevel: '优',
      locationName: '西湖断桥',
      mintNumber: 312,
      earliestImprint: '2024-01-08',
      goldenLine: '每一滴落在湖面的雨，都曾被一位诗人看见。',
    },
  },
  {
    id: 'spacetime-003',
    slug: 'shanghai-lujiazui-night',
    kind: 'crystal',
    locationStyle: 'cyber',
    title: '上海陆家嘴',
    subtitle: '城市每天都在生长，快门让它停了一下',
    shortDescription: '赛博霓虹、玻璃折射的刻迹卡',
    siteName: '上海陆家嘴金融中心',
    province: '上海',
    district: '浦东新区',
    eraLabel: '当代都市',
    createdAt: '2026-05-22T21:48:00.000Z',
    updatedAt: '2026-05-22T21:48:00.000Z',
    images: {
      heroUrl: buildImageUrl(
        'Shanghai Lujiazui skyline at night, cyberpunk neon glow, glass refraction effects, deep purple and electric blue palette, futuristic urban aesthetic, premium collectible card',
        'portrait_16_9',
      ),
      thumbnailUrl: buildImageUrl(
        'Shanghai Lujiazui skyline at night, cyberpunk neon glow, glass refraction effects, deep purple and electric blue palette, futuristic urban aesthetic, premium collectible card',
        'portrait_4_3',
      ),
      shareUrl: buildImageUrl(
        'vertical cyberpunk poster of Shanghai Lujiazui, neon purple and blue, glass tower refractions, futuristic urban premium share poster',
        'portrait_16_9',
      ),
      alt: '上海陆家嘴赛博风格刻迹',
    },
    story: '城市每天都在生长，钢筋和玻璃在夜色里呼吸。你摁下快门的那一刻，它刚好停了一下——这一下，就是你的坐标。',
    tags: ['陆家嘴', '赛博', '都市'],
    materialKeywords: ['霓虹', '玻璃', '金属'],
    collectorNote: '赛博风格代表现代都市气质',
    isFavorite: false,
    isFeatured: true,
    generationStatus: 'complete',
    relatedIds: ['spacetime-001', 'spacetime-002'],
    metrics: { viewCount: 987, shareCount: 156, saveCount: 334 },
    share: {
      title: '我在上海陆家嘴留下了第89个刻迹',
      caption: '城市每天都在生长，你摁下快门的那一刻它刚好停了一下。',
      callToAction: '打开时空卡，见证你的坐标被存档。',
      hashtags: ['#刻迹', '#陆家嘴', '#赛博'],
    },
    anchor: {
      latitude: 31.2397,
      longitude: 121.4998,
      timestamp: '2026-05-22T21:48:00.000Z',
      weatherCondition: '多云',
      temperature: 26,
      windDirection: '东南',
      windLevel: 3,
      aqi: 68,
      aqiLevel: '良',
      locationName: '上海陆家嘴',
      mintNumber: 89,
      earliestImprint: '2024-02-20',
      goldenLine: '城市每天都在生长，你摁下快门的那一刻它刚好停了一下。',
    },
  },
  {
    id: 'spacetime-004',
    slug: 'dunhuang-mogao-caves',
    kind: 'message',
    locationStyle: 'mural',
    title: '敦煌莫高窟',
    subtitle: '飞天的线条穿过千年落在你眼前',
    shortDescription: '壁画肌理、飞天线条、矿物颜料色的刻迹卡（铸造中）',
    siteName: '敦煌莫高窟',
    province: '甘肃',
    district: '敦煌市',
    eraLabel: '魏晋至元代 · 千年石窟',
    createdAt: '2026-05-23T10:05:00.000Z',
    updatedAt: '2026-05-23T10:05:00.000Z',
    images: {
      heroUrl: buildImageUrl(
        'Dunhuang Mogao Caves mural art, flying apsaras celestial beings, mineral pigment texture, ancient fresco surface, warm ochre and lapis blue palette, silk road aesthetic, premium collectible card',
        'portrait_16_9',
      ),
      thumbnailUrl: buildImageUrl(
        'Dunhuang Mogao Caves mural art, flying apsaras celestial beings, mineral pigment texture, ancient fresco surface, warm ochre and lapis blue palette, silk road aesthetic, premium collectible card',
        'portrait_4_3',
      ),
      shareUrl: buildImageUrl(
        'vertical poster of Dunhuang Mogao mural, mineral pigment ochre and blue, flying apsaras lines, silk road aesthetic, premium share poster',
        'portrait_16_9',
      ),
      alt: '敦煌莫高窟壁画风格刻迹（铸造中）',
    },
    story: '飞天的线条穿过千年落在你眼前。矿物颜料还没褪色，风沙还没停。',
    tags: ['敦煌', '壁画', '飞天'],
    materialKeywords: ['矿物颜料', '壁画肌理', '砂岩'],
    collectorNote: '铸造中状态示例，莫高窟壁画风格',
    isFavorite: false,
    isFeatured: false,
    generationStatus: 'generating',
    relatedIds: ['spacetime-001', 'spacetime-003'],
    metrics: { viewCount: 146, shareCount: 12, saveCount: 44 },
    share: {
      title: '敦煌莫高窟的刻迹正在铸造中',
      caption: '飞天的线条正在生成，稍后即可查看。',
      callToAction: '等待铸造完成后再生成海报。',
      hashtags: ['#铸造中', '#敦煌', '#刻迹'],
    },
    anchor: {
      latitude: 40.0415,
      longitude: 94.8039,
      timestamp: '2026-05-23T10:05:00.000Z',
      weatherCondition: '晴',
      temperature: 32,
      windDirection: '西',
      windLevel: 4,
      aqi: 45,
      aqiLevel: '优',
      locationName: '敦煌莫高窟',
      mintNumber: 156,
      earliestImprint: '2024-01-22',
      goldenLine: '飞天的线条穿过千年落在你眼前。',
    },
  },
];

// ── 查询函数 ──────────────────────────────────────────────────

export const collectibleStatusCounts = mockCollectibles.reduce<Record<CollectibleStatus, number>>(
  (counts, item) => {
    counts[item.generationStatus] += 1;
    return counts;
  },
  { idle: 0, queued: 0, generating: 0, complete: 0, failed: 0 },
);

export const recentCollectibles = sortByNewest(mockCollectibles);

export const featuredCollectibles = recentCollectibles.filter((item) => item.isFeatured);

export const favoriteCollectibles = recentCollectibles.filter((item) => item.isFavorite);

export const shareReadyCollectibles = recentCollectibles.filter(
  (item) => item.generationStatus === 'complete',
);

export function getCollectibleById(id: string) {
  return mockCollectibles.find((item) => item.id === id) ?? recentCollectibles[0];
}

export function getCollectiblesByKind(kind: CollectibleFilterValue) {
  if (kind === 'all') return recentCollectibles;
  return recentCollectibles.filter((item) => item.kind === kind);
}

export function getCollectiblesByStatus(status: CollectibleStatus | 'all') {
  if (status === 'all') return recentCollectibles;
  return recentCollectibles.filter((item) => item.generationStatus === status);
}

export function getRelatedCollectibles(id: string, limit = 3) {
  const source = getCollectibleById(id);
  return source.relatedIds
    .map((relatedId) => mockCollectibles.find((item) => item.id === relatedId))
    .filter((item): item is CollectibleItem => Boolean(item))
    .slice(0, limit);
}

export function getCollectiblesForSurface(surface: CollectibleSurface) {
  switch (surface) {
    case 'home':
      return uniqueById([...featuredCollectibles, ...recentCollectibles]).slice(0, 4);
    case 'share':
      return shareReadyCollectibles;
    case 'detail':
    case 'collection':
    default:
      return recentCollectibles;
  }
}
