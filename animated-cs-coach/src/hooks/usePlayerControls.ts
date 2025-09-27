import { useCallback, useEffect, useRef } from 'react';

import type { AnimationStep, PlayerControls, TimelineSnapshot } from '../lib/types';
import { usePlayerStore } from '../store/playerStore';
import { clampElapsed } from './useTimeline';

interface Options {
  timeline: TimelineSnapshot;
  steps: AnimationStep[];
}

export function usePlayerControls({ timeline, steps }: Options): PlayerControls {
  const { status, currentIndex, elapsedMs, speed, setStatus, setIndex, setElapsed, setSpeed, reset } = usePlayerStore();

  const frameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  const play = useCallback(() => {
    if (status === 'playing') return;
    setStatus('playing');
  }, [setStatus, status]);

  const pause = useCallback(() => {
    if (status === 'paused') return;
    setStatus('paused');
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    lastTimestampRef.current = null;
  }, [setStatus, status]);

  const restart = useCallback(() => {
    reset();
  }, [reset]);

  const seek = useCallback(
    (position: number) => {
      const target = clampElapsed(position, timeline);
      setElapsed(target);
      const newIndex = timeline.steps.findIndex((step) => target >= step.start && target < step.end);
      setIndex(newIndex === -1 ? timeline.steps.length - 1 : newIndex);
    },
    [setElapsed, setIndex, timeline],
  );

  const goToIndex = useCallback(
    (index: number) => {
      const safeIndex = Math.max(0, Math.min(index, steps.length - 1));
      setIndex(safeIndex);
      const entry = timeline.steps[safeIndex];
      setElapsed(entry?.start ?? 0);
    },
    [setElapsed, setIndex, steps.length, timeline.steps],
  );

  const next = useCallback(() => {
    goToIndex(currentIndex + 1);
  }, [currentIndex, goToIndex]);

  const previous = useCallback(() => {
    goToIndex(currentIndex - 1);
  }, [currentIndex, goToIndex]);

  const toggle = useCallback(() => {
    if (status === 'playing') {
      pause();
    } else {
      play();
    }
  }, [pause, play, status]);

  const setPlaybackSpeed = useCallback(
    (value: number) => {
      const clamped = Math.max(0.5, Math.min(2, value));
      setSpeed(clamped);
    },
    [setSpeed],
  );

  useEffect(() => {
    if (status !== 'playing') return;

    const tick = (timestamp: number) => {
      if (lastTimestampRef.current == null) {
        lastTimestampRef.current = timestamp;
      }

      const delta = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      const updatedElapsed = clampElapsed(elapsedMs + delta * speed, timeline);
      setElapsed(updatedElapsed);

      const index = timeline.steps.findIndex((entry) => updatedElapsed >= entry.start && updatedElapsed < entry.end);
      if (index !== -1 && index !== currentIndex) {
        setIndex(index);
      }

      if (updatedElapsed >= timeline.totalDuration) {
        setStatus('paused');
        lastTimestampRef.current = null;
        return;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [currentIndex, elapsedMs, setElapsed, setIndex, setStatus, speed, status, timeline]);

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  return {
    play,
    pause,
    toggle,
    next,
    previous,
    restart,
    seek,
    setSpeed: setPlaybackSpeed
  };
}
