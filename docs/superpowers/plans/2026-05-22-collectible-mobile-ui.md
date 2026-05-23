# Collectible Mobile UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first React Native UI template for the AI collectible app with complete fake-data flows, polished states, and the `color-scheme.md` visual system.

**Architecture:** Keep the existing Expo Router app and replace the starter tabs with a mobile product shell. Use typed mock data, route-driven screens, reusable surface primitives, and a small fake AI state machine so every key path feels real even before backend integration. Preserve the requested Tailwind/shadcn direction by using NativeWind-style utility classes and shadcn-inspired component patterns, while using Reanimated for native motion instead of Framer Motion.

**Tech Stack:** Expo Router, React Native, TypeScript, NativeWind-style `className` utilities, React Native Reanimated, Expo Image, fake local data modules, theme tokens derived from `color-scheme.md`

---

## File Structure

### App Routes

- Modify: `src/app/_layout.tsx`  
  Replace starter theme wrapper usage with the product navigation shell.
- Replace: `src/app/index.tsx`  
  Home screen for brand story, quick actions, and recent collectibles.
- Replace: `src/app/explore.tsx`  
  Collection screen for saved works, filters, empty states, and management actions.
- Create: `src/app/create.tsx`  
  Upload, metadata entry, and collectible type selection.
- Create: `src/app/generating.tsx`  
  Fake AI progress page with staged copy, cancel, and retry patterns.
- Create: `src/app/result/[id].tsx`  
  Detailed collectible result page with image, story, actions, and related metadata.
- Create: `src/app/share/[id].tsx`  
  Share preview and fake export actions.

### Theme And Data

- Modify: `src/constants/theme.ts`  
  Replace starter colors with the collectible theme tokens from `color-scheme.md`.
- Modify: `src/global.css`  
  Add typography and CSS variables used by web and utility styling.
- Create: `src/constants/collectible-theme.ts`  
  A/B/C type-specific colors, gradients, and semantic helpers.
- Create: `src/types/collectible.ts`  
  Shared TypeScript types for collectible items, statuses, filters, and share data.
- Create: `src/data/mock-collectibles.ts`  
  Seed data for home feed, collection, detail pages, and related works.
- Create: `src/data/mock-generation.ts`  
  Fake AI generation phases, timing, and alternate outcomes.

### Reusable UI

- Create: `src/components/ui/screen-shell.tsx`  
  Shared page container with safe area, background texture, and header support.
- Create: `src/components/ui/section-header.tsx`  
  Reusable title + subtitle + action pattern.
- Create: `src/components/ui/glow-card.tsx`  
  The core shadcn-inspired card surface.
- Create: `src/components/ui/primary-button.tsx`  
  Variants for primary, secondary, ghost, destructive, and loading.
- Create: `src/components/ui/status-pill.tsx`  
  Small status label for tags, progress states, and filters.
- Create: `src/components/ui/type-selector.tsx`  
  A/B/C type cards with active, hover-like, and pressed states.
- Create: `src/components/ui/upload-dropzone.tsx`  
  Image placeholder area with replace/remove actions and fake validation messages.
- Create: `src/components/ui/progress-ritual.tsx`  
  Staged fake AI progress component using Reanimated.
- Create: `src/components/ui/empty-state.tsx`  
  Shared empty-state block for no collection, no history, no results.
- Create: `src/components/ui/action-sheet.tsx`  
  Reusable bottom action area for share/delete/regenerate options.

### Feature Components

- Create: `src/components/home/hero-banner.tsx`
- Create: `src/components/home/recent-collectible-strip.tsx`
- Create: `src/components/collection/collection-filter-bar.tsx`
- Create: `src/components/collection/collectible-list-item.tsx`
- Create: `src/components/create/metadata-form.tsx`
- Create: `src/components/result/result-hero.tsx`
- Create: `src/components/result/story-panel.tsx`
- Create: `src/components/share/share-poster-preview.tsx`

---

### Task 1: Establish The Mobile UI Foundation

