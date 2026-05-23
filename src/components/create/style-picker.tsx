import { Pressable, StyleSheet, View } from 'react-native';

import { FoundationColors } from '@/constants/collectible-theme';
import { Fonts, Spacing } from '@/constants/theme';
import type { ArtStyleId, ArtStyleOption } from '@/types/generate-options';

import { ThemedText } from '../themed-text';

type StylePickerProps = {
  value: ArtStyleId | null;
  onChange: (id: ArtStyleId) => void;
  options: readonly ArtStyleOption[];
  disabled?: boolean;
};

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function StylePicker({
  value,
  onChange,
  options,
  disabled = false,
}: StylePickerProps) {
  return (
    <View style={styles.grid}>
      {options.map((opt) => {
        const selected = opt.id === value;
        return (
          <Pressable
            key={opt.id}
            disabled={disabled}
            onPress={() => onChange(opt.id)}
            style={[
              styles.card,
              {
                borderColor: selected
                  ? opt.swatch
                  : FoundationColors.border,
                backgroundColor: selected
                  ? withAlpha(opt.swatch, 0.12)
                  : FoundationColors.backgroundBright,
              },
            ]}
          >
            <View
              pointerEvents="none"
              style={[
                styles.wash,
                { backgroundColor: withAlpha(opt.swatch, selected ? 0.18 : 0.06) },
              ]}
            />
            <View
              style={[
                styles.swatch,
                { backgroundColor: opt.swatch },
                selected && styles.swatchActive,
              ]}
            />
            <View style={styles.copy}>
              <ThemedText
                style={[
                  styles.title,
                  selected && { color: opt.swatch },
                ]}
              >
                {opt.label}
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.desc}>
                {opt.description}
              </ThemedText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    flexGrow: 1,
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 8,
    minHeight: 88,
  },
  wash: {
    position: 'absolute',
    top: -20,
    right: -10,
    width: 80,
    height: 80,
    borderRadius: 999,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
  swatchActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  copy: {
    gap: 2,
  },
  title: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: 700,
    color: FoundationColors.text,
  },
  desc: {
    fontSize: 11,
    lineHeight: 15,
  },
});
