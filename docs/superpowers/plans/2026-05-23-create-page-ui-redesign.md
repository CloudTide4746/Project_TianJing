# Create Page UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the mobile `创建页` into a lighter, tighter, easier-to-use creation flow without changing the product's core upload -> fill -> choose -> generate path.

**Architecture:** Keep the current Expo Router route and existing theme system, but redesign the screen composition around a compact top header, a shortened upload card, a denser metadata form, a lightweight horizontal type selector, and a simplified sticky footer. Limit the scope to the create flow and the few shared UI primitives that directly block the redesign, so the page can be shipped independently without disturbing the generating/result/share flows.

**Tech Stack:** Expo Router, React Native, TypeScript, `StyleSheet`, existing theme tokens in `src/constants/collectible-theme.ts`, existing shell primitives in `src/components/ui`

---

## File Structure

- Modify: `src/app/(tabs)/create.tsx`  
  Recompose the page, remove the large hint card, add lightweight dynamic helper text, and simplify footer copy.
- Modify: `src/components/create/metadata-form.tsx`  
  Convert the current heavy card-like form into a denser mobile-first input group.
- Modify: `src/components/ui/upload-dropzone.tsx`  
  Shrink the upload surface, simplify copy, and tighten the preview-state actions.
- Modify: `src/components/ui/type-selector.tsx`  
  Add a compact horizontal treatment suitable for the create page.
- Modify: `src/components/ui/screen-shell.tsx`  
  Add a compact header mode or supporting props so the create page can reduce top weight without forking layout logic.
- Maybe modify: `src/components/ui/primary-button.tsx`  
  Only if the small secondary/ghost button sizing is not sufficient for inline image actions.
- Maybe modify: `src/components/ui/status-pill.tsx`  
  Only if the current pill cannot support a lighter overlay treatment for the upload preview.

---

### Task 1: Add Compact Screen Header Support

**Files:**
- Modify: `src/components/ui/screen-shell.tsx`

- [ ] **Step 1: Read the current shell and define the smallest API change**

Target: avoid page-specific layout hacks inside `create.tsx`. Add one prop that lets the create page compress top spacing while leaving other screens unchanged.

```ts
type ScreenShellProps = {
  // existing props...
  headerDensity?: 'default' | 'compact';
};
```

- [ ] **Step 2: Write the failing implementation expectation inline**

Use this exact prop branch inside `ScreenShell`:

```tsx
<View
  style={[
    styles.content,
    headerDensity === 'compact' ? styles.contentCompact : null,
    contentContainerStyle,
  ]}>
  {title || subtitle || eyebrow ? (
    <SectionHeader
      eyebrow={eyebrow}
      subtitle={subtitle}
      title={title ?? ''}
      tone={tone}
    />
  ) : null}
  {headerSlot}
  {children}
</View>
```

- [ ] **Step 3: Implement compact spacing styles**

```ts
const styles = StyleSheet.create({
  // existing styles...
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: 28,
  },
  contentCompact: {
    gap: 18,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
  },
  staticContent: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
  },
});
```

- [ ] **Step 4: Run lint for the touched file**

Run: `npm run lint -- src/components/ui/screen-shell.tsx`  
Expected: no new lint errors in `screen-shell.tsx`

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/screen-shell.tsx
git commit -m "feat: add compact screen shell density"
```

---

### Task 2: Redesign The Upload Dropzone For A Smaller First Fold

**Files:**
- Modify: `src/components/ui/upload-dropzone.tsx`

- [ ] **Step 1: Shrink the default card copy structure**

Replace the long default descriptions with shorter create-page-friendly defaults:

```ts
title = '上传遗址照片',
description = '支持拍照或相册导入',
hint = '建议选择主体明确的照片',
aspectRatio = 16 / 10,
```

- [ ] **Step 2: Tighten the visual layout for the empty state**

Update the placeholder block to reduce the perceived size:

```ts
placeholder: {
  width: '100%',
  borderRadius: 24,
  borderWidth: 1,
  borderColor: 'rgba(176, 138, 89, 0.18)',
  borderStyle: 'dashed',
  alignItems: 'center',
  justifyContent: 'center',
  gap: Spacing.two,
  paddingHorizontal: Spacing.three,
  paddingVertical: Spacing.four,
  backgroundColor: 'rgba(255, 253, 248, 0.48)',
},
placeholderBadge: {
  width: 48,
  height: 48,
  borderRadius: 999,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(176, 138, 89, 0.1)',
},
```

- [ ] **Step 3: Make preview actions compact and image-adjacent**

Use small inline actions and shorter labels:

```tsx
<View style={styles.actions}>
  <PrimaryButton
    fullWidth={false}
    label="重选"
    onPress={replaceAction}
    size="sm"
    tone={tone}
    variant="secondary"
  />
  {onRemove ? (
    <PrimaryButton
      fullWidth={false}
      label="删除"
      onPress={onRemove}
      size="sm"
      variant="ghost"
    />
  ) : null}
