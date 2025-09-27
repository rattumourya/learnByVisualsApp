import { useMemo } from 'react';
import { motion } from 'framer-motion';

import type { LessonContent } from '../../src/lib/types';

type SingletonPhase =
  | 'introduce-blueprint'
  | 'clients-demand'
  | 'first-request'
  | 'reuse-instance'
  | 'global-accessor'
  | 'thread-guard';

interface SingletonSceneProps {
  phase: SingletonPhase;
  prefersReducedMotion?: boolean;
}

const phaseConfig: Record<SingletonPhase, {
  singleton: 'focus' | 'pulse' | 'dim';
  clients: 'focus' | 'pulse' | 'dim';
  accessor: 'hidden' | 'focus' | 'pulse';
  guard: 'hidden' | 'focus';
  arrows: [number, number, number];
}> = {
  'introduce-blueprint': {
    singleton: 'pulse',
    clients: 'dim',
    accessor: 'hidden',
    guard: 'hidden',
    arrows: [0, 0, 0]
  },
  'clients-demand': {
    singleton: 'dim',
    clients: 'focus',
    accessor: 'hidden',
    guard: 'hidden',
    arrows: [0.2, 0.2, 0.2]
  },
  'first-request': {
    singleton: 'focus',
    clients: 'focus',
    accessor: 'focus',
    guard: 'dim',
    arrows: [1, 0.2, 0.2]
  },
  'reuse-instance': {
    singleton: 'pulse',
    clients: 'focus',
    accessor: 'focus',
    guard: 'dim',
    arrows: [1, 1, 1]
  },
  'global-accessor': {
    singleton: 'focus',
    clients: 'focus',
    accessor: 'pulse',
    guard: 'dim',
    arrows: [1, 1, 1]
  },
  'thread-guard': {
    singleton: 'focus',
    clients: 'dim',
    accessor: 'focus',
    guard: 'focus',
    arrows: [1, 1, 1]
  }
};

function SingletonScene({ phase, prefersReducedMotion }: SingletonSceneProps) {
  const transition = useMemo(() => ({ duration: prefersReducedMotion ? 0.2 : 0.5 }), [prefersReducedMotion]);
  const pulseTransition = useMemo(
    () =>
      prefersReducedMotion
        ? { duration: 0.2 }
        : { duration: 1.6, repeat: Infinity as const, repeatType: 'loop' as const },
    [prefersReducedMotion]
  );

  const highlightStyles = useMemo(
    () => ({
      dim: { opacity: 0.35, scale: 1, transition },
      focus: { opacity: 1, scale: 1, transition },
      pulse: {
        opacity: 1,
        scale: prefersReducedMotion ? 1 : [1, 1.05, 1],
        transition: pulseTransition
      }
    }),
    [prefersReducedMotion, pulseTransition, transition]
  );

  const config = phaseConfig[phase];
  const arrowTransition = prefersReducedMotion ? { duration: 0.2 } : { duration: 0.6 };

  const arrowColors = ['#38bdf8', '#34d399', '#f472b6'];
  const clientYPositions = [60, 120, 180];

  return (
    <motion.svg
      viewBox="0 0 360 220"
      className="h-full w-full"
      role="presentation"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={transition}
    >
      <defs>
        <pattern id="singletonGrid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(148, 163, 184, 0.18)" strokeWidth={1} />
        </pattern>
        <linearGradient id="singletonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.95" />
        </linearGradient>
        <marker id="singletonArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto" fill="#38bdf8">
          <polygon points="0 0, 8 4, 0 8" />
        </marker>
      </defs>

      <rect x="0" y="0" width="360" height="220" rx="24" fill="url(#singletonGrid)" opacity={0.7} />

      <motion.g animate={highlightStyles[config.clients]} style={{ transformOrigin: '40px 120px' }}>
        {clientYPositions.map((y, index) => (
          <g key={`client-${index}`}>
            <rect
              x={24}
              y={y - 26}
              width={118}
              height={44}
              rx={12}
              fill="rgba(15, 118, 110, 0.12)"
              stroke="rgba(13, 148, 136, 0.35)"
            />
            <text x={40} y={y} className="fill-current text-sm font-semibold">
              Client {String.fromCharCode(65 + index)}
            </text>
            <text x={40} y={y + 16} className="fill-current text-xs opacity-70">
              Requests config
            </text>
          </g>
        ))}
      </motion.g>

      <motion.g animate={highlightStyles[config.singleton]} style={{ transformOrigin: '220px 120px' }}>
        <circle cx={220} cy={120} r={54} fill="url(#singletonGradient)" opacity={0.92} />
        <text x={220} y={108} textAnchor="middle" className="fill-white text-base font-semibold">
          Singleton
        </text>
        <text x={220} y={128} textAnchor="middle" className="fill-white/80 text-xs">
          Shared instance
        </text>
      </motion.g>

      <motion.g animate={highlightStyles[config.accessor]} style={{ transformOrigin: '220px 32px' }}>
        <rect
          x={170}
          y={20}
          width={100}
          height={36}
          rx={10}
          fill="rgba(59, 130, 246, 0.15)"
          stroke="rgba(37, 99, 235, 0.6)"
        />
        <text x={220} y={42} textAnchor="middle" className="fill-current text-sm font-semibold">
          getInstance()
        </text>
      </motion.g>

      <motion.g animate={config.guard === 'focus' ? { opacity: 1, scale: prefersReducedMotion ? 1 : [1, 1.1, 1], transition: pulseTransition } : { opacity: 0, transition }}>
        <circle cx={220} cy={120} r={70} fill="none" stroke="rgba(190, 242, 100, 0.65)" strokeWidth={4} strokeDasharray="6 8" />
        <text x={220} y={178} textAnchor="middle" className="fill-lime-500 text-xs font-semibold">
          Thread-safe guard
        </text>
      </motion.g>

      {clientYPositions.map((y, index) => (
        <motion.path
          key={`arrow-${index}`}
          d={`M 142 ${y - 4} C 170 ${y - 10}, 190 ${110}, 212 110`}
          stroke={arrowColors[index]}
          strokeWidth={3}
          fill="none"
          strokeDasharray="6 6"
          markerEnd="url(#singletonArrow)"
          animate={{ opacity: config.arrows[index] }}
          transition={arrowTransition}
        />
      ))}

      <motion.path
        d="M 220 56 L 220 66"
        stroke="#2563eb"
        strokeWidth={3}
        strokeDasharray="4 4"
        animate={{ opacity: config.accessor === 'hidden' ? 0.2 : 1 }}
        transition={transition}
      />

      <text x={40} y={24} className="fill-current text-xs uppercase tracking-wide opacity-60">
        Multiple consumers
      </text>
      <text x={220} y={200} textAnchor="middle" className="fill-current text-xs opacity-70">
        One orchestrated instance shared everywhere
      </text>
    </motion.svg>
  );
}