**Files:**
- Modify: `src/constants/theme.ts`
- Modify: `src/global.css`
- Create: `src/constants/collectible-theme.ts`
- Modify: `src/app/_layout.tsx`

- [ ] **Step 1: Replace starter color tokens with the collectible palette**

```ts
export const Colors = {
  light: {
    text: '#f0e8d8',
    background: '#1a1714',
    backgroundElement: '#2d2520',
    backgroundSelected: '#3d322b',
    textSecondary: '#a89880',
    textMuted: '#6b5d4f',
    border: '#3d322b',
    success: '#6b8c5a',
    error: '#c75040',
    gold: '#d4a853',
  },
  dark: {
    text: '#f0e8d8',
    background: '#1a1714',
    backgroundElement: '#2d2520',
    backgroundSelected: '#3d322b',
    textSecondary: '#a89880',
    textMuted: '#6b5d4f',
    border: '#3d322b',
    success: '#6b8c5a',
    error: '#c75040',
    gold: '#d4a853',
  },
} as const;
```

- [ ] **Step 2: Add collectible-specific theme helpers**

```ts
export const CollectibleThemes = {
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
} as const;
```

- [ ] **Step 3: Align global typography variables with the design doc**

```css
:root {
  --font-display: "Noto Serif SC", "Source Han Serif SC", serif;
  --font-sans: "Noto Sans SC", "PingFang SC", system-ui, sans-serif;
  --font-accent: "LXGW WenKai", "KaiTi", serif;
  --font-mono: "Outfit", "Roboto Mono", monospace;
  --color-bg-deep: #1a1714;
  --color-bg-card: #2d2520;
  --color-bg-border: #3d322b;
  --color-text-primary: #f0e8d8;
  --color-text-secondary: #a89880;
  --color-text-muted: #6b5d4f;
  --color-gold: #d4a853;
}
```

- [ ] **Step 4: Simplify the app layout to a product shell**

```tsx
export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#1a1714' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="create" />
        <Stack.Screen name="generating" />
        <Stack.Screen name="result/[id]" />
        <Stack.Screen name="share/[id]" />
        <Stack.Screen name="explore" />
      </Stack>
    </ThemeProvider>
  );
}
```

- [ ] **Step 5: Run static verification**

Run: `npm run lint`  
Expected: lint task runs successfully or reports only pre-existing starter issues to fix in the next task.

- [ ] **Step 6: Commit**

```bash
git add src/constants/theme.ts src/constants/collectible-theme.ts src/global.css src/app/_layout.tsx
git commit -m "feat: establish collectible mobile theme foundation"
```

---

### Task 2: Create Typed Fake Data And Flow Models

**Files:**
- Create: `src/types/collectible.ts`
- Create: `src/data/mock-collectibles.ts`
- Create: `src/data/mock-generation.ts`

- [ ] **Step 1: Define the shared collectible types**

```ts
export type CollectibleKind = 'ruin' | 'message' | 'crystal';

export type CollectibleStatus = 'idle' | 'queued' | 'generating' | 'complete' | 'failed';

export interface CollectibleItem {
  id: string;
  kind: CollectibleKind;
  title: string;
  subtitle: string;
  siteName: string;
  province: string;
  imageUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  story: string;
  tags: string[];
  isFavorite: boolean;
  generationStatus: CollectibleStatus;
}

export interface GenerationPhase {
  id: string;
  label: string;
  detail: string;
  progress: number;
}
```

- [ ] **Step 2: Create realistic mock collectible records**