</View>
```

- [ ] **Step 4: Reduce typography weight and vertical footprint**

```ts
title: {
  fontSize: 16,
  lineHeight: 22,
  fontWeight: 600,
  textAlign: 'center',
},
description: {
  fontSize: 13,
  lineHeight: 18,
  textAlign: 'center',
},
hint: {
  fontSize: 12,
  lineHeight: 16,
  textAlign: 'center',
},
preview: {
  width: '100%',
  borderRadius: 20,
},
```

- [ ] **Step 5: Run lint for the dropzone**

Run: `npm run lint -- src/components/ui/upload-dropzone.tsx`  
Expected: no new lint errors in `upload-dropzone.tsx`

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/upload-dropzone.tsx
git commit -m "feat: compact create page upload dropzone"
```

---

### Task 3: Rebuild The Metadata Form As A Dense Mobile Input Group

**Files:**
- Modify: `src/components/create/metadata-form.tsx`

- [ ] **Step 1: Keep the current API and reduce internal weight**

Do not change these props:

```ts
type MetadataFormProps = {
  values: MetadataValues;
  onChange: (field: MetadataField, value: string) => void;
  errors?: MetadataErrors;
  tone?: CollectibleThemeId | 'default';
  disabled?: boolean;
};
```

- [ ] **Step 2: Make the card copy shorter and more product-like**

Replace the section header copy with:

```tsx
<SectionHeader
  subtitle="补全标题、遗址名称和地点"
  title="基础信息"
  trailing={<StatusPill dot={false} label="必填 3 项" tone={tone} />}
/>
```

- [ ] **Step 3: Tighten field spacing and input height**

```ts
form: {
  gap: 12,
},
field: {
  gap: 6,
},
input: {
  minHeight: 50,
  borderRadius: 16,
  borderWidth: 1,
  backgroundColor: withAlpha(FoundationColors.backgroundBright, 0.9),
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontFamily: Fonts.sans,
  fontSize: 15,
  lineHeight: 20,
  fontWeight: 500,
},
```

- [ ] **Step 4: Clarify label hierarchy and reduce helper noise**

Replace the right-side helper text:

```tsx
{errorMessage ? (
  <ThemedText themeColor="error" style={styles.errorText}>
    {errorMessage}
  </ThemedText>
) : (
  <ThemedText themeColor="textMuted" style={styles.helperText}>
    {field.key === 'title' ? '用于结果页标题' : '用于作品信息'}
  </ThemedText>
)}
```

- [ ] **Step 5: Make the bottom hint shorter**

```tsx
<ThemedText themeColor="textSecondary" style={styles.tip}>
  地点越具体，生成叙事越有现场感。
</ThemedText>
```

- [ ] **Step 6: Run lint for the form**

Run: `npm run lint -- src/components/create/metadata-form.tsx`  
Expected: no new lint errors in `metadata-form.tsx`

- [ ] **Step 7: Commit**

```bash
git add src/components/create/metadata-form.tsx
git commit -m "feat: densify create metadata form"
```

---

### Task 4: Convert The Type Selector To A Compact Horizontal Picker

**Files:**
- Modify: `src/components/ui/type-selector.tsx`

- [ ] **Step 1: Reuse the existing `horizontal` layout instead of creating a new component**

The create page redesign should consume:

