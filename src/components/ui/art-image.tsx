import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';

import { FoundationColors } from '@/constants/collectible-theme';
import { Spacing } from '@/constants/theme';

import { ThemedText } from '../themed-text';

type ArtImageProps = {
  src?: string | null;
  aspectRatio?: number;
  placeholderLabel?: string;
  style?: StyleProp<ViewStyle>;
  contentFit?: 'cover' | 'contain';
  borderRadius?: number;
  opacity?: number;
};

export function ArtImage({
  src,
  aspectRatio = 16 / 9,
  placeholderLabel,
  style,
  contentFit = 'cover',
  borderRadius = 18,
  opacity = 1,
}: ArtImageProps) {
  if (src && typeof src === 'string' && src.length > 0) {
    return (
      <Image
        contentFit={contentFit}
        source={src}
        style={[
          { width: '100%', aspectRatio, borderRadius, opacity },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        { aspectRatio, borderRadius },
        style,
      ]}>
      <View style={styles.dashFrame} />
      {placeholderLabel ? (
        <View style={styles.labelWrap}>
          <ThemedText themeColor="textMuted" style={styles.label}>
            {placeholderLabel}
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(176, 138, 89, 0.04)',
  },
  dashFrame: {
    ...StyleSheet.absoluteFill,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(176, 138, 89, 0.16)',
    borderStyle: 'dashed',
    margin: 1,
  },
  labelWrap: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 253, 248, 0.7)',
  },
  label: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
