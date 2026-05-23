import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { FoundationColors } from '@/constants/collectible-theme';
import { Fonts, Spacing } from '@/constants/theme';
import type {
  ArtStyleId,
  ColorToneId,
  GenerateOptions,
  TimeTextureId,
} from '@/types/generate-options';
import {
  ART_STYLE_OPTIONS,
  COLOR_TONE_OPTIONS,
  TIME_TEXTURE_OPTIONS,
} from '@/types/generate-options';

import { ThemedText } from '../themed-text';
import { GlowCard } from '../ui/glow-card';
import { AdvancedOptionsPanel } from './advanced-options-panel';
import { ChipSelector } from './chip-selector';
import { CollapsibleSection } from './collapsible-section';
import { ColorPalettePicker } from './color-palette-picker';
import { StylePicker } from './style-picker';

type CustomizationPanelProps = {
  value: GenerateOptions;
  onChange: (next: GenerateOptions) => void;
  disabled?: boolean;
};

export function CustomizationPanel({
  value,
  onChange,
  disabled = false,
}: CustomizationPanelProps) {
  const [advancedExpanded, setAdvancedExpanded] = useState(false);
  const [paletteVisible, setPaletteVisible] = useState(false);

  return (
    <GlowCard padding="sm" tone="default">
      <View style={styles.header}>
        <ThemedText style={styles.title}>生成风格</ThemedText>
        <ThemedText themeColor="textMuted" style={styles.optional}>选填</ThemedText>
      </View>
      <ThemedText themeColor="textSecondary" style={styles.subtitle}>
        自定义AI生成图片的风格、色调与质感，留空则自动推断
      </ThemedText>

      <View style={styles.section}>
        <ThemedText themeColor="textMuted" style={styles.sectionLabel}>
          艺术风格
        </ThemedText>
        <StylePicker
          disabled={disabled}
          onChange={(id: ArtStyleId) =>
            onChange({ ...value, artStyle: id })
          }
          options={ART_STYLE_OPTIONS}
          value={value.artStyle}
        />
      </View>

      <View style={styles.section}>
        <ChipSelector
          disabled={disabled}
          label="色调氛围"
          onChange={(id: ColorToneId) =>
            onChange({ ...value, colorTone: id, customColorHex: null })
          }
          options={COLOR_TONE_OPTIONS}
          value={value.colorTone}
        />
        <View style={styles.customColorRow}>
          <Pressable
            disabled={disabled}
            onPress={() => setPaletteVisible(true)}
            style={[
              styles.customColorChip,
              value.customColorHex
                ? { borderColor: value.customColorHex, backgroundColor: `${value.customColorHex}18` }
                : { borderColor: FoundationColors.border, backgroundColor: FoundationColors.backgroundBright },
            ]}
          >
            {value.customColorHex ? (
              <View style={[styles.customSwatch, { backgroundColor: value.customColorHex }]} />
            ) : null}
            <ThemedText
              style={[
                styles.customColorLabel,
                value.customColorHex ? { color: value.customColorHex, fontWeight: '700' } : null,
              ]}
            >
              {value.customColorHex ? value.customColorHex : '🎨 自定义颜色'}
            </ThemedText>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <ChipSelector
          disabled={disabled}
          label="时间质感"
          onChange={(id: TimeTextureId) =>
            onChange({ ...value, timeTexture: id })
          }
          options={TIME_TEXTURE_OPTIONS}
          value={value.timeTexture}
        />
      </View>

      <View style={styles.section}>
        <ThemedText themeColor="textMuted" style={styles.sectionLabel}>
          自定义关键词
        </ThemedText>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          editable={!disabled}
          onChangeText={(text) =>
            onChange({ ...value, customKeywords: text })
          }
          placeholder="例如：孤独感、雨后、金色余晖、废墟上的花..."
          placeholderTextColor={FoundationColors.textMuted}
          returnKeyType="done"
          selectionColor={FoundationColors.gold}
          style={styles.keywordInput}
          value={value.customKeywords}
        />
        <ThemedText themeColor="textMuted" style={styles.hint}>
          用逗号分隔多个关键词，将注入到AI生成提示中
        </ThemedText>
      </View>

      <CollapsibleSection
        expanded={advancedExpanded}
        onToggle={() => setAdvancedExpanded((v) => !v)}
        subtitle="情绪、叙事、质感、时空拼贴、AI配诗"
        title="进阶创作"
      >
        <AdvancedOptionsPanel
          disabled={disabled}
          onChange={onChange}
          value={value}
        />
      </CollapsibleSection>

      <ColorPalettePicker
        visible={paletteVisible}
        onClose={() => setPaletteVisible(false)}
        onSelect={(hex: string) =>
          onChange({ ...value, customColorHex: hex || null, colorTone: hex ? null : value.colorTone })
        }
        selectedColor={value.customColorHex}
      />
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 700,
  },
  optional: {
    fontSize: 12,
    lineHeight: 16,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
  },
  section: {
    gap: 8,
    marginTop: Spacing.one,
  },
  sectionLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 600,
    paddingLeft: 2,
  },
  keywordInput: {
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(176, 138, 89, 0.24)',
    backgroundColor: 'rgba(255, 253, 248, 0.92)',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 19,
    color: FoundationColors.text,
  },
  hint: {
    fontSize: 11,
    lineHeight: 15,
  },
  customColorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customColorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 38,
  },
  customSwatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  customColorLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 600,
    color: FoundationColors.text,
  },
});