```ts
export const mockCollectibles: CollectibleItem[] = [
  {
    id: 'ruin-001',
    kind: 'ruin',
    title: '北城门的重光',
    subtitle: '夯土残垣在晨曦中复生',
    siteName: '天津蓟州古城遗址',
    province: '天津',
    imageUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ancient%20ruins%20rebuilt%20into%20a%20majestic%20Chinese%20gate%20at%20dawn%2C%20warm%20golden%20light%2C%20architectural%20reconstruction%2C%20cinematic%2C%20mobile%20app%20hero%20image&image_size=portrait_16_9',
    thumbnailUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=weathered%20ancient%20stone%20ruins%20with%20warm%20dusty%20tones%2C%20mobile%20thumbnail&image_size=portrait_4_3',
    createdAt: '2026-05-22T09:30:00.000Z',
    story: '你所拍下的废墟，并不是结束，而是一段被风沙藏起的重建史。',
    tags: ['重建', '夯土', '晨光'],
    isFavorite: true,
    generationStatus: 'complete',
  },
];
```

- [ ] **Step 3: Create fake generation progress phases**

```ts
export const mockGenerationPhases: GenerationPhase[] = [
  { id: 'analyze', label: '识别遗址轮廓', detail: 'AI 正在辨认砖石、夯土与风化层级', progress: 0.2 },
  { id: 'restore', label: '推演历史原貌', detail: '正在构建遗址曾经的空间秩序', progress: 0.48 },
  { id: 'narrate', label: '编织记忆叙事', detail: '把图像、地点与文化语义凝成藏品故事', progress: 0.76 },
  { id: 'finish', label: '生成藏品光印', detail: '鎏金纹理与最终卡面正在显影', progress: 1 },
];
```

- [ ] **Step 4: Export helper selectors**

```ts
export const getCollectibleById = (id: string) =>
  mockCollectibles.find((item) => item.id === id) ?? mockCollectibles[0];

export const getCollectiblesByKind = (kind: CollectibleKind | 'all') =>
  kind === 'all' ? mockCollectibles : mockCollectibles.filter((item) => item.kind === kind);
```

- [ ] **Step 5: Run static verification**

Run: `npm run lint`  
Expected: new TypeScript data modules pass without unused exports or type errors.

- [ ] **Step 6: Commit**

```bash
git add src/types/collectible.ts src/data/mock-collectibles.ts src/data/mock-generation.ts
git commit -m "feat: add typed mock collectible data"
```

---

### Task 3: Build Reusable Surface Components

**Files:**
- Create: `src/components/ui/screen-shell.tsx`
- Create: `src/components/ui/section-header.tsx`
- Create: `src/components/ui/glow-card.tsx`
- Create: `src/components/ui/primary-button.tsx`
- Create: `src/components/ui/status-pill.tsx`
- Create: `src/components/ui/type-selector.tsx`
- Create: `src/components/ui/upload-dropzone.tsx`
- Create: `src/components/ui/progress-ritual.tsx`
- Create: `src/components/ui/empty-state.tsx`
- Create: `src/components/ui/action-sheet.tsx`

- [ ] **Step 1: Create the shared screen shell**

```tsx
export function ScreenShell({ children, title, subtitle }: ScreenShellProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1714' }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <View style={{ gap: 8 }}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
```

- [ ] **Step 2: Create a shadcn-inspired card and button pair**

```tsx
export function GlowCard({ children, tone = 'default' }: GlowCardProps) {
  return (
    <View style={[styles.card, toneStyles[tone]]}>
      {children}
    </View>
  );
}

export function PrimaryButton({ label, variant = 'primary', loading, ...props }: PrimaryButtonProps) {
  return (
    <Pressable {...props} style={({ pressed }) => [styles.button, variantStyles[variant], pressed && styles.pressed]}>
      <Text style={styles.buttonText}>{loading ? '处理中...' : label}</Text>
    </Pressable>
  );
}
```

- [ ] **Step 3: Create the collectible type selector**

```tsx
export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <View style={{ gap: 12 }}>
      {(['ruin', 'message', 'crystal'] as const).map((kind) => (
        <Pressable key={kind} onPress={() => onChange(kind)}>
          <GlowCard tone={kind === value ? kind : 'default'}>
            <Text>{kind}</Text>
          </GlowCard>
        </Pressable>
      ))}
    </View>
  );
}
```

- [ ] **Step 4: Create the fake upload and progress components**

