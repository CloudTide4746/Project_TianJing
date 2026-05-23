import { collectibleThemeEntries } from '@/constants/collectible-theme';
import type {
  CollectibleFilterValue,
  CollectibleItem,
  CollectibleKind,
  CollectibleStatus,
  CollectibleSurface,
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

export const mockCollectibles: CollectibleItem[] = [
  {
    id: 'ruin-001',
    slug: 'north-gate-reborn',
    kind: 'ruin',
    title: '北城门的重光',
    subtitle: '夯土残垣在晨曦里重新站起',
    shortDescription: '用晨光和沙尘复原古城北门的尺度感，适合首页主视觉与详情页长图。',
    siteName: '天津蓟州古城遗址',
    province: '天津',
    district: '蓟州区',
    eraLabel: '明代城防遗构',
    createdAt: '2026-05-22T09:30:00.000Z',
    updatedAt: '2026-05-22T10:15:00.000Z',
    images: {
      heroUrl: buildImageUrl(
        'majestic reconstructed Chinese ancient city gate rising from weathered ruins at dawn, warm golden haze, cinematic architectural restoration, tactile earth wall textures, museum grade concept art, premium mobile app hero image',
        'portrait_16_9',
      ),
      thumbnailUrl: buildImageUrl(
        'weathered Chinese ancient gate ruins in warm dust tones, elegant reconstruction preview, premium collectible app thumbnail, high detail',
        'portrait_4_3',
      ),
      shareUrl: buildImageUrl(
        'vertical poster of restored ancient Chinese city gate emerging from ruins, gold foil accents, dramatic dawn sky, premium cultural collectible poster design',
        'portrait_16_9',
      ),
      alt: '晨光中的古城北门重建图',
    },
    story:
      '风从砖缝里吹过时，这座城门并没有沉默。它留下的不是残缺，而是曾经护住城池与归人的尺度。AI 依据遗址轮廓、夯土层次与城防逻辑，把一段被时间压低的立面重新抬起，让你看到它最接近完整的一次呼吸。',
    tags: ['重建', '夯土', '晨光'],
    materialKeywords: ['夯土', '城砖', '券门'],
    collectorNote: '适合作为首页 Hero 卡片，视觉中心稳定，金色高光明显。',
    isFavorite: true,
    isFeatured: true,
    generationStatus: 'complete',
    relatedIds: ['message-001', 'crystal-001'],
    metrics: {
      viewCount: 1284,
      shareCount: 168,
      saveCount: 402,
    },
    share: {
      title: '我把北城门的轮廓重新点亮了',
      caption: '在遗址的沉默里，看见一座城门重新抬起肩线。',
      callToAction: '打开海报，带走这段被重建的时间。',
      hashtags: ['#时间的回响', '#废墟重建图', '#天津蓟州古城'],
    },
  },
  {
    id: 'message-001',
    slug: 'kiln-fire-last-words',
    kind: 'message',
    title: '窑火熄灭前的留言',
    subtitle: '把残碎器物翻译成一张会说话的遗言卡',
    shortDescription: '以黑底、陶土与纸张质感构成叙事性强的卡面，适合分享页直接复用。',
    siteName: '独乐寺周边古窑址',
    province: '天津',
    district: '蓟州区',
    eraLabel: '辽金手工业遗存',
    createdAt: '2026-05-21T16:05:00.000Z',
    updatedAt: '2026-05-21T16:38:00.000Z',
    images: {
      heroUrl: buildImageUrl(
        'dramatic memorial card inspired by Chinese archaeological kiln ruins, charcoal black paper, terracotta fragments, warm parchment highlights, poetic museum exhibition aesthetic, premium collectible app artwork',
        'portrait_16_9',
      ),
      thumbnailUrl: buildImageUrl(
        'terracotta shard and black card composition, warm parchment highlight, premium cultural collectible thumbnail',
        'portrait_4_3',
      ),
      shareUrl: buildImageUrl(
        'vertical cultural poster featuring archaeological message card, black textured paper, terracotta fragments, elegant serif typography space, premium share poster',
        'portrait_16_9',
      ),
      alt: '黑底陶片遗言卡',
    },
    story:
      '碎裂的器口、烧痕与窑灰，像一句没说完的话停在指尖。系统没有替它虚构宏大叙事，而是把残片里最私人的温度提纯成一张遗言卡: 火曾经在这里旺盛，人也曾把日常托付给器物。',
    tags: ['遗言卡', '陶片', '手工业'],
    materialKeywords: ['窑灰', '陶片', '纸纹'],
    collectorNote: '标题和文案张力强，适合作为分享海报与详情叙事面板。',
    isFavorite: true,
    isFeatured: true,
    generationStatus: 'complete',
    relatedIds: ['ruin-001', 'message-002'],
    metrics: {
      viewCount: 963,
      shareCount: 204,
      saveCount: 351,
    },
    share: {
      title: '我替一段窑火留下了最后一句话',
      caption: '器物碎了，但留下的话还在发热。',
      callToAction: '保存这张遗言卡，把遗址的温度分享出去。',
      hashtags: ['#遗址遗言卡', '#古窑址', '#文化记忆'],
    },
  },
  {
    id: 'crystal-001',
    slug: 'river-haze-memory-crystal',
    kind: 'crystal',
    title: '河雾里的记忆结晶',
    subtitle: '把潮湿空气、砖石反光与水声凝成一枚晶体',
    shortDescription: '冷暖交织的晶体视觉带有明显高光结构，适合作为结果页和分享页核心图。',
    siteName: '海河近代工业遗存带',
    province: '天津',
    district: '河北区',
    eraLabel: '近代工业记忆',
    createdAt: '2026-05-20T11:40:00.000Z',
    updatedAt: '2026-05-20T12:10:00.000Z',
    images: {
      heroUrl: buildImageUrl(
        'luminous memory crystal hovering above historical riverside ruins in Tianjin, teal and gold reflections, misty atmosphere, premium sci art for cultural collectible app, cinematic detail',
        'portrait_16_9',
      ),
      thumbnailUrl: buildImageUrl(
        'teal gold memory crystal with historical masonry reflection, premium collectible thumbnail, soft mist',
        'portrait_4_3',
      ),
      shareUrl: buildImageUrl(
        'vertical premium poster of glowing memory crystal over riverside heritage ruins, teal gold palette, elegant negative space, collectible share design',
        'portrait_16_9',
      ),
      alt: '漂浮在河雾中的记忆结晶',
    },
    story:
      '你拍下的不是一面墙，而是墙面上那层会随水汽缓慢改写的光。于是系统没有直接重建建筑，而是把最难被保存的湿度、反光和回声凝成一枚记忆结晶，让遗址从物理空间转成可被携带的情绪实体。',
    tags: ['结晶', '河雾', '工业遗存'],
    materialKeywords: ['潮痕', '金属锈色', '玻璃反光'],
    collectorNote: '适合结果页顶部大图，也适合分享海报的中心图形。',
    isFavorite: false,
    isFeatured: true,
    generationStatus: 'complete',
    relatedIds: ['ruin-002', 'crystal-002'],
    metrics: {
      viewCount: 1108,
      shareCount: 146,
      saveCount: 287,
    },
    share: {
      title: '我把海河边的湿雾保存成了一枚结晶',
      caption: '有些历史不靠重建，而是靠光被记住。',
      callToAction: '查看海报，把这枚结晶留在相册里。',
      hashtags: ['#记忆结晶', '#海河记忆', '#工业遗存'],
    },
  },
  {
    id: 'ruin-002',
    slug: 'watchtower-under-reconstruction',
    kind: 'ruin',
    title: '风口上的烽燧',
    subtitle: '系统正在补全残缺墙线与瞭望结构',
    shortDescription: '处于生成中的重建图，用于生成页和收藏页的进行中状态展示。',
    siteName: '长城黄崖关段遗址',
    province: '天津',
    district: '蓟州区',
    eraLabel: '边防遗址',
    createdAt: '2026-05-23T08:12:00.000Z',
    updatedAt: '2026-05-23T08:20:00.000Z',
    images: {
      heroUrl: buildImageUrl(
        'ancient watchtower ruins on windy mountain ridge, partial architectural reconstruction in progress, dusty gold light, premium cultural app artwork, cinematic realism',
        'portrait_16_9',
      ),
      thumbnailUrl: buildImageUrl(
        'watchtower ruins on mountain ridge with reconstruction overlay, premium thumbnail, warm stone tones',
        'portrait_4_3',
      ),
      shareUrl: buildImageUrl(
        'vertical poster of mountain watchtower ruin with layered reconstruction lines, warm stone and gold, premium collectible poster',
        'portrait_16_9',
      ),
      alt: '山脊上的烽燧重建中',
    },
    story:
      '风先于图像抵达。它把墙体的断面吹得更清楚，也让系统判断出瞭望口、护墙与坡道之间的关系。这件作品还在显影，像一座正在回到山脊上的烽燧。',
    tags: ['烽燧', '山脊', '显影中'],
    materialKeywords: ['条石', '风化墙线', '瞭望口'],
    isFavorite: false,
    isFeatured: false,
    generationStatus: 'generating',
    relatedIds: ['ruin-001', 'crystal-001'],
    metrics: {
      viewCount: 146,
      shareCount: 12,
      saveCount: 44,
    },
    share: {
      title: '风口上的烽燧正在显影',
      caption: '这一次，我想先把生成中的过程也保存下来。',
      callToAction: '等待完成后再生成正式海报。',
      hashtags: ['#生成中', '#长城遗址', '#废墟重建图'],
    },
  },
  {
    id: 'message-002',
    slug: 'bronze-bell-unsent-message',
    kind: 'message',
    title: '未寄出的钟声',
    subtitle: '一张失败后保留下来的遗言草稿',
    shortDescription: '失败态示例，保留足够好的文案与预览，方便后续重试或展示失败态空窗。',
    siteName: '大寺遗址出土钟纽残件点位',
    province: '天津',
    district: '西青区',
    eraLabel: '礼制器物线索',
    createdAt: '2026-05-19T18:25:00.000Z',
    updatedAt: '2026-05-19T18:41:00.000Z',
    images: {
      heroUrl: buildImageUrl(
        'moody archaeological message card inspired by broken bronze bell fragment, charred paper edges, muted red and parchment palette, premium collectible concept art',
        'portrait_16_9',
      ),
      thumbnailUrl: buildImageUrl(
        'bronze bell fragment on muted red memorial card, premium thumbnail, textured paper',
        'portrait_4_3',
      ),
      shareUrl: buildImageUrl(
        'vertical poster with bronze bell fragment and unfinished memorial card, muted red and parchment, premium cultural share poster',
        'portrait_16_9',
      ),
      alt: '失败后保留的钟声遗言卡草稿',
    },
    story:
      '算法一度抓住了钟声的重量，却在最后的卡面封印阶段失去稳定。于是这件作品停在半途，留下比完成更动人的一层: 它像一封没能寄出的遗言，仍然保留着想被听见的欲望。',
    tags: ['失败态', '钟声', '草稿'],
    materialKeywords: ['铜锈', '残件', '纸边烧痕'],
    collectorNote: '很适合后续失败重试页面，视觉完整但保留中断感。',
    isFavorite: false,
    isFeatured: false,
    generationStatus: 'failed',
    relatedIds: ['message-001', 'crystal-002'],
    metrics: {
      viewCount: 322,
      shareCount: 18,
      saveCount: 57,
    },
    share: {
      title: '这张遗言卡停在了最后一笔',
      caption: '失败并不总是空白，有时它会留下最像心跳的一层。',
      callToAction: '保留草稿，或再次尝试显影。',
      hashtags: ['#生成失败', '#遗址遗言卡', '#未寄出的钟声'],
    },
  },
  {
    id: 'crystal-002',
    slug: 'salt-field-resonance-draft',
    kind: 'crystal',
    title: '盐田边的回声晶簇',
    subtitle: '排队中的结晶方案，等待最终折射参数',
    shortDescription: '排队态和待开始态共用的晶体方案，适合收藏页筛选和生成入口复用。',
    siteName: '汉沽盐业遗址线索点',
    province: '天津',
    district: '滨海新区',
    eraLabel: '盐业生产记忆',
    createdAt: '2026-05-23T07:00:00.000Z',
    updatedAt: '2026-05-23T07:05:00.000Z',
    images: {
      heroUrl: buildImageUrl(
        'cluster of translucent memory crystals inspired by historic salt field ruins, teal blue reflections, mineral texture, premium cultural collectible artwork, crisp lighting',
        'portrait_16_9',
      ),
      thumbnailUrl: buildImageUrl(
        'translucent crystal cluster with salt field textures, premium collectible thumbnail, teal blue palette',
        'portrait_4_3',
      ),
      shareUrl: buildImageUrl(
        'vertical premium poster of mineral memory crystal cluster over historic salt field ruins, teal blue and gold accents',
        'portrait_16_9',
      ),
      alt: '盐田回声晶簇方案',
    },
    story:
      '盐会在空气里留下极轻的白，也会在金属表面留下漫长的时间。这个方案尚未进入完整显影，它先把盐粒、反光和劳作节奏聚拢成一簇待完成的回声。',
    tags: ['排队中', '盐田', '晶簇'],
    materialKeywords: ['盐粒反光', '矿物纹理', '潮线'],
    isFavorite: true,
    isFeatured: false,
    generationStatus: 'queued',
    relatedIds: ['crystal-001', 'message-002'],
    metrics: {
      viewCount: 208,
      shareCount: 9,
      saveCount: 71,
    },
    share: {
      title: '盐田边的回声，正在排队显影',
      caption: '先把这一簇光存起来，等它完成最终折射。',
      callToAction: '继续等待，或切换到别的方案先创作。',
      hashtags: ['#排队中', '#记忆结晶', '#盐业遗址'],
    },
  },
];

export const collectibleStatusCounts = mockCollectibles.reduce<Record<CollectibleStatus, number>>(
  (counts, item) => {
    counts[item.generationStatus] += 1;
    return counts;
  },
  {
    idle: 0,
    queued: 0,
    generating: 0,
    complete: 0,
    failed: 0,
  },
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
  if (kind === 'all') {
    return recentCollectibles;
  }

  return recentCollectibles.filter((item) => item.kind === kind);
}

export function getCollectiblesByStatus(status: CollectibleStatus | 'all') {
  if (status === 'all') {
    return recentCollectibles;
  }

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
