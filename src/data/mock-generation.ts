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
    label: '接入时间纹理',
    detail: '系统正在整理上传影像、地点信息与风格偏好。',
    progress: 0.08,
    tone: 'textSecondary',
    status: 'queued',
    durationMs: 700,
    canCancel: true,
  },
  {
    id: 'analyze',
    label: '识别遗址轮廓',
    detail: 'AI 正在辨认墙线、砖缝、风化层与可追溯的空间比例。',
    progress: 0.24,
    tone: 'gold',
    status: 'generating',
    durationMs: 1200,
    canCancel: true,
  },
  {
    id: 'restore',
    label: '推演历史原貌',
    detail: '根据现存遗构与语义线索补全失落体量，生成第一版可收藏图像。',
    progress: 0.48,
    tone: 'gold',
    status: 'generating',
    durationMs: 1300,
    canCancel: true,
  },
  {
    id: 'compose',
    label: '编织记忆叙事',
    detail: '把地点、材质和时间感压缩成一句适合卡面与分享页的叙事标题。',
    progress: 0.72,
    tone: 'success',
    status: 'generating',
    durationMs: 1100,
    canCancel: false,
  },
  {
    id: 'seal',
    label: '封印藏品光印',
    detail: '正在稳定最终色调、金色高光与可分享海报的构图边界。',
    progress: 0.92,
    tone: 'success',
    status: 'generating',
    durationMs: 900,
    canCancel: false,
  },
  {
    id: 'complete',
    label: '藏品显影完成',
    detail: '作品已归档到收藏夹，可直接查看详情页并导出分享海报。',
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
    label: '封印阶段中断',
    detail: '已完成主体构图，但纹理封印未稳定，建议保留草稿并重新生成。',
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
    title: '标准显影',
    description: '用于生成页自动推进到结果页的顺畅流程。',
    completionStatus: 'complete',
    phases: successPhases,
    redirectCollectibleId: 'ruin-001',
  },
  {
    id: 'retryable-failure',
    title: '可重试中断',
    description: '用于失败态展示，保留足够完整的过程文案与重试入口。',
    completionStatus: 'failed',
    phases: retryableFailurePhases,
    redirectCollectibleId: 'message-002',
    retryLabel: '重新生成',
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
