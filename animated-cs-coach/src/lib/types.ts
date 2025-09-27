import type { MotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

export interface AnimationStep {
  id: string;
  label: string;
  description: string;
  code?: string;
  motion: MotionProps;
  durationMs: number;
  render?: ((context: AnimationRenderContext) => ReactNode) | ReactNode;
}

export interface AnimationRenderContext {
  step: AnimationStep;
  index: number;
  isActive: boolean;
  zoom: number;
  prefersReducedMotion: boolean;
}

export interface LessonContent {
  meta: LessonMeta;
  steps: AnimationStep[];
  resources?: {
    title: string;
    url: string;
  }[];
}

export interface LessonMeta {
  id: string;
  slug: string;
  title: string;
  trackId: TrackMeta['id'];
  durationMs: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
}

export interface TrackMeta {
  id: 'dsa' | 'system-design' | 'oop';
  title: string;
  slug: string;
  description: string;
  accent: string;
}

export interface TimelineStep {
  step: AnimationStep;
  start: number;
  end: number;
}

export interface PlayerState {
  status: 'idle' | 'playing' | 'paused';
  currentIndex: number;
  elapsedMs: number;
  speed: number;
}

export interface PlayerControls {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  restart: () => void;
  seek: (position: number) => void;
  setSpeed: (speed: number) => void;
}

export interface TimelineSnapshot {
  steps: TimelineStep[];
  totalDuration: number;
}
