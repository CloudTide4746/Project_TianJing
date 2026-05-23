import { StyleSheet, Switch, View } from 'react-native';

import { FoundationColors } from '@/constants/collectible-theme';
import { Spacing } from '@/constants/theme';
import type {
  ContrastId,
  DetailDensityId,
  DynastyId,
  GenerateOptions,
  GrainId,
  MoodId,
  NarrativePerspectiveId,
  SeasonId,
} from '@/types/generate-options';
import {
  CONTRAST_OPTIONS,
  DETAIL_DENSITY_OPTIONS,
  DYNASTY_OPTIONS,
  GRAIN_OPTIONS,
  MOOD_OPTIONS,
  NARRATIVE_PERSPECTIVE_OPTIONS,
  SEASON_OPTIONS,
} from '@/types/generate-options';

import { ThemedText } from '../themed-text';
import { ChipSelector } from './chip-selector';

type AdvancedOptionsPanelProps = {
  value: GenerateOptions;
  onChange: (next: GenerateOptions) => void;
  disabled?: boolean;
};

export function AdvancedOptionsPanel({
  value,
  onChange,
  disabled = false,
}: AdvancedOptionsPanelProps) {
  return (
    <View style={styles.container}>
      {/* Mood */}
      <ChipSelector
        disabled={disabled}
        label="情绪基调"
        onChange={(id: MoodId) => onChange({ ...value, mood: id })}
        options={MOOD_OPTIONS.map((o) => ({
          id: o.id,
          label: `${o.emoji} ${o.label}`,
        }))}
        value={value.mood}
      />

      {/* Narrative perspective */}
      <ChipSelector
        disabled={disabled}
        label="叙事视角"
        onChange={(id: NarrativePerspectiveId) =>
          onChange({ ...value, narrativePerspective: id })
        }
        options={NARRATIVE_PERSPECTIVE_OPTIONS.map((o) => ({
          id: o.id,
          label: o.label,
        }))}
        value={value.narrativePerspective}
      />

      {/* Detail density */}
      <ChipSelector
        disabled={disabled}
        label="细节密度"
        onChange={(id: DetailDensityId) =>
          onChange({ ...value, detailDensity: id })
        }
        options={DETAIL_DENSITY_OPTIONS.map((o) => ({
          id: o.id,
          label: o.label,
        }))}
        value={value.detailDensity}
      />

      {/* Contrast */}
      <ChipSelector
        disabled={disabled}
        label="对比度"
        onChange={(id: ContrastId) => onChange({ ...value, contrast: id })}
        options={CONTRAST_OPTIONS.map((o) => ({
          id: o.id,
          label: o.label,
        }))}
        value={value.contrast}
      />

      {/* Grain */}
      <ChipSelector
        disabled={disabled}
        label="颗粒质感"
        onChange={(id: GrainId) => onChange({ ...value, grain: id })}
        options={GRAIN_OPTIONS.map((o) => ({
          id: o.id,
          label: o.label,
        }))}
        value={value.grain}
      />

      {/* Season */}
      <ChipSelector
        disabled={disabled}
        label="季节氛围"
        onChange={(id: SeasonId) => onChange({ ...value, season: id })}
        options={SEASON_OPTIONS.map((o) => ({
          id: o.id,
          label: `${o.emoji} ${o.label}`,
        }))}
        value={value.season}
      />

      {/* Dynasty time collage */}
      <ChipSelector
        disabled={disabled}
        label="时空拼贴 · 历史朝代"
        onChange={(id: DynastyId) => onChange({ ...value, dynastyCollage: id })}
        options={DYNASTY_OPTIONS.map((o) => ({
          id: o.id,
          label: `${o.label} (${o.era})`,
        }))}
        value={value.dynastyCollage}
      />

      {/* AI Poetry toggle */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleCopy}>
          <ThemedText style={styles.toggleLabel}>AI 配诗</ThemedText>
          <ThemedText themeColor="textMuted" style={styles.toggleDesc}>
            基于照片与地点自动生成一首古诗
          </ThemedText>
        </View>
        <Switch
          disabled={disabled}
          ios_backgroundColor="rgba(176, 138, 89, 0.18)"
          onValueChange={(v) => onChange({ ...value, aiPoetry: v })}
          thumbColor={value.aiPoetry ? FoundationColors.gold : '#c4b99a'}
          trackColor={{
            false: 'rgba(176, 138, 89, 0.2)',
            true: 'rgba(176, 138, 89, 0.4)',
          }}
          value={value.aiPoetry}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  toggleCopy: {
    flex: 1,
    gap: 3,
  },
  toggleLabel: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: 600,
  },
  toggleDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
});