const content: LessonContent = {
  meta: {
    id: 'singleton-pattern-visual',
    slug: 'singleton-pattern-visual',
    title: 'Singleton Design Pattern Visualized',
    trackId: 'oop',
    durationMs: 210000,
    level: 'Intermediate',
    summary: 'See how a single shared instance coordinates requests safely across clients.'
  },
  steps: [
    {
      id: 'singleton-blueprint',
      label: 'Blueprint a single instance',
      description: 'Highlight the unique object responsible for coordinating shared state.',
      durationMs: 4500,
      motion: {},
      render: ({ prefersReducedMotion }) => <SingletonScene phase="introduce-blueprint" prefersReducedMotion={prefersReducedMotion} />,
      code: 'class ConfigRegistry {\n  private static instance: ConfigRegistry;\n  private constructor() {}\n  static getInstance() {\n    if (!ConfigRegistry.instance) {\n      ConfigRegistry.instance = new ConfigRegistry();\n    }\n    return ConfigRegistry.instance;\n  }\n}'
    },
    {
      id: 'clients-request',
      label: 'Clients queue up',
      description: 'Multiple consumers ask for configuration, hinting at potential duplication.',
      durationMs: 4800,
      motion: {},
      render: ({ prefersReducedMotion }) => <SingletonScene phase="clients-demand" prefersReducedMotion={prefersReducedMotion} />,
      code: '// Services all request configuration access\nconst a = ConfigRegistry.getInstance();\nconst b = ConfigRegistry.getInstance();'
    },
    {
      id: 'first-access',
      label: 'First accessor creates it',
      description: 'The first request builds the instance through the accessor.',
      durationMs: 5200,
      motion: {},
      render: ({ prefersReducedMotion }) => <SingletonScene phase="first-request" prefersReducedMotion={prefersReducedMotion} />,
      code: 'if (!instance) {\n  instance = new ConfigRegistry();\n}'
    },
    {
      id: 'reuse-instance',
      label: 'Everyone reuses the same instance',
      description: 'Subsequent calls return the cached singleton instead of constructing anew.',
      durationMs: 5200,
      motion: {},
      render: ({ prefersReducedMotion }) => <SingletonScene phase="reuse-instance" prefersReducedMotion={prefersReducedMotion} />,
      code: 'return ConfigRegistry.instance; // same reference for all callers'
    },
    {
      id: 'global-access',
      label: 'Global accessor stays lightweight',
      description: 'The getInstance facade exposes a simple entry point while hiding creation details.',
      durationMs: 5000,
      motion: {},
      render: ({ prefersReducedMotion }) => <SingletonScene phase="global-accessor" prefersReducedMotion={prefersReducedMotion} />,
      code: 'export const registry = Object.freeze({ get: (key) => ConfigRegistry.getInstance().get(key) });'
    },
    {
      id: 'thread-guard',
      label: 'Guard against races',
      description: 'Introduce a synchronization boundary to keep the singleton safe in concurrent scenarios.',
      durationMs: 5200,
      motion: {},
      render: ({ prefersReducedMotion }) => <SingletonScene phase="thread-guard" prefersReducedMotion={prefersReducedMotion} />,
      code: 'static getInstance() {\n  if (!ConfigRegistry.instance) {\n    synchronized(ConfigRegistry) {\n      if (!ConfigRegistry.instance) {\n        ConfigRegistry.instance = new ConfigRegistry();\n      }\n    }\n  }\n  return ConfigRegistry.instance;\n}'
    }
  ]
};

export default content;
