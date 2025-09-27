import { describe, expect, it } from 'vitest';

import type { AnimationStep } from '../lib/types';
import { buildTimeline, clampElapsed, findStepIndexByElapsed } from '../hooks/useTimeline';

const steps: AnimationStep[] = [
  { id: 'a', label: 'A', description: 'A', durationMs: 1000, motion: {} },
  { id: 'b', label: 'B', description: 'B', durationMs: 2000, motion: {} },
  { id: 'c', label: 'C', description: 'C', durationMs: 3000, motion: {} }
];

describe('buildTimeline', () => {
  it('calculates cumulative durations', () => {
    const timeline = buildTimeline(steps);
    expect(timeline.totalDuration).toBe(6000);
    expect(timeline.steps[1]).toMatchObject({ start: 1000, end: 3000 });
  });
});

describe('clampElapsed', () => {
  const timeline = buildTimeline(steps);
  it('clamps values below 0', () => {
    expect(clampElapsed(-10, timeline)).toBe(0);
  });
  it('clamps values above total', () => {
    expect(clampElapsed(9999, timeline)).toBe(6000);
  });
});

describe('findStepIndexByElapsed', () => {
  const timeline = buildTimeline(steps);
  it('returns correct index for middle range', () => {
    expect(findStepIndexByElapsed(2500, timeline)).toBe(1);
  });
  it('returns -1 when elapsed outside', () => {
    expect(findStepIndexByElapsed(7000, timeline)).toBe(-1);
  });
});
