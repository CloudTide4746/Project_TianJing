# 分享页微信发布工作台 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把当前 `分享页` 从“海报模板展示页”重构为面向微信生态的发布工作台，支持轻编辑、场景提示和明确的发布动作链路。

**Architecture:** 保留现有 Expo Router 路由、主题色体系和 `ScreenShell` / `GlowCard` / `PrimaryButton` 等基础组件，只重构 `share/[id].tsx` 的页面结构，并新增 3 个职责单一的分享组件。分享数据仍来自 `CollectibleItem.share`，页面内通过本地 `draft` 状态承载短句、标题、正文和标签编辑，再把这些状态分发给预览、提示和操作面板。

**Tech Stack:** Expo Router, React Native, TypeScript, `StyleSheet`, `TextInput`, existing theme tokens in `src/constants/theme.ts` and `src/constants/collectible-theme.ts`

---

## File Structure

- Modify: `src/app/share/[id].tsx`  
  重新组织分享页结构，接入本地编辑状态、空状态和新的发布动作面板。
- Modify: `src/components/share/share-poster-preview.tsx`  
  把当前大海报展示卡改成紧凑型预览卡，并支持读取编辑态文案。
- Create: `src/components/share/share-composer-card.tsx`  
  新建分享编辑面板，负责短句、标题、正文、标签的轻编辑。
- Create: `src/components/share/share-channel-hints.tsx`  
  新建微信场景提示卡，集中承载朋友圈 / 群分享 / 公众号草稿建议。
- Create: `src/components/share/share-action-panel.tsx`  
  新建发布动作面板，替换当前 `ActionSheet`。
- Verify: `src/components/ui/primary-button.tsx`  
  只复用现有 `sm` / `ghost` / `secondary` 能力，不改动实现，避免扩散范围。

---

### Task 1: 创建分享编辑面板组件

**Files:**
- Create: `src/components/share/share-composer-card.tsx`

- [ ] **Step 1: 定义可复用的分享草稿类型和组件接口**

```tsx
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import {
  FoundationColors,
  getCollectibleTheme,
  type CollectibleThemeId,
} from '@/constants/collectible-theme';
import { Fonts, Spacing } from '@/constants/theme';

import { ThemedText } from '../themed-text';
import { GlowCard } from '../ui/glow-card';
import { SectionHeader } from '../ui/section-header';
import { StatusPill } from '../ui/status-pill';

export type ShareDraft = {
  hook: string;
  title: string;
  caption: string;
  hashtags: string[];
};

type EditableShareField = 'hook' | 'title' | 'caption';

type ShareComposerCardProps = {
  draft: ShareDraft;
  tagInput: string;
  tone?: CollectibleThemeId | 'default';
  statusMessage?: string;
  onChangeField: (field: EditableShareField, value: string) => void;
  onChangeTagInput: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
};
```

- [ ] **Step 2: 实现编辑区主体结构**

```tsx
const fieldConfigs: {
  key: EditableShareField;
  label: string;
  placeholder: string;
  multiline?: boolean;
  description: string;
}[] = [
  {
    key: 'hook',
    label: '朋友圈短句',
    placeholder: '先写一句适合发朋友圈首行的话',
    description: '更适合作为首句或引导语',
  },
  {
    key: 'title',
    label: '分享标题',
    placeholder: '给这次分享一个更口语化的标题',
    description: '用于转发标题或群分享开头',
  },
  {
    key: 'caption',
    label: '分享正文',
    placeholder: '整理一段可直接复制的正文',
    description: '适合朋友圈正文或公众号草稿',
    multiline: true,
  },
];

export function ShareComposerCard({
  draft,
  tagInput,
  tone = 'default',
  statusMessage,
  onChangeField,
  onChangeTagInput,
  onAddTag,
  onRemoveTag,
}: ShareComposerCardProps) {
  return (
    <GlowCard tone={tone}>
      <SectionHeader
        subtitle="先整理图文，再去微信生态发布"
        title="分享内容"
        trailing={<StatusPill dot={false} label="可直接编辑" tone={tone} />}
      />

      <View style={styles.form}>
        {fieldConfigs.map((field) => (
          <View key={field.key} style={styles.field}>
            <View style={styles.labelRow}>
              <ThemedText style={styles.label}>{field.label}</ThemedText>
              <ThemedText themeColor="textMuted" style={styles.helperText}>
                {field.description}
              </ThemedText>
            </View>
            <TextInput
              autoCapitalize={field.key === 'caption' ? 'sentences' : 'sentences'}
              autoCorrect={false}
              multiline={field.multiline}
              onChangeText={(value) => onChangeField(field.key, value)}
              placeholder={field.placeholder}
              placeholderTextColor={FoundationColors.textMuted}
              selectionColor={getAccentColor(tone)}
              style={[styles.input, field.multiline && styles.inputMultiline]}
              textAlignVertical={field.multiline ? 'top' : 'center'}
              value={draft[field.key]}
            />
          </View>
        ))}
      </View>
```