```tsx
<TypeSelector
  layout="horizontal"
  onChange={setSelectedType}
  value={selectedType}
/>
```

No new specialized create-page selector should be introduced.

- [ ] **Step 2: Reduce the horizontal card width and height**

```ts
itemHorizontal: {
  width: 184,
},
paperCard: {
  overflow: 'hidden',
  backgroundColor: FoundationColors.backgroundBright,
  borderWidth: 1,
  borderColor: FoundationColors.border,
  borderRadius: 20,
  minHeight: 118,
  padding: 14,
  shadowColor: FoundationColors.text,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.05,
  shadowRadius: 16,
  elevation: 2,
  justifyContent: 'space-between',
},
```

- [ ] **Step 3: Tighten typography and badge treatment**

```ts
badgeText: {
  fontSize: 10,
  lineHeight: 14,
  fontWeight: '600',
},
indexText: {
  fontSize: 18,
  lineHeight: 22,
  fontWeight: '600',
},
title: {
  fontSize: 16,
  lineHeight: 22,
  fontWeight: '600',
  color: FoundationColors.text,
},
description: {
  fontSize: 12,
  lineHeight: 17,
  color: FoundationColors.textSecondary,
},
```

- [ ] **Step 4: Keep detail copy outside the selector**

Do not place long explanatory content into the card. The selector remains limited to:

```ts
type TypeSelectorOption = {
  value: CollectibleKind;
  label: string;
  description: string;
  badge?: string;
};
```

The create page should render the selected type explanation below the selector, not inside it.

- [ ] **Step 5: Run lint for the selector**

Run: `npm run lint -- src/components/ui/type-selector.tsx`  
Expected: no new lint errors in `type-selector.tsx`

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/type-selector.tsx
git commit -m "feat: compact horizontal type selector cards"
```

---

### Task 5: Recompose The Create Screen Around The New Hierarchy

**Files:**
- Modify: `src/app/(tabs)/create.tsx`

- [ ] **Step 1: Switch the screen shell to compact mode**

Update the screen wrapper:

```tsx
<ScreenShell
  eyebrow="创作"
  footer={footer}
  headerDensity="compact"
  subtitle="上传照片并补全信息，即可开始生成。"
  title="创建藏品"
  tone={selectedType}>
```

- [ ] **Step 2: Remove the large standalone tip card**

Delete the current block:

```tsx
<GlowCard padding="sm" tone="default">
  <View style={styles.tipHeader}>
    ...
  </View>
  <ThemedText themeColor="textSecondary" style={styles.tipDescription}>
    {typeTips[selectedType]}
  </ThemedText>
  <ThemedText
    themeColor={submitAttempted && !isReadyToGenerate ? 'error' : 'textMuted'}
    style={styles.tipHint}>
    ...
  </ThemedText>
</GlowCard>
```

- [ ] **Step 3: Rebuild the middle layout order**

Use this structure:

```tsx
<UploadDropzone
  description="支持拍照或相册导入"
  errorMessage={uploadErrorMessage}
  hint="建议选择主体明确的照片"
  imageUri={imageUri}
  onPick={handlePickImage}
  onRemove={handleRemoveImage}
  onReplace={handlePickImage}
  title="上传遗址照片"
  tone={selectedType}
/>

<MetadataForm
  errors={fieldErrors}
  onChange={handleChangeField}
  tone={selectedType}
  values={form}
/>

<GlowCard tone={selectedType}>
  <SectionHeader
    subtitle="选择这次生成的藏品风格"
    title="藏品类型"
    trailing={<StatusPill dot={false} label={selectedTheme.title} tone={selectedType} />}
  />
  <TypeSelector layout="horizontal" onChange={setSelectedType} value={selectedType} />
  <View style={styles.inlineHint}>
    <ThemedText themeColor="textSecondary" style={styles.inlineHintText}>
      {typeTips[selectedType]}
    </ThemedText>
  </View>
</GlowCard>
```

- [ ] **Step 4: Simplify the sticky footer copy**

Use this footer behavior:

```tsx
const missingFields = [
  !imageUri ? '照片' : null,
  !trimmedForm.title ? '标题' : null,
  !trimmedForm.siteName ? '遗址名称' : null,
  !trimmedForm.province ? '地点' : null,
].filter(Boolean);

