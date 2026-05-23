import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { FoundationColors } from '@/constants/collectible-theme';
import { Fonts, Spacing } from '@/constants/theme';

import { ThemedText } from '../themed-text';

export type ChipOption<T extends string> = {
  id: T;
  label: string;
  swatch?: string;
};

type ChipSelectorProps<T extends string> = {
  value: T | null;
  onChange: (id: T) => void;
  options: readonly ChipOption<T>[];
  label?: string;
  disabled?: boolean;
};

export function ChipSelector<T extends string>({
  value,
  onChange,
  options,
  label,
  disabled = false,
}: ChipSelectorProps<T>) {
  return (
    <View style={styles.wrapper}>
      {label ? (
        <ThemedText themeColor="textMuted" style={styles.label}>
          {label}
        </ThemedText>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        style={styles.scroll}
      >
        {options.map((opt) => {
          const selected = opt.id === value;
          return (
            <Pressable
              key={opt.id}
              disabled={disabled}
              onPress={() => onChange(opt.id)}
              style={[
                styles.chip,
                selected
                  ? {
                      backgroundColor: opt.swatch
                        ? `${opt.swatch}28`
                        : FoundationColors.backgroundSelected,
                      borderColor: opt.swatch ?? FoundationColors.gold,
                    }
                  : {
                      backgroundColor: FoundationColors.backgroundBright,
                      borderColor: FoundationColors.border,
                    },
              ]}
            >
              {opt.swatch ? (
                <View
                  style={[
                    styles.swatch,
                    { backgroundColor: opt.swatch },
                    selected && styles.swatchSelected,
                  ]}
                />
              ) : null}
              <ThemedText
                style={[
                  styles.chipLabel,
                  selected && { color: opt.swatch ?? FoundationColors.gold, fontWeight: '700' },
                ]}
              >
                {opt.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 600,
    paddingLeft: 2,
  },
  scroll: {
    marginHorizontal: -Spacing.three,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: Spacing.three,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 38,
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  swatchSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  chipLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 600,
    color: FoundationColors.text,
  },
});