- [ ] **Step 3: 实现标签编辑区和状态提示**

```tsx
      <View style={styles.tagSection}>
        <View style={styles.labelRow}>
          <ThemedText style={styles.label}>推荐标签</ThemedText>
          <ThemedText themeColor="textMuted" style={styles.helperText}>
            默认保留 3 个左右更利于直接发送
          </ThemedText>
        </View>

        <View style={styles.tagRow}>
          {draft.hashtags.map((tag) => (
            <Pressable key={tag} onPress={() => onRemoveTag(tag)} style={styles.tagChip}>
              <ThemedText style={styles.tagText}>{tag}</ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={styles.tagInputRow}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={onChangeTagInput}
            onSubmitEditing={onAddTag}
            placeholder="输入标签后回车或点添加"
            placeholderTextColor={FoundationColors.textMuted}
            selectionColor={getAccentColor(tone)}
            style={[styles.input, styles.tagInput]}
            value={tagInput}
          />
          <Pressable onPress={onAddTag} style={styles.addTagButton}>
            <ThemedText style={styles.addTagText}>添加</ThemedText>
          </Pressable>
        </View>

        {statusMessage ? (
          <ThemedText themeColor="textSecondary" style={styles.statusText}>
            {statusMessage}
          </ThemedText>
        ) : null}
      </View>
    </GlowCard>
  );
}
```

- [ ] **Step 4: 写入样式和辅助函数**

```tsx
function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function getAccentColor(tone: CollectibleThemeId | 'default') {
  return tone === 'default' ? FoundationColors.gold : getCollectibleTheme(tone).primary;
}

const styles = StyleSheet.create({
  form: {
    gap: 14,
  },
  field: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  label: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: 700,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 16,
  },
  input: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: withAlpha(FoundationColors.gold, 0.2),
    backgroundColor: withAlpha(FoundationColors.backgroundBright, 0.92),
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 21,
    color: FoundationColors.text,
  },
  inputMultiline: {
    minHeight: 116,
  },
  tagSection: {
    gap: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: withAlpha(FoundationColors.backgroundSelected, 0.9),
  },
  tagText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 600,
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
  },
  addTagButton: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withAlpha(FoundationColors.gold, 0.12),
  },
  addTagText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 700,
  },
  statusText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
```

- [ ] **Step 5: 运行组件 lint**

Run: `npm run lint -- src/components/share/share-composer-card.tsx`  
Expected: `share-composer-card.tsx` 没有新增 lint 错误

- [ ] **Step 6: Commit**

```bash
git add src/components/share/share-composer-card.tsx
git commit -m "feat: add share composer workbench card"
```

---

### Task 2: 创建微信场景提示和动作面板组件

**Files:**
- Create: `src/components/share/share-channel-hints.tsx`
- Create: `src/components/share/share-action-panel.tsx`

- [ ] **Step 1: 实现场景提示组件**

```tsx
// src/components/share/share-channel-hints.tsx
import { StyleSheet, View } from 'react-native';

import type { CollectibleThemeId } from '@/constants/collectible-theme';
import { Spacing } from '@/constants/theme';

import { ThemedText } from '../themed-text';
import { GlowCard } from '../ui/glow-card';
import { SectionHeader } from '../ui/section-header';

type ShareChannelHintsProps = {
  tone?: CollectibleThemeId | 'default';
};

const hintItems = [
  {
    title: '发朋友圈',
    description: '优先使用短句和海报图，首行尽量短，利于停留。',
  },
  {
    title: '发群分享',
    description: '复制正文后补一句个人感受，会更像真实转发。',
  },
  {
    title: '公众号草稿',
    description: '保留标题和正文主体，再按需要继续扩写。',
  },
];

export function ShareChannelHints({ tone = 'default' }: ShareChannelHintsProps) {
  return (
    <GlowCard tone={tone}>
      <SectionHeader
        subtitle="不用切渠道，先知道这些内容更适合怎么发"
        title="微信场景提示"
      />
      <View style={styles.list}>
        {hintItems.map((item) => (
          <View key={item.title} style={styles.row}>
            <ThemedText style={styles.title}>{item.title}</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.description}>
              {item.description}
            </ThemedText>
          </View>
        ))}
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },
  row: {
    gap: 4,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 700,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
  },
});
```

