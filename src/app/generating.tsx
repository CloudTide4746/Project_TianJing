/** @format */

import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { EmptyState } from '@/components/ui/empty-state';
import { GlowCard } from '@/components/ui/glow-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ProgressRitual } from '@/components/ui/progress-ritual';
import { ScreenShell } from '@/components/ui/screen-shell';
import { StatusPill } from '@/components/ui/status-pill';
import { Spacing } from '@/constants/theme';
import { getGenerationStatus, retryGeneration } from '@/services/api';
import type { GenerationPhase, GenerationStatus } from '@/services/api';

export default function GeneratingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ collectibleId?: string }>();
  const collectibleId = typeof params.collectibleId === 'string' ? params.collectibleId : undefined;

  const [phases, setPhases] = useState<GenerationPhase[]>([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [status, setStatus] = useState<GenerationStatus>('queued');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const failCountRef = useRef(0);

  const startPolling = (id: string) => {
    // Clear any existing interval
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    failCountRef.current = 0;

    const poll = async () => {
      try {
        const data = await getGenerationStatus(id);
        failCountRef.current = 0;
        setPhases(data.phases);
        setCurrentPhaseIndex(data.currentPhaseIndex);
        setStatus(data.status);
        setErrorMessage(data.errorMessage);

        if (data.status === 'complete') {
          if (pollRef.current) clearInterval(pollRef.current);
          setTimeout(() => {
            router.replace(`/result/${data.redirectCollectibleId ?? id}` as never);
          }, 800);
        } else if (data.status === 'failed') {
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        failCountRef.current += 1;
        if (failCountRef.current >= 5) {
          // ~7.5 seconds of consecutive failures
          if (pollRef.current) clearInterval(pollRef.current);
          setStatus('failed');
          setErrorMessage('无法连接服务器，请检查网络后重试。');
        }
      }
    };

    poll(); // immediate first poll
    pollRef.current = setInterval(poll, 1500);
  };

  useEffect(() => {
    if (!collectibleId) {
      router.replace('/create');
      return;
    }
    startPolling(collectibleId);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [collectibleId]);

  const currentPhase = phases[currentPhaseIndex] ?? phases[phases.length - 1];
  const isFailed = status === 'failed';
  const isComplete = status === 'complete';

  const handleCancel = () => {
    router.replace('/create' as never);
  };

  const handleRetry = async () => {
    if (!collectibleId) return;
    try {
      await retryGeneration(collectibleId);
      setStatus('generating');
      setCurrentPhaseIndex(0);
      setErrorMessage(undefined);
      startPolling(collectibleId);
    } catch {
      setErrorMessage('重试失败，请检查网络连接。');
    }
  };

  if (!collectibleId) return null;

  return (
    <GeneratingFlow
      collectibleId={collectibleId}
      currentPhase={currentPhase}
      currentPhaseIndex={currentPhaseIndex}
      isComplete={isComplete}
      isFailed={isFailed}
      phases={phases}
      status={status}
      errorMessage={errorMessage}
      onCancel={handleCancel}
      onRetry={handleRetry}
    />
  );
}

type GeneratingFlowProps = {
  collectibleId: string;
  currentPhase: GenerationPhase | undefined;
  currentPhaseIndex: number;
  isComplete: boolean;
  isFailed: boolean;
  phases: GenerationPhase[];
  status: GenerationStatus;
  errorMessage?: string;
  onCancel: () => void;
  onRetry: () => void;
};

function GeneratingFlow({
  currentPhase,
  currentPhaseIndex,
  isComplete,
  isFailed,
  phases,
  status,
  errorMessage,
  onCancel,
  onRetry,
}: GeneratingFlowProps) {
  const footer = (
    <View style={styles.footer}>
      <ThemedText
        themeColor={isFailed ? 'textSecondary' : 'textMuted'}
        style={styles.footerHint}>
        {isFailed
          ? '铸造过程在最后阶段中断，已为你保留草稿与过程数据。'
          : status === 'generating'
            ? 'AI 正按阶段处理坐标锚定、风格化图像、卡面铸造，完成后自动跳转到结果页。'
            : '系统正在准备铸造流程...'}
      </ThemedText>
      {isFailed ? (
        <>
          <PrimaryButton label="重新铸造" onPress={onRetry} tone="ruin" />
          <PrimaryButton label="返回创作" onPress={onCancel} tone="ruin" variant="ghost" />
        </>
      ) : (
        <PrimaryButton
          disabled={isComplete}
          label={isComplete ? '即将跳转...' : '取消返回'}
          loading={isComplete}
          loadingLabel="即将跳转..."
          onPress={onCancel}
          tone="ruin"
          variant={isComplete ? 'secondary' : 'ghost'}
        />
      )}
    </View>
  );

  return (
    <ScreenShell
      eyebrow="铸造中"
      footer={footer}
      subtitle={
        isFailed
          ? '这次铸造停在了金句封印前，系统已经为你保留可复用的草稿。'
          : isComplete
            ? '印记即将铸造完成'
            : 'AI 正按阶段处理坐标锚定、风格化图像、卡面铸造，完整链路完成后会自动进入结果页。'
      }
      title={isFailed ? '铸造暂时中断' : isComplete ? '印记铸造完成' : 'AI 正在从时间里挖掘'}
      tone="ruin">
      {phases.length > 0 && currentPhase ? (
        <ProgressRitual
          currentPhase={{
            id: currentPhase.id as any,
            label: currentPhase.label,
            detail: currentPhase.detail,
            progress: currentPhase.progress,
            tone: currentPhase.tone as any,
            status: currentPhase.status as any,
            durationMs: currentPhase.durationMs,
            canCancel: currentPhase.canCancel,
          }}
          phases={phases.map((p) => ({
            id: p.id as any,
            label: p.label,
            detail: p.detail,
            progress: p.progress,
            tone: p.tone as any,
            status: p.status as any,
            durationMs: p.durationMs,
            canCancel: p.canCancel,
          }))}
          subtitle={currentPhase.detail}
          title="刻迹铸造中"
          tone="ruin"
        />
      ) : (
        <GlowCard padding="lg" tone="default">
          <View style={styles.waitingState}>
            <ThemedText style={styles.waitingTitle}>等待铸造开始...</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.waitingDesc}>
              系统正在初始化铸造流程。
            </ThemedText>
          </View>
        </GlowCard>
      )}

      {isFailed ? (
        <EmptyState
          actionLabel="重新铸造"
          badge="中断提示"
          description={errorMessage ?? '主视觉已生成，但金句封印未稳定。你可以直接重试，也可以返回创作页重新开始。'}
          onAction={onRetry}
          onSecondaryAction={onCancel}
          secondaryActionLabel="返回创作"
          title="铸造未完成"
          tone="ruin"
        />
      ) : isComplete ? (
        <EmptyState
          badge="铸造完成"
          description="刻迹已存入收藏库，正在前往结果页。"
          title="印记铸造完成"
          tone="ruin"
        />
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: Spacing.two,
  },
  footerHint: {
    fontSize: 13,
    lineHeight: 18,
  },
  waitingState: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  waitingTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 700,
  },
  waitingDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
});
