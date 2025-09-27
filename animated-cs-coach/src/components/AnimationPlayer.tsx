import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import { Maximize2, Minimize2 } from 'lucide-react';

import { mapKeyToPlayerAction } from '../lib/keyboard';
import type { AnimationStep } from '../lib/types';
import { usePlayerStore } from '../store/playerStore';
import { usePlayerControls } from '../hooks/usePlayerControls';
import { useStepFromElapsed, useTimeline } from '../hooks/useTimeline';
import { ProgressBar } from './ProgressBar';
import { SpeedSelect } from './SpeedSelect';
import { TransportControls } from './TransportControls';
import { ZoomControls } from './ZoomControls';
import { Button } from './ui/button';

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
  const playerSectionRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    return () => {
      restart();
    };
  }, [restart]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!playerSectionRef.current) return;
      const isInside = playerSectionRef.current.contains(document.activeElement);
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

  const renderedContent = useMemo(() => {
    if (!activeStep) return null;
    if (typeof activeStep.render === 'function') {
      return activeStep.render({
        step: activeStep,
        index: currentIndex,
        isActive: true,
        zoom,
        prefersReducedMotion
      });
    }

    if (activeStep.render) {
      return activeStep.render;
    }

    return (
      <motion.svg viewBox="0 0 240 120" className="h-full w-full" {...(activeStep.motion ?? {})}>
        <rect x="10" y="10" width="220" height="100" rx="12" className="fill-primary/10 stroke-primary" />
        <text x="120" y="40" textAnchor="middle" className="fill-current text-xl font-semibold">
          {activeStep.label}
        </text>
        <text x="120" y="80" textAnchor="middle" className="fill-current text-sm opacity-70">
          Step {indicator + 1} / {steps.length}
        </text>
      </motion.svg>
    );
  }, [activeStep, currentIndex, indicator, prefersReducedMotion, steps.length, zoom]);

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

  const handleZoomChange = useCallback((value: number) => {
    setZoom(value);
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!playerSectionRef.current) return;

    if (!document.fullscreenElement) {
      await playerSectionRef.current.requestFullscreen();
    } else if (document.exitFullscreen) {
      await document.exitFullscreen();
    }
  }, []);

  const handleDoubleClick = useCallback(() => {
    void toggleFullscreen();
  }, [toggleFullscreen]);

  return (
    <section
      ref={playerSectionRef}
      aria-label={ariaLabel}
      className={clsx('flex flex-col gap-4', isFullscreen && 'h-full w-full justify-center bg-background p-4')}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      data-fullscreen={isFullscreen}
    >
      <div
        className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted"
        onDoubleClick={handleDoubleClick}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep?.id}
              className="flex h-full w-full items-center justify-center p-4 sm:p-8"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.4 }}
              role="img"
              aria-roledescription="Animation frame"
              aria-label={activeStep?.label}
            >
              {renderedContent}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
        <ProgressBar
          value={(elapsedMs / Math.max(1, timeline.totalDuration)) * 100}
          onSeek={controls.seek}
          totalDuration={timeline.totalDuration}
          elapsed={elapsedMs}
        />
        <div className="flex flex-col gap-3">
          <TransportControls
            onPlay={controls.play}
            onPause={controls.pause}
            onNext={controls.next}
            onPrevious={controls.previous}
            onRestart={controls.restart}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
          />
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <SpeedSelect speed={speed} onSpeedChange={controls.setSpeed} />
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <ZoomControls zoom={zoom} onZoomChange={handleZoomChange} onReset={handleZoomReset} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void toggleFullscreen()}
                aria-pressed={isFullscreen}
                className="flex items-center gap-2"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                <span className="text-xs font-medium sm:text-sm">
                  {isFullscreen ? 'Exit full screen' : 'Full screen'}
                </span>
              </Button>
            </div>
          </div>
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