- [ ] **Step 2: 实现动作面板组件**

```tsx
// src/components/share/share-action-panel.tsx
import { StyleSheet, View } from 'react-native';

import type { CollectibleThemeId } from '@/constants/collectible-theme';
import { Spacing } from '@/constants/theme';

import { ThemedText } from '../themed-text';
import { GlowCard } from '../ui/glow-card';
import { PrimaryButton } from '../ui/primary-button';
import { SectionHeader } from '../ui/section-header';

type ShareActionPanelProps = {
  tone?: CollectibleThemeId | 'default';
  statusMessage?: string;
  onShare: () => void;
  onCopy: () => void;
  onSave: () => void;
  onBack: () => void;
};

export function ShareActionPanel({
  tone = 'default',
  statusMessage,
  onShare,
  onCopy,
  onSave,
  onBack,
}: ShareActionPanelProps) {
  return (
    <GlowCard tone={tone}>
      <SectionHeader
        subtitle="整理完成后，按微信生态常用顺序操作"
        title="发布操作"
      />

      {statusMessage ? (
        <ThemedText themeColor="textSecondary" style={styles.status}>
          {statusMessage}
        </ThemedText>
      ) : null}

      <View style={styles.primaryAction}>
        <PrimaryButton label="去分享" onPress={onShare} tone={tone} />
      </View>

      <View style={styles.secondaryActions}>
        <PrimaryButton label="复制文案" onPress={onCopy} tone={tone} variant="secondary" />
        <PrimaryButton label="保存图片" onPress={onSave} tone={tone} variant="secondary" />
        <PrimaryButton label="返回作品" onPress={onBack} variant="ghost" />
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  status: {
    fontSize: 12,
    lineHeight: 18,
  },
  primaryAction: {
    gap: Spacing.two,
  },
  secondaryActions: {
    gap: Spacing.two,
  },
});
```

- [ ] **Step 3: 运行新组件 lint**

Run: `npm run lint -- src/components/share/share-channel-hints.tsx src/components/share/share-action-panel.tsx`  
Expected: 两个新组件都没有新增 lint 错误

- [ ] **Step 4: Commit**

```bash
git add src/components/share/share-channel-hints.tsx src/components/share/share-action-panel.tsx
git commit -m "feat: add share hints and action panels"
```

---

### Task 3: 把海报组件改成紧凑预览卡

**Files:**
- Modify: `src/components/share/share-poster-preview.tsx`

- [ ] **Step 1: 扩展预览组件接口，让它读取编辑态内容**

```tsx
type SharePosterPreviewProps = {
  item: CollectibleItem;
  previewTitle?: string;
  previewCaption?: string;
  previewTags?: string[];
};
```

- [ ] **Step 2: 重构预览结构，降低海报视觉重量**

```tsx
export function SharePosterPreview({
  item,
  previewTitle,
  previewCaption,
  previewTags,
}: SharePosterPreviewProps) {
  const title = previewTitle?.trim() || item.share.title;
  const caption = previewCaption?.trim() || item.share.caption;
  const tags = (previewTags?.length ? previewTags : item.share.hashtags).slice(0, 3);

  return (
    <GlowCard padding="none" style={styles.card} tone={item.kind}>
      <Image
        contentFit="cover"
        source={{ uri: item.images.shareUrl }}
        style={styles.image}
      />

      <View style={styles.overlay}>
        <View style={styles.metaRow}>
          <StatusPill dot={false} label="已生成分享图" tone={item.kind} />
          <StatusPill dot={false} label="适合朋友圈封面" tone="gold" />
        </View>

        <View style={styles.copyCard}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.caption}>
            {caption}
          </ThemedText>

          <View style={styles.tagRow}>
            {tags.map((tag) => (
              <StatusPill key={tag} dot={false} label={tag} size="sm" tone="default" />
            ))}
          </View>
        </View>
      </View>
    </GlowCard>
  );
}
```

- [ ] **Step 3: 更新尺寸和排版样式**

