import { getCollectiblesByStatus } from '@/data/mock-collectibles';
import type {
  CollectibleStatus,
  GenerationPhase,
  GenerationPhaseId,
  GenerationScenario,
  GenerationScenarioId,
} from '@/types/collectible';

const successPhases: GenerationPhase[] = [
  {
    id: 'queued',
    label: '锚定时空坐标',
    detail: '系统正在锁定GPS、时间戳与气象数据，建立不可篡改的时空锚点。',
    progress: 0.08,
    tone: 'textSecondary',
    status: 'queued',
    durationMs: 700,
    canCancel: true,
  },
  {
    id: 'analyze',
    label: '识别地点气质',
    detail: 'AI 正在分析地点类型、地貌特征与人文属性，确定视觉风格。',
    progress: 0.24,
    tone: 'gold',
    status: 'generating',
    durationMs: 1200,
    canCancel: true,
  },
  {
    id: 'restore',
    label: '生成风格化图像',
    detail: '根据地点气质与照片内容，生成陶土/水墨/壁画/赛博风格的藏品图。',
    progress: 0.48,
    tone: 'gold',
    status: 'generating',
    durationMs: 1300,
    canCancel: true,
  },
  {
    id: 'compose',
    label: '铸造时空卡面',
    detail: '将坐标、天气、计数器与风格化图像融合为一张完整的时空印记卡。',
    progress: 0.72,
    tone: 'success',
    status: 'generating',
    durationMs: 1100,
    canCancel: false,
  },
  {
    id: 'seal',
    label: '封印金句',
    detail: 'AI 基于地点与时间生成一行独属于此刻的金句，写入卡面底部。',
    progress: 0.92,
    tone: 'success',
    status: 'generating',
    durationMs: 900,
    canCancel: false,
  },
  {
    id: 'complete',
    label: '印记铸造完成',
    detail: '时空印记已存入收藏库，可查看完整卡面并分享。',
    progress: 1,
    tone: 'success',
    status: 'complete',
    durationMs: 500,
    canCancel: false,
  },
];

const retryableFailurePhases: GenerationPhase[] = [
  ...successPhases.slice(0, 4),
  {
    id: 'failed',
    label: '铸造中断',
    detail: '已完成图像生成与卡面排版，但金句封印未稳定，建议保留草稿并重新铸造。',
    progress: 0.84,
    tone: 'error',
    status: 'failed',
    durationMs: 600,
    canCancel: false,
  },
];

export const mockGenerationScenarios: GenerationScenario[] = [
  {
    id: 'success',
    title: '标准铸造',
    description: '用于生成页自动推进到结果页的顺畅流程。',
    completionStatus: 'complete',
    phases: successPhases,
    redirectCollectibleId: 'spacetime-001',
  },
  {
    id: 'retryable-failure',
    title: '可重试中断',
    description: '用于失败态展示，保留足够完整的过程文案与重试入口。',
    completionStatus: 'failed',
    phases: retryableFailurePhases,
    redirectCollectibleId: 'spacetime-001',
    retryLabel: '重新铸造',
  },
];

export const mockGenerationPhases = successPhases;

export const mockFailureGenerationPhases = retryableFailurePhases;

export const generationStatusLabelMap: Record<CollectibleStatus, string> = {
  idle: '待开始',
  queued: '排队中',
  generating: '生成中',
  complete: '已完成',
  failed: '失败待重试',
};

export function getGenerationScenarioById(id: GenerationScenarioId = 'success') {
  return mockGenerationScenarios.find((scenario) => scenario.id === id) ?? mockGenerationScenarios[0];
}

export function getGenerationPhases(id: GenerationScenarioId = 'success') {
  return getGenerationScenarioById(id).phases;
}

export function getGenerationPhaseById(
  phaseId: GenerationPhaseId,
  scenarioId: GenerationScenarioId = 'success',
) {
  return getGenerationPhases(scenarioId).find((phase) => phase.id === phaseId);
}

export function getNextGenerationPhase(
  currentPhaseId: GenerationPhaseId,
  scenarioId: GenerationScenarioId = 'success',
) {
  const phases = getGenerationPhases(scenarioId);
  const currentIndex = phases.findIndex((phase) => phase.id === currentPhaseId);

  if (currentIndex < 0 || currentIndex >= phases.length - 1) {
    return phases[phases.length - 1];
  }

  return phases[currentIndex + 1];
}

export function getGenerationProgress(
  currentPhaseId: GenerationPhaseId,
  scenarioId: GenerationScenarioId = 'success',
) {
  return getGenerationPhaseById(currentPhaseId, scenarioId)?.progress ?? 0;
}

export function getTerminalGenerationPhase(scenarioId: GenerationScenarioId = 'success') {
  const phases = getGenerationPhases(scenarioId);
  return phases[phases.length - 1];
}

export function getDefaultGeneratingCollectibleId() {
  const [activeItem] = [
    ...getCollectiblesByStatus('generating'),
    ...getCollectiblesByStatus('queued'),
    ...getCollectiblesByStatus('failed'),
  ];

  return activeItem?.id ?? 'ruin-001';
}
