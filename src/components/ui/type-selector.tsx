/** @format */

import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  FoundationColors,
  collectibleThemeEntries,
  getCollectibleTheme,
} from "@/constants/collectible-theme";
import { Spacing } from "@/constants/theme";
import type { CollectibleKind } from "@/types/collectible";

import { ThemedText } from "../themed-text";
import { ArtImage } from "./art-image";

export type TypeSelectorOption = {
  value: CollectibleKind;
  label: string;
  description: string;
  badge?: string;
};

type TypeSelectorProps = {
  value: CollectibleKind;
  onChange: (value: CollectibleKind) => void;
  options?: readonly TypeSelectorOption[];
  disabled?: boolean;
  layout?: "stack" | "grid" | "horizontal";
  style?: StyleProp<ViewStyle>;
  artIconMap?: Partial<Record<CollectibleKind, string>>;
};

const defaultDescriptions: Record<CollectibleKind, string> = {
  ruin: "把遗址轮廓补全成具备空间想象力的重建图。",
  message: "将碎片与痕迹压缩成带情绪张力的遗言卡。",
  crystal: "提炼光、雾与质感，生成可分享的记忆结晶。",
};

const defaultBadges: Record<CollectibleKind, string> = {
  ruin: "空间叙事",
  message: "文案张力",
  crystal: "视觉冲击",
};

const defaultOptions = collectibleThemeEntries.map((theme) => ({
  value: theme.id,
  label: theme.title,
  description: defaultDescriptions[theme.id],
  badge: defaultBadges[theme.id],
})) as readonly TypeSelectorOption[];

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function TypeSelector({
  value,
  onChange,
  options = defaultOptions,
  disabled = false,
  layout = "stack",
  style,
  artIconMap,
}: TypeSelectorProps) {
  if (layout === "horizontal") {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.horizontalContainer, style]}
        style={{ marginHorizontal: -Spacing.three }}
      >
        {options.map((option) => {
          const selected = option.value === value;
          const theme = getCollectibleTheme(option.value);

          return (
            <View key={option.value} style={styles.itemHorizontal}>
              <Pressable
                disabled={disabled}
                onPress={() => onChange(option.value)}
                style={[
                  styles.paperCard,
                  {
                    borderColor: selected
                      ? theme.primary
                      : FoundationColors.border,
                    backgroundColor: selected
                      ? withAlpha(theme.surface, 0.95)
                      : FoundationColors.backgroundBright,
                  },
                ]}
              >
                <View
                  pointerEvents='none'
                  style={[
                    styles.wash,
                    {
                      backgroundColor: withAlpha(
                        theme.primary,
                        selected ? 0.16 : 0.08,
                      ),
                    },
                  ]}
                />
                {artIconMap?.[option.value] ? (
                  <View
                    style={[
                      styles.iconWrap,
                      selected && {
                        shadowColor: theme.primary,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                        elevation: 4,
                      },
                    ]}>
                    <ArtImage
                      borderRadius={14}
                      contentFit="cover"
                      placeholderLabel="ART"
                      src={artIconMap[option.value]}
                      style={styles.iconImage}
                    />
                  </View>
                ) : null}
                <View style={styles.paperHeader}>
                  <View
                    style={[
                      styles.badge,
                      {
                        borderColor: withAlpha(theme.primary, 0.28),
                        backgroundColor: withAlpha(
                          theme.primary,
                          selected ? 0.14 : 0.08,
                        ),
                      },
                    ]}
                  >
                    <ThemedText
                      style={[styles.badgeText, { color: theme.secondary }]}
                    >
                      {selected ? "当前选中" : option.badge}
                    </ThemedText>
                  </View>
                  <ThemedText
                    style={[styles.indexText, { color: theme.primary }]}
                  >
                    {option.value === "ruin"
                      ? "A"
                      : option.value === "message"
                        ? "B"
                        : "C"}
                  </ThemedText>
                </View>
                <View style={styles.copy}>
                  <ThemedText style={styles.title}>{option.label}</ThemedText>
                  <ThemedText
                    themeColor='textSecondary'
                    style={styles.description}
                  >
                    {option.description}
                  </ThemedText>
                </View>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.container,
        layout === "grid" && styles.gridContainer,
        style,
      ]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const theme = getCollectibleTheme(option.value);

        return (
          <View
            key={option.value}
            style={[styles.item, layout === "grid" && styles.itemGrid]}
          >
            <Pressable
              disabled={disabled}
              onPress={() => onChange(option.value)}
              style={[
                styles.paperCard,
                {
                  borderColor: selected
                    ? theme.primary
                    : FoundationColors.border,
                  backgroundColor: selected
                    ? withAlpha(theme.surface, 0.95)
                    : FoundationColors.backgroundBright,
                },
              ]}
            >
              <View
                pointerEvents='none'
                style={[
                  styles.wash,
                  {
                    backgroundColor: withAlpha(
                      theme.primary,
                      selected ? 0.16 : 0.08,
                    ),
                  },
                ]}
              />
              {artIconMap?.[option.value] ? (
                <View
                  style={[
                    styles.iconWrap,
                    selected && {
                      shadowColor: theme.primary,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.3,
                      shadowRadius: 12,
                      elevation: 4,
                    },
                  ]}>
                  <ArtImage
                    borderRadius={14}
                    contentFit="cover"
                    placeholderLabel="ART"
                    src={artIconMap[option.value]}
                    style={styles.iconImage}
                  />
                </View>
              ) : null}
              <View style={styles.paperHeader}>
                <View
                  style={[
                    styles.badge,
                    {
                      borderColor: withAlpha(theme.primary, 0.28),
                      backgroundColor: withAlpha(
                        theme.primary,
                        selected ? 0.14 : 0.08,
                      ),
                    },
                  ]}
                >
                  <ThemedText
                    style={[styles.badgeText, { color: theme.secondary }]}
                  >
                    {selected ? "当前选中" : option.badge}
                  </ThemedText>
                </View>
                <ThemedText
                  style={[styles.indexText, { color: theme.primary }]}
                >
                  {option.value === "ruin"
                    ? "A"
                    : option.value === "message"
                      ? "B"
                      : "C"}
                </ThemedText>
              </View>
              <View style={styles.copy}>
                <ThemedText style={styles.title}>{option.label}</ThemedText>
                <ThemedText
                  themeColor='textSecondary'
                  style={styles.description}
                >
                  {option.description}
                </ThemedText>
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  horizontalContainer: {
    gap: 12,
    paddingHorizontal: Spacing.three,
  },
  itemHorizontal: {
    width: 168,
  },
  paperCard: {
    overflow: "hidden",
    backgroundColor: FoundationColors.backgroundBright,
    borderWidth: 1,
    borderColor: FoundationColors.border,
    borderRadius: 18,
    minHeight: 108,
    padding: 12,
    shadowColor: FoundationColors.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
    justifyContent: "space-between",
  },
  wash: {
    position: "absolute",
    top: -28,
    right: -14,
    width: 110,
    height: 110,
    borderRadius: 999,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 4,
  },
  iconImage: {
    width: 64,
    height: 64,
  },
  paperHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "600",
  },
  indexText: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "600",
  },
  copy: {
    gap: Spacing.one,
    marginTop: 4,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: FoundationColors.text,
  },
  description: {
    fontSize: 11,
    lineHeight: 15,
    color: FoundationColors.textSecondary,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
  },
  item: {
    width: "100%",
  },
  itemGrid: {
    width: "48%",
  },
});