```tsx
const styles = StyleSheet.create({
  card: {
    minHeight: 360,
  },
  image: {
    width: '100%',
    height: 360,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: Spacing.three,
    backgroundColor: 'rgba(246, 242, 233, 0.12)',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  copyCard: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 253, 248, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(216, 206, 192, 0.72)',
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: 700,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
```

- [ ] **Step 4: 运行预览组件 lint**

Run: `npm run lint -- src/components/share/share-poster-preview.tsx`  
Expected: `share-poster-preview.tsx` 没有新增 lint 错误

- [ ] **Step 5: Commit**

```bash
git add src/components/share/share-poster-preview.tsx
git commit -m "feat: compact share poster preview"
```

---

### Task 4: 重组分享页路由并接入新的工作台流程

**Files:**
- Modify: `src/app/share/[id].tsx`

- [ ] **Step 1: 用无效 id 检测替换当前“永远 fallback 到第一项”的行为**

```tsx
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { ShareActionPanel } from '@/components/share/share-action-panel';
import { ShareChannelHints } from '@/components/share/share-channel-hints';
import {
  ShareComposerCard,
  type ShareDraft,
} from '@/components/share/share-composer-card';
import { SharePosterPreview } from '@/components/share/share-poster-preview';
import { ScreenShell } from '@/components/ui/screen-shell';
import { mockCollectibles, getCollectibleById } from '@/data/mock-collectibles';

const hasMatchedItem = mockCollectibles.some((candidate) => candidate.id === resolvedId);

if (!hasMatchedItem) {
  return (
    <ScreenShell
      eyebrow="分享"
      subtitle="当前链接没有找到可整理的作品，请返回结果页或重新开始创作。"
      title="作品不存在">
      <EmptyState
        actionLabel="返回收藏"
        badge="无效分享链接"
        description="这件作品可能还未完成生成，或者当前链接已经失效。"
        onAction={() => router.replace('/explore' as never)}
        onSecondaryAction={() => router.replace('/create' as never)}
        secondaryActionLabel="开始创作"
        title="没有找到对应作品"
        tone="default"
      />
    </ScreenShell>
  );
}
```

- [ ] **Step 2: 建立本地分享草稿状态和标签编辑逻辑**

```tsx
const item = getCollectibleById(resolvedId);
const [draft, setDraft] = useState<ShareDraft>(() => ({
  hook: item.share.callToAction,
  title: item.share.title,
  caption: item.share.caption,
  hashtags: item.share.hashtags.slice(0, 3),
}));
const [tagInput, setTagInput] = useState('');
const [statusMessage, setStatusMessage] = useState('整理好图文后，可直接去微信生态分享。');

const normalizedTags = useMemo(
  () => draft.hashtags.filter((tag, index, array) => tag.trim() && array.indexOf(tag) === index),
  [draft.hashtags],
);

const handleChangeField = (field: 'hook' | 'title' | 'caption', value: string) => {
  setDraft((current) => ({
    ...current,
    [field]: value,
  }));
};

const handleAddTag = () => {
  const value = tagInput.trim();

  if (!value || normalizedTags.includes(value)) {
    return;
  }

  setDraft((current) => ({
    ...current,
    hashtags: [...current.hashtags, value].slice(0, 5),
  }));
  setTagInput('');
};

const handleRemoveTag = (tag: string) => {
  setDraft((current) => ({
    ...current,
    hashtags: current.hashtags.filter((entry) => entry !== tag),
  }));
};
```

- [ ] **Step 3: 把旧的反馈卡和 `ActionSheet` 替换成新布局**

```tsx
return (
  <ScreenShell
    eyebrow="分享准备"
    subtitle="编辑图文后，可直接用于微信生态分享。"
    title="整理分享内容"
    tone={item.kind}>
    <SharePosterPreview
      item={item}
      previewCaption={draft.hook || draft.caption}
      previewTags={normalizedTags}
      previewTitle={draft.title}
    />

    <ShareComposerCard
      draft={{ ...draft, hashtags: normalizedTags }}
      onAddTag={handleAddTag}
      onChangeField={handleChangeField}
      onChangeTagInput={setTagInput}
      onRemoveTag={handleRemoveTag}
      statusMessage="标签点按即可移除，也可以继续追加。"
      tagInput={tagInput}
      tone={item.kind}
    />

    <ShareChannelHints tone={item.kind} />

    <ShareActionPanel
      onBack={() => router.push(`/result/${item.id}` as never)}
      onCopy={handleCopy}
      onSave={handleSave}
      onShare={handleShare}
      statusMessage={statusMessage}
      tone={item.kind}
    />
  </ScreenShell>
);
```

