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
  const accentColor = getAccentColor(tone);

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
              autoCapitalize="sentences"
              autoCorrect={false}
              multiline={field.multiline}
              onChangeText={(value) => onChangeField(field.key, value)}
              placeholder={field.placeholder}
              placeholderTextColor={FoundationColors.textMuted}
              selectionColor={accentColor}
              style={[
                styles.input,
                {
                  borderColor: withAlpha(accentColor, 0.2),
                },
                field.multiline && styles.inputMultiline,
              ]}
              textAlignVertical={field.multiline ? 'top' : 'center'}
              value={draft[field.key]}
            />
          </View>
        ))}
      </View>

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
            selectionColor={accentColor}
            style={[
              styles.input,
              styles.tagInput,
              {
                borderColor: withAlpha(accentColor, 0.2),
              },
            ]}
            value={tagInput}
          />
          <Pressable
            onPress={onAddTag}
            style={[
              styles.addTagButton,
              {
                backgroundColor: withAlpha(accentColor, 0.12),
              },
            ]}>
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
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'right',
  },
  input: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
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
