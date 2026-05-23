/** @format */

import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { HeroBanner } from "@/components/home/hero-banner";
import { RecentCollectibleStrip } from "@/components/home/recent-collectible-strip";
import { ThemedText } from "@/components/themed-text";
import { GlowCard } from "@/components/ui/glow-card";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ScreenShell } from "@/components/ui/screen-shell";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusPill } from "@/components/ui/status-pill";
import { TypeSelector } from "@/components/ui/type-selector";
import { getCollectibleTheme } from "@/constants/collectible-theme";
import { Spacing } from "@/constants/theme";
import {
  featuredCollectibles,
  recentCollectibles,
} from "@/data/mock-collectibles";
import type { CollectibleItem, CollectibleKind } from "@/types/collectible";

function pickHeroItem(kind: CollectibleKind) {
  return (
    featuredCollectibles.find((item) => item.kind === kind) ??
    featuredCollectibles[0]
  );
}

function pickRecentItems(kind: CollectibleKind) {
  const sameKindItems = recentCollectibles
    .filter((item) => item.kind === kind)
    .slice(0, 3);

  return sameKindItems.length > 0
    ? sameKindItems
    : recentCollectibles.slice(0, 3);
}

export default function HomeScreen() {
  const router = useRouter();
  const [selectedKind, setSelectedKind] = useState<CollectibleKind>("ruin");

  const heroItem = useMemo(() => pickHeroItem(selectedKind), [selectedKind]);
  const recentItems = useMemo(
    () => pickRecentItems(selectedKind),
    [selectedKind],
  const handleOpenCreate = () => {
    router.push('/create' as never);
  };

  );
    router.push(`/result/${item.id}` as never);


  return (
    <ScreenShell
      eyebrow='移动端首页模板'
      subtitle='品牌叙事、类型入口、最近作品与创作 CTA 都聚合在一屏，优先服务手机纵向浏览。'
      title='时间的回响'
    >
      <HeroBanner
        item={heroItem}
        onCreatePress={handleOpenCreate}
        onExplorePress={() => router.push("/explore")}
      />

      <GlowCard tone='default'>
        <SectionHeader
          subtitle='三类藏品对应三种与遗址对话的方式，保持首页先看懂、再开始的节奏。'
          title='三类藏品入口'
        />
        <TypeSelector onChange={setSelectedKind} value={selectedKind} />
      </GlowCard>

      <RecentCollectibleStrip
        items={recentItems}
        onPressItem={handleOpenDetail}
        onPressMore={() => router.push("/explore")}
      />

      <GlowCard tone={selectedKind}>
        <View style={styles.ctaHeader}>
          <View style={styles.ctaCopy}>
            <ThemedText style={styles.ctaTitle}>开始一次新的创作</ThemedText>
            <ThemedText
              themeColor='textSecondary'
              style={styles.ctaDescription}
            >
              当前焦点是 {selectedTheme.title}
              。上传遗址照片后，系统会沿着这一类型的叙事方式继续显影。
            </ThemedText>
          </View>
          <StatusPill
            dot={false}
            label={selectedTheme.title}
            tone={selectedKind}
          />
        </View>
        <PrimaryButton
          label={`以${selectedTheme.title}开始创作`}
          onPress={handleOpenCreate}
          tone={selectedKind}
        />
        <PrimaryButton
          label='先看我的收藏'
          onPress={() => router.push("/explore")}
          tone={selectedKind}
          variant='secondary'
        />
      </GlowCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  ctaHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  ctaCopy: {
    flex: 1,
    gap: Spacing.two,
  },
  ctaTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: 700,
  },
  ctaDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
