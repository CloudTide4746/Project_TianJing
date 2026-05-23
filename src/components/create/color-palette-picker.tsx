import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { FoundationColors } from '@/constants/collectible-theme';
import { Fonts, Spacing } from '@/constants/theme';

import { ThemedText } from '../themed-text';
import { PrimaryButton } from '../ui/primary-button';

const PALETTE_COLORS = [
  // Warm reds & oranges
  '#e74c3c', '#c0392b', '#e67e22', '#d35400', '#f39c12', '#e07b5a',
  // Warm golds & ambers
  '#d4a84b', '#c8a06f', '#b8860b', '#daa520', '#cd853f', '#a07050',
  // Warm pinks
  '#e38c8c', '#d4856b', '#c47d3a', '#b5651d',
  // Cool greens
  '#7ba587', '#4a6741', '#2ecc71', '#27ae60', '#1abc9c', '#16a085',
  // Cool blues
  '#7ba4b8', '#5b8fa8', '#3498db', '#2980b9', '#6c7fcf', '#4a5ab0',
  // Cool purples
  '#9b59b6', '#8e44ad', '#7b6fd4', '#5b4fbf',
  // Neutrals
  '#6e6e6e', '#8c8c8c', '#a0a0a0', '#b09a7a', '#d4c5b9', '#c4b5a5',
  // Near-black & near-white
  '#2c2c2c', '#3a3a3a', '#f5f0e8', '#ede4d3', '#e8dcc8',
  // Chinese traditional colors
  '#c41e1a', '#9b1b19', '#366254', '#3b5e4a', '#4a4a7a', '#2c3e50',
  // Accent colors
  '#e74c8b', '#c0396b', '#ff6b6b', '#54a0ff', '#5f27cd', '#01a3a4',
];

type ColorPalettePickerProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (hex: string) => void;
  selectedColor?: string | null;
};

const HEX6_REGEX = /^#[0-9A-Fa-f]{6}$/;

export function ColorPalettePicker({
  visible,
  onClose,
  onSelect,
  selectedColor,
}: ColorPalettePickerProps) {
  const [previewColor, setPreviewColor] = useState<string | null>(selectedColor ?? null);
  const [customHex, setCustomHex] = useState('');

  const isCustomValid = HEX6_REGEX.test(customHex);

  const handleSelect = (hex: string) => {
    setPreviewColor(hex);
  };

  const handleCustomSubmit = () => {
    if (isCustomValid) {
      setPreviewColor(customHex.toUpperCase());
    }
  };

  const handleConfirm = () => {
    if (previewColor) {
      onSelect(previewColor);
    }
    onClose();
  };

  const handleClear = () => {
    onSelect('');
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      transparent
      visible={visible}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>调色盘</ThemedText>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <ThemedText style={styles.closeBtnText}>✕</ThemedText>
            </Pressable>
          </View>

          {/* Preview */}
          {previewColor ? (
            <View style={styles.previewRow}>
              <View style={[styles.previewSwatch, { backgroundColor: previewColor }]} />
              <ThemedText themeColor="textSecondary" style={styles.previewHex}>
                {previewColor}
              </ThemedText>
            </View>
          ) : null}

          {/* Custom hex input */}
          <View style={styles.customRow}>
            <View style={styles.customInputWrapper}>
              <ThemedText style={styles.hashLabel}>#</ThemedText>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={6}
                onChangeText={(text) => setCustomHex(text.startsWith('#') ? text : `#${text}`)}
                onSubmitEditing={handleCustomSubmit}
                placeholder="RRGGBB"
                placeholderTextColor={FoundationColors.textMuted}
                returnKeyType="done"
                selectionColor={FoundationColors.gold}
                style={styles.customInput}
                value={customHex.replace(/^#/, '')}
              />
            </View>
            {isCustomValid ? (
              <Pressable
                onPress={handleCustomSubmit}
                style={[
                  styles.customAddBtn,
                  { backgroundColor: customHex },
                  previewColor === customHex.toUpperCase() && styles.swatchSelected,
                ]}
              >
                {previewColor === customHex.toUpperCase() ? (
                  <ThemedText style={styles.checkmark}>✓</ThemedText>
                ) : null}
              </Pressable>
            ) : (
              <Pressable
                disabled
                style={[styles.customAddBtn, styles.customAddBtnDisabled]}
              >
                <ThemedText style={styles.customAddBtnDisabledText}>+</ThemedText>
              </Pressable>
            )}
          </View>

          {/* Color grid */}
          <ScrollView
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
          >
            {PALETTE_COLORS.map((hex) => {
              const isSelected = previewColor === hex;
              return (
                <Pressable
                  key={hex}
                  onPress={() => handleSelect(hex)}
                  style={[
                    styles.swatch,
                    { backgroundColor: hex },
                    isSelected && styles.swatchSelected,
                  ]}
                >
                  {isSelected ? (
                    <ThemedText style={styles.checkmark}>✓</ThemedText>
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <PrimaryButton
              fullWidth={false}
              label="清除"
              onPress={handleClear}
              size="sm"
              tone="default"
              variant="ghost"
            />
            <PrimaryButton
              disabled={!previewColor}
              fullWidth={false}
              label="确认"
              onPress={handleConfirm}
              size="sm"
              tone="default"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: Spacing.four,
  },
  sheet: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '80%',
    borderRadius: 24,
    backgroundColor: FoundationColors.backgroundElement,
    padding: Spacing.four,
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(176, 138, 89, 0.24)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: 700,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(176, 138, 89, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: 700,
    color: FoundationColors.textSecondary,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: 4,
  },
  previewSwatch: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: FoundationColors.gold,
  },
  previewHex: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.mono,
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  customInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(176, 138, 89, 0.24)',
    backgroundColor: 'rgba(255, 253, 248, 0.92)',
    paddingHorizontal: 12,
    height: 44,
  },
  hashLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: FoundationColors.textSecondary,
    marginRight: 2,
  },
  customInput: {
    flex: 1,
    fontFamily: Fonts.mono,
    fontSize: 14,
    lineHeight: 19,
    color: FoundationColors.text,
    paddingVertical: 0,
  },
  customAddBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customAddBtnDisabled: {
    backgroundColor: FoundationColors.backgroundBright,
    borderWidth: 1,
    borderColor: 'rgba(176, 138, 89, 0.15)',
    borderStyle: 'dashed',
  },
  customAddBtnDisabledText: {
    fontSize: 20,
    fontWeight: 600,
    color: FoundationColors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: FoundationColors.gold,
    transform: [{ scale: 1.12 }],
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 800,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.two,
  },
});
