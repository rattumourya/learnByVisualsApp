import { useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { mapKeyToPlayerAction } from '../lib/keyboard';
import type { AnimationStep } from '../lib/types';
import { usePlayerStore } from '../store/playerStore';
import { usePlayerControls } from '../hooks/usePlayerControls';
import { useStepFromElapsed, useTimeline } from '../hooks/useTimeline';
import { ProgressBar } from './ProgressBar';
import { SpeedSelect } from './SpeedSelect';
import { TransportControls } from './TransportControls';

interface AnimationPlayerProps {
  steps: AnimationStep[];
  ariaLabel?: string;
}

export function AnimationPlayer({ steps, ariaLabel = 'Lesson animation' }: AnimationPlayerProps) {
  const timeline = useTimeline(steps);
  const { currentIndex, elapsedMs, speed } = usePlayerStore();
  const controls = usePlayerControls({ timeline, steps });
  const { restart } = controls;
  const getIndexFromElapsed = useStepFromElapsed(timeline);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      restart();
    };
  }, [restart]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!containerRef.current) return;
      const isInside = containerRef.current.contains(document.activeElement);
      if (!isInside) return;

      const action = mapKeyToPlayerAction(event.key);
      if (!action) return;

      event.preventDefault();

      if (action === 'next') controls.next();
      else if (action === 'previous') controls.previous();
      else if (action === 'toggle') controls.toggle();
      else if (action === 'restart') controls.restart();
      else if (typeof action === 'object' && action.type === 'speed') {
        const updated = Math.min(2, Math.max(0.5, speed + action.delta));
        controls.setSpeed(updated);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [controls, speed]);

  const activeStep = steps[currentIndex];

  const indicator = useMemo(() => {
    const index = getIndexFromElapsed(elapsedMs);
    return index;
  }, [elapsedMs, getIndexFromElapsed]);

  const canGoPrevious = steps.length > 0 && currentIndex > 0;
  const canGoNext = steps.length > 0 && currentIndex < steps.length - 1;

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null) return;
    const deltaX = event.changedTouches[0]?.clientX - touchStartX.current;
    if (deltaX && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        controls.previous();
      } else {
        controls.next();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      ref={containerRef}
      aria-label={ariaLabel}
      className="flex flex-col gap-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep?.id}
            className="flex h-full w-full items-center justify-center p-8"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.4 }}
            role="img"
            aria-roledescription="Animation frame"
            aria-label={activeStep?.label}
          >
            <motion.svg
              viewBox="0 0 240 120"
              className="h-full w-full"
              {...(activeStep?.motion ?? {})}
            >
              <rect x="10" y="10" width="220" height="100" rx="12" className="fill-primary/10 stroke-primary" />
              <text x="120" y="40" textAnchor="middle" className="fill-current text-xl font-semibold">
                {activeStep?.label}
              </text>
              <text x="120" y="80" textAnchor="middle" className="fill-current text-sm opacity-70">
                Step {indicator + 1} / {steps.length}
              </text>
            </motion.svg>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
        <ProgressBar
          value={(elapsedMs / Math.max(1, timeline.totalDuration)) * 100}
          onSeek={controls.seek}
          totalDuration={timeline.totalDuration}
          elapsed={elapsedMs}
        />
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <TransportControls
            onPlay={controls.play}
            onPause={controls.pause}
            onNext={controls.next}
            onPrevious={controls.previous}
            onRestart={controls.restart}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
          />
          <SpeedSelect speed={speed} onSpeedChange={controls.setSpeed} />
        </div>
        <div className="flex flex-wrap gap-2" role="list" aria-label="Animation steps">
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => controls.seek(timeline.steps[index]?.start ?? 0)}
              className={`rounded-md border px-3 py-1 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${index === indicator ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/60'}`}
              aria-current={index === indicator}
              aria-pressed={index === indicator}
              role="listitem"
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