```tsx
export function UploadDropzone({ imageUrl, onPick, onRemove }: UploadDropzoneProps) {
  return imageUrl ? (
    <GlowCard tone="default">
      <Image source={{ uri: imageUrl }} style={{ width: '100%', height: 220, borderRadius: 16 }} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <PrimaryButton label="替换照片" variant="secondary" onPress={onPick} />
        <PrimaryButton label="删除" variant="ghost" onPress={onRemove} />
      </View>
    </GlowCard>
  ) : (
    <Pressable onPress={onPick}>
      <GlowCard tone="default">
        <Text>上传遗址照片</Text>
        <Text>支持 JPG / PNG，建议竖图</Text>
      </GlowCard>
    </Pressable>
  );
}
```

```tsx
export function ProgressRitual({ phase, progress }: ProgressRitualProps) {
  return (
    <GlowCard tone="crystal">
      <Text>{phase.label}</Text>
      <Text>{phase.detail}</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.bar, { width: `${progress * 100}%` }]} />
      </View>
    </GlowCard>
  );
}
```

- [ ] **Step 5: Run static verification**

Run: `npm run lint`  
Expected: component modules compile cleanly and expose consistent props.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui
git commit -m "feat: add reusable collectible ui primitives"
```

---

### Task 4: Implement Home And Collection Screens

**Files:**
- Replace: `src/app/index.tsx`
- Replace: `src/app/explore.tsx`
- Create: `src/components/home/hero-banner.tsx`
- Create: `src/components/home/recent-collectible-strip.tsx`
- Create: `src/components/collection/collection-filter-bar.tsx`
- Create: `src/components/collection/collectible-list-item.tsx`

- [ ] **Step 1: Build the home screen**

```tsx
export default function HomeScreen() {
  return (
    <ScreenShell title="时间的回响" subtitle="把你的遗址照片，生成独一无二的数字藏品。">
      <HeroBanner />
      <GlowCard tone="default">
        <SectionHeader title="三种藏品" subtitle="选择一种方式，与历史对话" />
        <TypeSelector value="ruin" onChange={() => undefined} />
      </GlowCard>
      <RecentCollectibleStrip items={mockCollectibles.slice(0, 3)} />
      <PrimaryButton label="开始创作" onPress={() => router.push('/create')} />
    </ScreenShell>
  );
}
```

- [ ] **Step 2: Build the collection screen with filters and empty states**

```tsx
export default function CollectionScreen() {
  const [filter, setFilter] = useState<'all' | CollectibleKind>('all');
  const items = getCollectiblesByKind(filter);

  return (
    <ScreenShell title="我的收藏" subtitle="你与遗址共同生成的记忆档案">
      <CollectionFilterBar value={filter} onChange={setFilter} />
      {items.length ? (
        items.map((item) => <CollectibleListItem key={item.id} item={item} />)
      ) : (
        <EmptyState title="还没有收藏作品" description="完成一次生成后，作品会出现在这里。" />
      )}
    </ScreenShell>
  );
}
```

- [ ] **Step 3: Add delete, favorite, and list item action affordances**

```tsx
export function CollectibleListItem({ item }: { item: CollectibleItem }) {
  return (
    <Pressable onPress={() => router.push(`/result/${item.id}`)}>
      <GlowCard tone={item.kind}>
        <Image source={{ uri: item.thumbnailUrl }} style={{ width: 88, height: 88, borderRadius: 14 }} />
        <Text>{item.title}</Text>
        <Text>{item.subtitle}</Text>
        <Text>{item.siteName}</Text>
      </GlowCard>
    </Pressable>
  );
}
```

- [ ] **Step 4: Run static verification**

Run: `npm run lint`  
Expected: home and collection screens compile without route or props issues.

- [ ] **Step 5: Commit**

```bash
git add src/app/index.tsx src/app/explore.tsx src/components/home src/components/collection
git commit -m "feat: implement home and collection template screens"
```

---

### Task 5: Implement The Creation Flow

**Files:**
- Create: `src/app/create.tsx`
- Create: `src/components/create/metadata-form.tsx`
- Reuse: `src/components/ui/upload-dropzone.tsx`
- Reuse: `src/components/ui/type-selector.tsx`

- [ ] **Step 1: Build the metadata form**

```tsx
export function MetadataForm({ title, siteName, province, onChange }: MetadataFormProps) {
  return (
    <GlowCard tone="default">
      <TextInput value={title} onChangeText={(value) => onChange('title', value)} placeholder="给这次记忆起个名字" />
      <TextInput value={siteName} onChangeText={(value) => onChange('siteName', value)} placeholder="遗址名称" />
      <TextInput value={province} onChangeText={(value) => onChange('province', value)} placeholder="地点 / 城市" />
    </GlowCard>
  );
}
```

- [ ] **Step 2: Assemble the create screen**

```tsx
export default function CreateScreen() {
  const [selectedType, setSelectedType] = useState<CollectibleKind>('ruin');
  const [imageUrl, setImageUrl] = useState(mockCollectibles[0].imageUrl);
  const [form, setForm] = useState({ title: '', siteName: '', province: '' });

  return (
    <ScreenShell title="开始创作" subtitle="上传一张遗址照片，AI 将把它变成可收藏的作品。">
      <UploadDropzone imageUrl={imageUrl} onPick={() => setImageUrl(mockCollectibles[0].imageUrl)} onRemove={() => setImageUrl('')} />
      <MetadataForm title={form.title} siteName={form.siteName} province={form.province} onChange={(key, value) => setForm((prev) => ({ ...prev, [key]: value }))} />
      <TypeSelector value={selectedType} onChange={setSelectedType} />
      <PrimaryButton label="开始生成" onPress={() => router.push('/generating')} />
    </ScreenShell>
  );
}
```

- [ ] **Step 3: Add interaction completeness**

```tsx
const disabled = !imageUrl || !form.siteName.trim();

