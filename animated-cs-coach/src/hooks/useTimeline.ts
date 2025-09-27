import { useCallback, useMemo } from 'react';

import type { AnimationStep, TimelineSnapshot, TimelineStep } from '../lib/types';

export function buildTimeline(steps: AnimationStep[]): TimelineSnapshot {
  let cursor = 0;
  const timelineSteps: TimelineStep[] = steps.map((step) => {
    const start = cursor;
    const end = start + step.durationMs;
    cursor = end;
    return { step, start, end };
  });

  return {
    steps: timelineSteps,
    totalDuration: cursor
  };
}

export function findStepIndexByElapsed(elapsedMs: number, timeline: TimelineSnapshot) {
  return timeline.steps.findIndex((entry) => elapsedMs >= entry.start && elapsedMs < entry.end);
}

export function clampElapsed(elapsedMs: number, timeline: TimelineSnapshot) {
  if (elapsedMs < 0) return 0;
  if (elapsedMs > timeline.totalDuration) return timeline.totalDuration;
  return elapsedMs;
}

export function useTimeline(steps: AnimationStep[]) {
  return useMemo(() => buildTimeline(steps), [steps]);
}

export function useStepFromElapsed(timeline: TimelineSnapshot) {
  return useCallback(
    (elapsedMs: number) => {
      const clamped = clampElapsed(elapsedMs, timeline);
      const index = findStepIndexByElapsed(clamped, timeline);
      return index === -1 ? timeline.steps.length - 1 : index;
    },
    [timeline],
  );
}