const footerDescription = isReadyToGenerate
  ? '已准备就绪，可以开始生成。'
  : `还缺 ${missingFields.join('、')}`;

const footer = (
  <View style={styles.footer}>
    <ThemedText
      themeColor={isReadyToGenerate ? 'textSecondary' : 'textMuted'}
      style={styles.footerHint}>
      {footerDescription}
    </ThemedText>
    <PrimaryButton
      label="开始生成"
      onPress={handleGenerate}
      tone={selectedType}
    />
  </View>
);
```

- [ ] **Step 5: Keep submit validation behavior consistent with the redesign**

`handleGenerate` should still block navigation when data is incomplete:

```ts
const handleGenerate = () => {
  setSubmitAttempted(true);

  if (!isReadyToGenerate) {
    return;
  }

  router.push(
    `/generating?collectibleId=${previewResultIdByType[selectedType]}&scenario=success` as never,
  );
};
```

- [ ] **Step 6: Add the new local styles and remove the obsolete tip styles**

Use:

```ts
const styles = StyleSheet.create({
  footer: {
    gap: Spacing.two,
  },
  footerHint: {
    fontSize: 13,
    lineHeight: 18,
  },
  inlineHint: {
    marginTop: 4,
  },
  inlineHintText: {
    fontSize: 13,
    lineHeight: 19,
  },
});
```

Delete:

```ts
tipHeader
tipTitle
tipDescription
tipHint
```

- [ ] **Step 7: Run page lint**

Run: `npm run lint -- src/app/(tabs)/create.tsx`  
Expected: no new lint errors in `create.tsx`

- [ ] **Step 8: Commit**

```bash
git add src/app/(tabs)/create.tsx
git commit -m "feat: recompose create page ui hierarchy"
```

---

### Task 6: Verify The End-To-End Create Experience

**Files:**
- Verify: `src/app/(tabs)/create.tsx`
- Verify: `src/components/create/metadata-form.tsx`
- Verify: `src/components/ui/upload-dropzone.tsx`
- Verify: `src/components/ui/type-selector.tsx`
- Verify: `src/components/ui/screen-shell.tsx`

- [ ] **Step 1: Run the focused lint pass**

Run:

```bash
npm run lint -- src/app/(tabs)/create.tsx src/components/create/metadata-form.tsx src/components/ui/upload-dropzone.tsx src/components/ui/type-selector.tsx src/components/ui/screen-shell.tsx
```

Expected: all five files pass lint, or only pre-existing unrelated issues remain outside those files.

- [ ] **Step 2: Run type-check**

Run:

```bash
npx tsc --noEmit
```

Expected: no TypeScript errors introduced by the redesign.

- [ ] **Step 3: Run the app for manual smoke testing**

Run:

```bash
npm run web
```

Expected:

- Create page header becomes visibly shorter than before
- Upload card fits comfortably in the first fold
- Uploaded preview does not feel oversized
- Metadata form fields feel denser and easier to scan
- Type cards scroll horizontally and remain easy to tap
- Sticky footer stays clear and readable
- Incomplete submit keeps the user on the page and reveals missing-field guidance

- [ ] **Step 4: Commit the final polish**

```bash
git add src/app/(tabs)/create.tsx src/components/create/metadata-form.tsx src/components/ui/upload-dropzone.tsx src/components/ui/type-selector.tsx src/components/ui/screen-shell.tsx
git commit -m "feat: redesign create page for lighter mobile interactions"
```

---

## Self-Review

- **Spec coverage:** The plan maps directly to the approved spec: compact header, shortened upload card, denser form, lighter horizontal selector, dynamic inline type explanation, and simplified sticky footer. No approved requirement is left without an implementation task.
- **Placeholder scan:** No `TODO`, `TBD`, or vague "add handling" steps remain. Every implementation step includes exact files, exact code direction, and exact verification commands.
- **Type consistency:** The plan keeps the current `MetadataForm`, `TypeSelector`, `ScreenShell`, and `CreateScreen` APIs aligned with the existing codebase, and avoids inventing parallel components that would drift from current names.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-23-create-page-ui-redesign.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