<PrimaryButton
  label="开始生成"
  disabled={disabled}
  onPress={() => router.push('/generating')}
/>
```

- [ ] **Step 4: Run static verification**

Run: `npm run lint`  
Expected: create route passes type checks and button states remain consistent.

- [ ] **Step 5: Commit**

```bash
git add src/app/create.tsx src/components/create/metadata-form.tsx
git commit -m "feat: build collectible creation flow"
```

---

### Task 6: Implement Generating, Result, And Share Screens

**Files:**
- Create: `src/app/generating.tsx`
- Create: `src/app/result/[id].tsx`
- Create: `src/app/share/[id].tsx`
- Create: `src/components/result/result-hero.tsx`
- Create: `src/components/result/story-panel.tsx`
- Create: `src/components/share/share-poster-preview.tsx`

- [ ] **Step 1: Build the generating screen with staged fake AI**

```tsx
export default function GeneratingScreen() {
  const [index, setIndex] = useState(0);
  const phase = mockGenerationPhases[index];

  useEffect(() => {
    if (index >= mockGenerationPhases.length - 1) {
      const timeout = setTimeout(() => router.replace('/result/ruin-001'), 900);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setIndex((current) => current + 1), 1200);
    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <ScreenShell title="AI 正在显影" subtitle="请稍候，记忆正在被凝结为藏品。">
      <ProgressRitual phase={phase} progress={phase.progress} />
      <PrimaryButton label="取消返回" variant="ghost" onPress={() => router.back()} />
    </ScreenShell>
  );
}
```

- [ ] **Step 2: Build the result detail screen**

```tsx
export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getCollectibleById(id);

  return (
    <ScreenShell title={item.title} subtitle={item.subtitle}>
      <ResultHero item={item} />
      <StoryPanel story={item.story} tags={item.tags} />
      <PrimaryButton label="分享藏品" onPress={() => router.push(`/share/${item.id}`)} />
      <PrimaryButton label="重新生成" variant="secondary" onPress={() => router.push('/generating')} />
    </ScreenShell>
  );
}
```

- [ ] **Step 3: Build the share preview page**

```tsx
export default function ShareScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getCollectibleById(id);

  return (
    <ScreenShell title="分享藏品" subtitle="把这段与历史的相遇，保存成一张海报。">
      <SharePosterPreview item={item} />
      <ActionSheet
        actions={[
          { id: 'save', label: '保存图片' },
          { id: 'copy', label: '复制文案' },
          { id: 'back', label: '返回作品', variant: 'ghost' },
        ]}
      />
    </ScreenShell>
  );
}
```

- [ ] **Step 4: Add failure and retry variants**

```tsx
const failedPhase = {
  title: '生成暂时中断',
  description: '风格纹理已载入，但最终卡面还未完成。',
};

