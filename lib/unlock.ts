import type { Stage, StageStatus } from './stages';

/**
 * Stage unlock logic utilities
 */

/**
 * Complete a stage and unlock the next one
 * Returns updated stages array
 */
export function completeStage(stages: Stage[], stageId: number): Stage[] {
  return stages.map((stage, index) => {
    // Mark the current stage as completed
    if (stage.id === stageId) {
      return { ...stage, status: 'completed' as StageStatus };
    }

    // Unlock the next stage if it's locked and previous stage is now completed
    if (
      index > 0 &&
      stages[index - 1].id === stageId &&
      stage.status === 'locked'
    ) {
      return { ...stage, status: 'active' as StageStatus };
    }

    return stage;
  });
}

/**
 * Initialize stage statuses based on sequential unlock rules
 * Stage 1 starts as active, all others locked
 */
export function initializeStageStatuses(stages: Stage[]): Stage[] {
  return stages.map((stage, index) => {
    if (index === 0) {
      return { ...stage, status: 'active' as StageStatus };
    }
    return { ...stage, status: 'locked' as StageStatus };
  });
}

/**
 * Check if a stage can be unlocked (previous stage is completed)
 */
export function canUnlockStage(stages: Stage[], stageId: number): boolean {
  const stageIndex = stages.findIndex((s) => s.id === stageId);

  // Stage 1 can always be unlocked
  if (stageIndex === 0) {
    return true;
  }

  // Check if previous stage is completed
  if (stageIndex > 0) {
    const previousStage = stages[stageIndex - 1];
    return previousStage.status === 'completed';
  }

  return false;
}

/**
 * Get the currently active stage
 */
export function getActiveStage(stages: Stage[]): Stage | null {
  return stages.find((stage) => stage.status === 'active') || null;
}

/**
 * Get the next locked stage that can be unlocked
 */
export function getNextUnlockableStage(stages: Stage[]): Stage | null {
  for (let i = 0; i < stages.length; i++) {
    if (stages[i].status === 'locked' && canUnlockStage(stages, stages[i].id)) {
      return stages[i];
    }
  }
  return null;
}

/**
 * Calculate overall progress
 */
export function getProgress(stages: Stage[]): {
  completed: number;
  total: number;
  percentage: number;
} {
  const completed = stages.filter((s) => s.status === 'completed').length;
  const total = stages.length;
  const percentage = Math.round((completed / total) * 100);

  return { completed, total, percentage };
}

/**
 * Check if all stages are completed
 */
export function isJourneyComplete(stages: Stage[]): boolean {
  return stages.every((stage) => stage.status === 'completed');
}

/**
 * Unlock a specific stage (admin/debug only)
 * This bypasses the sequential unlock logic
 */
export function forceUnlockStage(stages: Stage[], stageId: number): Stage[] {
  return stages.map((stage) => {
    if (stage.id === stageId && stage.status === 'locked') {
      return { ...stage, status: 'active' as StageStatus };
    }
    return stage;
  });
}

/**
 * Reset all stages to initial state
 */
export function resetAllStages(stages: Stage[]): Stage[] {
  return initializeStageStatuses(stages);
}