- [ ] **Step 4: 实现主次动作反馈**

```tsx
const buildShareCopy = () =>
  [draft.hook.trim(), draft.title.trim(), draft.caption.trim(), normalizedTags.join(' ')]
    .filter(Boolean)
    .join('\n');

const handleCopy = () => {
  buildShareCopy();
  setStatusMessage('朋友圈文案已复制（mock）。');
};

const handleSave = () => {
  setStatusMessage('分享图已保存（mock）。');
};

const handleShare = () => {
  setStatusMessage('已唤起分享动作（mock）。');
};
```

- [ ] **Step 5: 删除旧样式和无用引用，只保留页面级少量样式**

```tsx
const styles = StyleSheet.create({
  page: {
    gap: 0,
  },
});
```

同时移除这些旧引用：

```tsx
import { ActionSheet } from '@/components/ui/action-sheet';
import { GlowCard } from '@/components/ui/glow-card';
import { StatusPill } from '@/components/ui/status-pill';
import { ThemedText } from '@/components/themed-text';
```

- [ ] **Step 6: 运行页面 lint**

Run: `npm run lint -- src/app/share/[id].tsx`  
Expected: `share/[id].tsx` 没有新增 lint 错误

- [ ] **Step 7: Commit**

```bash
git add src/app/share/[id].tsx
git commit -m "feat: recompose share page as wechat workbench"
```

---

### Task 5: 端到端验证分享工作台

**Files:**
- Verify: `src/app/share/[id].tsx`
- Verify: `src/components/share/share-poster-preview.tsx`
- Verify: `src/components/share/share-composer-card.tsx`
- Verify: `src/components/share/share-channel-hints.tsx`
- Verify: `src/components/share/share-action-panel.tsx`

- [ ] **Step 1: 运行聚焦 lint**

Run:

```bash
npm run lint -- src/app/share/[id].tsx src/components/share/share-poster-preview.tsx src/components/share/share-composer-card.tsx src/components/share/share-channel-hints.tsx src/components/share/share-action-panel.tsx
```

Expected: 上述 5 个文件全部通过 lint，或仅剩与这些文件无关的既有问题

- [ ] **Step 2: 运行 TypeScript 检查**

Run:

```bash
npx tsc --noEmit
```

Expected: 没有由本次分享页重构引入的新 TypeScript 错误

- [ ] **Step 3: 启动 Web 进行手动冒烟验证**

Run:

```bash
npm run web -- --port 8083
```

Expected:

- 分享页首屏先看到“整理分享内容”，不是整张大海报
- 海报预览明显比旧版更紧凑
- 短句、标题、正文、标签都能在页面内编辑
- 标签可添加、可点按移除
- 页面底部动作顺序清楚，`去分享` 最强
- `复制文案` 和 `保存图片` 会给出轻量反馈，不再占用大块卡片
- 无效 `id` 会进入空状态，而不是偷偷 fallback 到第一件作品

- [ ] **Step 4: 记录最终变更**

```bash
git add src/app/share/[id].tsx src/components/share/share-poster-preview.tsx src/components/share/share-composer-card.tsx src/components/share/share-channel-hints.tsx src/components/share/share-action-panel.tsx
git commit -m "feat: redesign share page as wechat publishing workbench"
```

---

## Self-Review

- **Spec coverage:** 计划覆盖了规格里的核心要求：页面定位切换、紧凑预览、分享编辑区、微信场景提示、主次动作面板、空状态和轻反馈。规格里提到的“结果页语义承接”没有额外扩大到改 `result/[id].tsx`，因为当前用户请求只聚焦分享页，这不影响分享工作台本身落地。
- **Placeholder scan:** 计划里没有 `TODO` / `TBD` / “后续处理” 这类占位词。每个任务都给出了明确文件、核心代码方向、校验命令和提交粒度。
- **Type consistency:** 计划统一使用 `ShareDraft`、`ShareComposerCard`、`ShareChannelHints`、`ShareActionPanel`、`previewTitle` / `previewCaption` / `previewTags` 这些命名，后续任务没有再引入第二套平行类型。

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-23-share-page-wechat-workbench.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
