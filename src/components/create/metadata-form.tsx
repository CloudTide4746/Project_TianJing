import { StyleSheet, TextInput, View } from 'react-native';

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

export type MetadataField = 'title' | 'siteName' | 'province';

export type MetadataValues = {
  title: string;
  siteName: string;
  province: string;
};

type MetadataErrors = Partial<Record<MetadataField, string>>;

type MetadataFormProps = {
  values: MetadataValues;
  onChange: (field: MetadataField, value: string) => void;
  errors?: MetadataErrors;
  tone?: CollectibleThemeId | 'default';
  disabled?: boolean;
};

const fieldConfigs: {
  key: MetadataField;
  label: string;
  placeholder: string;
  autoCapitalize: 'none' | 'sentences' | 'words' | 'characters';
  returnKeyType: 'done' | 'next';
}[] = [
  {
    key: 'title',
    label: '作品标题',
    placeholder: '给这次记忆起一个名字',
    autoCapitalize: 'sentences',
    returnKeyType: 'next',
  },
  {
    key: 'siteName',
    label: '遗址名称',
    placeholder: '填写遗址或点位名称',
    autoCapitalize: 'words',
    returnKeyType: 'next',
  },
  {
    key: 'province',
    label: '地点',
    placeholder: '省市 / 区县 / 地点',
    autoCapitalize: 'words',
    returnKeyType: 'done',
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

export function MetadataForm({
  values,
  onChange,
  errors,
  tone = 'default',
  disabled = false,
}: MetadataFormProps) {
  const accentColor = getAccentColor(tone);

  return (
    <GlowCard padding="sm" tone={tone}>
      <SectionHeader
        density="compact"
        subtitle="补全标题、遗址名称和地点"
        title="基础信息"
        trailing={<StatusPill dot={false} label="必填 3 项" size="sm" tone={tone} />}
      />

      <View style={styles.form}>
        {fieldConfigs.map((field) => {
          const errorMessage = errors?.[field.key];

          return (
            <View key={field.key} style={styles.field}>
              <View style={styles.labelRow}>
                <ThemedText style={styles.label}>{field.label}</ThemedText>
                {errorMessage ? (
                  <ThemedText themeColor="error" style={styles.errorText}>
                    {errorMessage}
                  </ThemedText>
                ) : (
                  <ThemedText themeColor="textMuted" style={styles.helperText}>
                    {field.key === 'title' ? '用于结果页标题' : '用于作品信息'}
                  </ThemedText>
                )}
              </View>

              <TextInput
                autoCapitalize={field.autoCapitalize}
                autoCorrect={false}
                editable={!disabled}
                onChangeText={(value) => onChange(field.key, value)}
                placeholder={field.placeholder}
                placeholderTextColor={FoundationColors.textMuted}
                returnKeyType={field.returnKeyType}
                selectionColor={accentColor}
                style={[
                  styles.input,
                  {
                    borderColor: errorMessage
                      ? withAlpha(FoundationColors.error, 0.92)
                      : withAlpha(accentColor, 0.24),
                    color: FoundationColors.text,
                    opacity: disabled ? 0.68 : 1,
                  },
                ]}
                value={values[field.key]}
              />
            </View>
          );
        })}
      </View>

      <ThemedText themeColor="textSecondary" style={styles.tip}>
        地点越具体，生成叙事越有现场感。
      </ThemedText>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 10,
  },
  field: {
    gap: 5,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 700,
  },
  helperText: {
    fontSize: 11,
    lineHeight: 14,
  },
  errorText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: 700,
  },
  input: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: withAlpha(FoundationColors.backgroundBright, 0.9),
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: 500,
  },
  tip: {
    fontSize: 11,
    lineHeight: 16,
  },
});