<EmptyState
  title={failedPhase.title}
  description={failedPhase.description}
  actionLabel="重新生成"
  onAction={() => setIndex(0)}
/>
```

- [ ] **Step 5: Run static verification**

Run: `npm run lint`  
Expected: generating, result, and share routes compile cleanly and dynamic route params are typed.

- [ ] **Step 6: Commit**

```bash
git add src/app/generating.tsx src/app/result src/app/share src/components/result src/components/share
git commit -m "feat: add generation result and share templates"
```

---

### Task 7: Add Motion, Completeness, And Final QA

**Files:**
- Modify: `src/components/ui/glow-card.tsx`
- Modify: `src/components/ui/progress-ritual.tsx`
- Modify: `src/app/index.tsx`
- Modify: `src/app/create.tsx`
- Modify: `src/app/explore.tsx`
- Modify: `src/app/result/[id].tsx`

- [ ] **Step 1: Add subtle native motion using Reanimated**

```tsx
const scale = useSharedValue(1);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

<Pressable
  onPressIn={() => {
    scale.value = withTiming(0.98, { duration: 120 });
  }}
  onPressOut={() => {
    scale.value = withTiming(1, { duration: 160 });
  }}>
  <Animated.View style={animatedStyle}>{children}</Animated.View>
</Pressable>
```

- [ ] **Step 2: Complete the missing interaction states**

```tsx
type UiState = 'default' | 'loading' | 'success' | 'error' | 'empty' | 'disabled';

const stateCopy = {
  loading: 'AI 正在读取时间纹理',
  success: '藏品已完成并收入你的收藏夹',
  error: '这次显影失败了，请稍后重试',
  empty: '先创作第一件作品，收藏页才会亮起来',
};
```

- [ ] **Step 3: Add top-to-bottom visual consistency polish**

```tsx
const headerAccent = item.kind === 'crystal' ? '#4a9b8a' : item.kind === 'message' ? '#c75040' : '#c4956a';

<View style={{ height: 1, backgroundColor: headerAccent, opacity: 0.35 }} />
```

- [ ] **Step 4: Run diagnostics and lint**

Run: `npm run lint`  
Expected: no introduced lint errors.

Run: `npx tsc --noEmit`  
Expected: no TypeScript errors.

- [ ] **Step 5: Manual smoke verification**

Run: `npm run web`  
Expected:
- Home screen renders with dark warm background and gold-accent hierarchy
- Create flow renders fake image upload and A/B/C type selection
- Generating screen auto-advances to a result page
- Collection screen shows seeded entries and empty state if data is filtered away
- Share page shows a poster preview and action buttons

- [ ] **Step 6: Commit**

```bash
git add src/app src/components
git commit -m "feat: polish collectible mobile ui templates"
```

---

## Self-Review

- **Spec coverage:** Covers the requested mobile-first page templates, fake AI flows, complete feature shells, polished states, and the `color-scheme.md` design language.
- **Placeholder scan:** No `TODO` or unresolved placeholders remain in the plan.
- **Type consistency:** Uses the same `CollectibleKind`, `CollectibleItem`, and route structure across all tasks.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-22-collectible-mobile-ui.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
