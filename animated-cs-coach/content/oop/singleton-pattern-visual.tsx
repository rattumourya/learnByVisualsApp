import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

import type { LessonContent } from '../../src/lib/types';
import { cn } from '../../src/lib/utils';

type DiagramPhase =
  | 'module-blueprint'
  | 'seal-constructor'
  | 'instantiate-instance'
  | 'expose-facade'
  | 'fanout-clients';

type ElementState = 'dim' | 'focus' | 'glow';
type ConnectorState = 'inactive' | 'flow';

type ComponentKey = 'componentA' | 'componentB' | 'componentC' | 'componentD';

type ElementKey =
  | 'module'
  | 'singletonClass'
  | 'singletonInstance'
  | 'publicObject'
  | ComponentKey;

interface DiagramPhaseConfig {
  elements: Partial<Record<ElementKey, ElementState>>;
  connectors: Partial<Record<ConnectorKey, ConnectorState>>;
  note: string;
}

type ConnectorKey =
  | 'module-to-object'
  | 'object-to-componentA'
  | 'object-to-componentB'
  | 'object-to-componentC'
  | 'object-to-componentD'
  | 'annotation-left'
  | 'annotation-right';

const componentMeta: Record<ComponentKey, { title: string; accent: string; summary: string }> = {
  componentA: {
    title: 'Component A',
    accent: '#f472b6',
    summary: 'UI Layer'
  },
  componentB: {
    title: 'Component B',
    accent: '#38bdf8',
    summary: 'Worker Service'
  },
  componentC: {
    title: 'Component C',
    accent: '#22d3ee',
    summary: 'Reporting'
  },
  componentD: {
    title: 'Component D',
    accent: '#a855f7',
    summary: 'Automation'
  }
};

const phaseConfig: Record<DiagramPhase, DiagramPhaseConfig> = {
  'module-blueprint': {
    elements: {
      module: 'glow',
      singletonClass: 'focus',
      singletonInstance: 'dim',
      publicObject: 'dim',
      componentA: 'dim',
      componentB: 'dim',
      componentC: 'dim',
      componentD: 'dim'
    },
    connectors: {},
    note: 'Define a dedicated module that encapsulates the singleton blueprint and prevents outside construction.'
  },
  'seal-constructor': {
    elements: {
      module: 'focus',
      singletonClass: 'glow',
      singletonInstance: 'focus',
      publicObject: 'dim',
      componentA: 'dim',
      componentB: 'dim',
      componentC: 'dim',
      componentD: 'dim'
    },
    connectors: {},
    note: 'Mark the constructor private so the module is the only place that can create the singleton object.'
  },
  'instantiate-instance': {
    elements: {
      module: 'focus',
      singletonClass: 'focus',
      singletonInstance: 'glow',
      publicObject: 'focus',
      componentA: 'dim',
      componentB: 'dim',
      componentC: 'dim',
      componentD: 'dim'
    },
    connectors: {
      'module-to-object': 'flow'
    },
    note: 'Lazily allocate the single instance inside the module and hold it behind a controlled accessor.'
  },
  'expose-facade': {
    elements: {
      module: 'focus',
      singletonClass: 'focus',
      singletonInstance: 'focus',
      publicObject: 'glow',
      componentA: 'focus',
      componentB: 'focus',
      componentC: 'focus',
      componentD: 'focus'
    },
    connectors: {
      'module-to-object': 'flow'
    },
    note: 'Expose a facade object that callers use as their single point of contact with the singleton module.'
  },
  'fanout-clients': {
    elements: {
      module: 'focus',
      singletonClass: 'focus',
      singletonInstance: 'focus',
      publicObject: 'glow',
      componentA: 'glow',
      componentB: 'glow',
      componentC: 'glow',
      componentD: 'glow'
    },
    connectors: {
      'module-to-object': 'flow',
      'object-to-componentA': 'flow',
      'object-to-componentB': 'flow',
      'object-to-componentC': 'flow',
      'object-to-componentD': 'flow',
      'annotation-left': 'flow',
      'annotation-right': 'flow'
    },
    note: 'All consuming components route through the shared object, guaranteeing they collaborate with the exact same instance.'
  }
};

const connectorDefinitions: Record<ConnectorKey, { path: string; color: string; width: number; dashed?: boolean }> = {
  'module-to-object': {
    path: 'M500 240 C 500 285 500 315 500 360',
    color: '#34d399',
    width: 6
  },
  'object-to-componentA': {
    path: 'M500 400 C 360 420 260 460 210 520',
    color: '#f472b6',
    width: 5
  },
  'object-to-componentB': {
    path: 'M500 400 C 420 420 360 450 330 520',
    color: '#38bdf8',
    width: 5
  },
  'object-to-componentC': {
    path: 'M500 400 C 580 420 640 450 670 520',
    color: '#22d3ee',
    width: 5
  },
  'object-to-componentD': {
    path: 'M500 400 C 640 420 740 460 790 520',
    color: '#a855f7',
    width: 5
  },
  'annotation-left': {
    path: 'M360 355 C 250 330 190 300 160 260',
    color: 'rgba(203, 213, 225, 0.6)',
    width: 2,
    dashed: true
  },
  'annotation-right': {
    path: 'M640 255 C 740 250 820 220 860 170',
    color: 'rgba(203, 213, 225, 0.6)',
    width: 2,
    dashed: true
  }
};

function getElementVisuals(status: ElementState | undefined, accent: string, prefersReducedMotion: boolean) {
  const resolved = status ?? 'dim';
  const baseBackground = resolved === 'dim' ? `${accent}12` : `${accent}24`;
  const boxShadow =
    resolved === 'glow'
      ? `0 0 0 3px ${accent}33, 0 18px 45px -25px rgba(15, 23, 42, 0.7)`
      : '0 14px 35px -30px rgba(15, 23, 42, 0.9)';
  const animate = resolved === 'glow' && !prefersReducedMotion ? { scale: [1, 1.04, 1] } : { scale: 1 };
  const transition =
    resolved === 'glow' && !prefersReducedMotion
      ? { duration: 2.4, ease: 'easeInOut', repeat: Infinity as const }
      : { duration: 0.3 };

  return {
    className: cn(
      'rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-left shadow-lg transition-colors backdrop-blur',
      resolved === 'dim' ? 'opacity-70' : 'opacity-100'
    ),
    style: {
      background: `linear-gradient(165deg, rgba(15, 118, 110, 0) 0%, ${baseBackground} 100%)`,
      borderColor: `${accent}55`,
      boxShadow
    } as const,
    animate,
    transition
  };
}

interface SingletonModuleCardProps {
  module: ElementState | undefined;
  singletonClass: ElementState | undefined;
  singletonInstance: ElementState | undefined;
  prefersReducedMotion: boolean;
}

const SingletonModuleCard = memo(function SingletonModuleCard({
  module,
  singletonClass,
  singletonInstance,
  prefersReducedMotion
}: SingletonModuleCardProps) {
  const moduleVisual = useMemo(
    () => getElementVisuals(module, '#34d399', prefersReducedMotion),
    [module, prefersReducedMotion]
  );
  const classVisual = useMemo(
    () => getElementVisuals(singletonClass, '#4ade80', prefersReducedMotion),
    [prefersReducedMotion, singletonClass]
  );
  const instanceVisual = useMemo(
    () => getElementVisuals(singletonInstance, '#22c55e', prefersReducedMotion),
    [prefersReducedMotion, singletonInstance]
  );

  return (
    <motion.div
      className={cn(
        'relative w-full max-w-[360px] rounded-[28px] border border-emerald-500/30 bg-emerald-500/10 p-5 text-slate-50 shadow-xl backdrop-blur',
        moduleVisual.className
      )}
      style={{
        ...moduleVisual.style,
        background: 'linear-gradient(165deg, rgba(14, 116, 144, 0.12) 0%, rgba(34, 197, 94, 0.28) 100%)',
        borderColor: '#34d39955'
      }}
      animate={moduleVisual.animate}
      transition={moduleVisual.transition}
      aria-label="Singleton module"
    >
      <p className="text-lg font-semibold tracking-wide text-emerald-200">Singleton Module</p>
      <p className="mt-1 text-sm text-emerald-100/80">Owns creation and access policy</p>
      <motion.div
        className={cn('mt-4 rounded-xl p-4', classVisual.className)}
        style={{
          ...classVisual.style,
          background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.15) 0%, rgba(45, 212, 191, 0.2) 100%)',
          borderColor: '#38bdf855'
        }}
        animate={classVisual.animate}
        transition={classVisual.transition}
        aria-label="Singleton class"
      >
        <p className="text-base font-semibold text-cyan-100">Singleton class</p>
        <p className="mt-1 text-xs text-cyan-100/80">Private constructor + static accessor</p>
      </motion.div>
      <motion.div
        className={cn('mt-3 rounded-xl p-4', instanceVisual.className)}
        style={{
          ...instanceVisual.style,
          background: 'linear-gradient(180deg, rgba(34, 197, 94, 0.18) 0%, rgba(22, 101, 52, 0.42) 100%)',
          borderColor: '#22c55e55'
        }}
        animate={instanceVisual.animate}
        transition={instanceVisual.transition}
        aria-label="Singleton object"
      >
        <p className="text-base font-semibold text-emerald-100">Singleton object</p>
        <p className="mt-1 text-xs text-emerald-100/75">Cached instance living inside the module</p>
      </motion.div>
    </motion.div>
  );
});

interface PublicObjectProps {
  status: ElementState | undefined;
  prefersReducedMotion: boolean;
}

const PublicObject = memo(function PublicObject({ status, prefersReducedMotion }: PublicObjectProps) {
  const visuals = useMemo(() => getElementVisuals(status, '#fde68a', prefersReducedMotion), [prefersReducedMotion, status]);

  return (
    <motion.div
      className={cn(
        'w-full max-w-[240px] rounded-[26px] border border-amber-400/50 bg-amber-400/15 px-5 py-4 text-center font-medium text-amber-100 shadow-lg backdrop-blur',
        visuals.className
      )}
      style={{
        ...visuals.style,
        background: 'linear-gradient(170deg, rgba(253, 230, 138, 0.22) 0%, rgba(217, 119, 6, 0.18) 100%)',
        borderColor: '#fbbf2455',
        color: '#fef3c7'
      }}
      animate={visuals.animate}
      transition={visuals.transition}
      aria-label="Public facade object"
    >
      <p className="text-lg font-semibold">Object</p>
      <p className="mt-1 text-xs font-normal text-amber-100/80">Shared point of contact</p>
    </motion.div>
  );
});

interface ComponentRackProps {
  elements: Partial<Record<ComponentKey, ElementState>>;
  prefersReducedMotion: boolean;
}

const ComponentRack = memo(function ComponentRack({ elements, prefersReducedMotion }: ComponentRackProps) {
  return (
    <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {(Object.keys(componentMeta) as ComponentKey[]).map((key) => {
        const { accent, summary, title } = componentMeta[key];
        const visuals = getElementVisuals(elements[key], accent, prefersReducedMotion);
        return (
          <motion.div
            key={key}
            className={cn(
              'rounded-[24px] border px-4 py-4 text-left text-sm text-slate-100 shadow-lg backdrop-blur',
              visuals.className
            )}
            style={{
              ...visuals.style,
              background: `linear-gradient(170deg, ${accent}1f 0%, ${accent}35 100%)`,
              borderColor: `${accent}55`
            }}
            animate={visuals.animate}
            transition={visuals.transition}
          >
            <p className="text-base font-semibold" style={{ color: accent }}>
              {title}
            </p>
            <p className="mt-2 text-xs text-slate-100/70">Component state</p>
            <div className="mt-3 space-y-2 rounded-xl border border-white/5 bg-slate-900/40 p-3 text-xs text-slate-300">
              <p>State variables</p>
              <p className="text-slate-400">Object</p>
            </div>
            <p className="mt-3 text-xs text-slate-200/70">{summary}</p>
          </motion.div>
        );
      })}
    </div>
  );
});

interface AnnotationProps {
  prefersReducedMotion: boolean;
  phase: DiagramPhase;
}

const AnnotationLayer = memo(function AnnotationLayer({ prefersReducedMotion, phase }: AnnotationProps) {
  const note = phaseConfig[phase].note;
  const showExtended = phase === 'fanout-clients';

  return (
    <>
      <motion.div
        className="absolute left-6 top-1/3 max-w-[220px] text-left text-sm text-slate-200/80"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: showExtended ? 1 : 0.25, y: showExtended ? 0 : 8 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
      >
        <p>This is the object that is exposed by the singleton module which acts as a single point of contact.</p>
      </motion.div>
      <motion.div
        className="absolute right-6 top-[18%] max-w-[240px] text-left text-sm text-slate-200/80"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: showExtended ? 1 : 0.25, y: showExtended ? 0 : 8 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
      >
        <p>Singleton module consists of its class and its only instantiable object.</p>
      </motion.div>
      <motion.div
        className="absolute left-1/2 top-6 w-[min(90%,420px)] -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
      >
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-200/80">Singleton Pattern</p>
        <p className="mt-2 text-base text-slate-100/80">{note}</p>
      </motion.div>
    </>
  );
});

interface SingletonDiagramSceneProps {
  phase: DiagramPhase;
  prefersReducedMotion?: boolean;
}

const SingletonDiagramScene = memo(function SingletonDiagramScene({
  phase,
  prefersReducedMotion = false
}: SingletonDiagramSceneProps) {
  const config = phaseConfig[phase];

  return (
    <motion.div
      className="relative flex h-full min-h-[460px] w-full items-center justify-center overflow-hidden rounded-[36px] bg-[#1c1f2b] p-6 text-slate-100 shadow-inner md:p-10"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: 'easeOut' }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.12), transparent 45%), radial-gradient(circle at 80% 30%, rgba(129, 140, 248, 0.18), transparent 55%), radial-gradient(circle at 50% 80%, rgba(244, 114, 182, 0.14), transparent 45%)'
        }}
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 600" aria-hidden>
        <defs>
          <marker
            id="arrow-head"
            markerWidth="10"
            markerHeight="10"
            refX="10"
            refY="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        {(Object.keys(connectorDefinitions) as ConnectorKey[]).map((key) => {
          const definition = connectorDefinitions[key];
          const status = config.connectors[key] ?? 'inactive';
          const isFlowing = status === 'flow';

          return (
            <motion.path
              key={key}
              d={definition.path}
              fill="transparent"
              stroke={definition.color}
              strokeWidth={definition.width}
              strokeDasharray={definition.dashed ? '8 10' : undefined}
              markerEnd={!definition.dashed ? 'url(#arrow-head)' : undefined}
              initial={{ pathLength: isFlowing ? 0 : 0.15, opacity: isFlowing ? 0 : 0.2 }}
              animate={{
                pathLength: isFlowing ? 1 : 0.2,
                opacity: isFlowing ? 1 : 0.35,
                strokeDashoffset: definition.dashed ? (isFlowing ? 16 : 24) : 0
              }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.9, ease: 'easeInOut' }}
            />
          );
        })}
      </svg>

      <AnnotationLayer phase={phase} prefersReducedMotion={prefersReducedMotion} />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-10">
        <div className="flex w-full justify-center">
          <SingletonModuleCard
            module={config.elements.module}
            singletonClass={config.elements.singletonClass}
            singletonInstance={config.elements.singletonInstance}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>
        <PublicObject status={config.elements.publicObject} prefersReducedMotion={prefersReducedMotion} />
        <ComponentRack elements={config.elements} prefersReducedMotion={prefersReducedMotion} />
      </div>
    </motion.div>
  );
});

const content: LessonContent = {
  meta: {
    id: 'singleton-pattern-visual',
    slug: 'singleton-pattern-visual',
    title: 'Singleton Design Pattern Visualized',
    trackId: 'oop',
    durationMs: 200000,
    level: 'Intermediate',
    summary: 'See how a single shared instance coordinates requests safely across clients.'
  },
  steps: [
    {
      id: 'module-blueprint',
      label: 'Blueprint the module boundary',
      description: 'Establish a dedicated module responsible for constructing and owning the singleton.',
      durationMs: 4500,
      motion: {},
      render: ({ prefersReducedMotion }) => (
        <SingletonDiagramScene phase="module-blueprint" prefersReducedMotion={prefersReducedMotion} />
      ),
      code: 'class ConfigModule {\n  private constructor() {}\n  static getInstance(): ConfigModule {\n    // factory stub\n  }\n}'
    },
    {
      id: 'seal-constructor',
      label: 'Seal the constructor',
      description: 'Lock down the constructor so consumers must come through the static accessor.',
      durationMs: 4600,
      motion: {},
      render: ({ prefersReducedMotion }) => (
        <SingletonDiagramScene phase="seal-constructor" prefersReducedMotion={prefersReducedMotion} />
      ),
      code: 'private constructor() {\n  // prevents new ConfigModule() outside\n}'
    },
    {
      id: 'instantiate-instance',
      label: 'Instantiate once inside the module',
      description: 'Lazily build and cache the object the first time someone asks for it.',
      durationMs: 5200,
      motion: {},
      render: ({ prefersReducedMotion }) => (
        <SingletonDiagramScene phase="instantiate-instance" prefersReducedMotion={prefersReducedMotion} />
      ),
      code: 'private static instance: ConfigModule | null = null;\nstatic getInstance() {\n  if (!this.instance) {\n    this.instance = new ConfigModule();\n  }\n  return this.instance;\n}'
    },
    {
      id: 'expose-facade',
      label: 'Expose a stable facade object',
      description: 'Return a facade that callers treat as their shared resource connection.',
      durationMs: 4800,
      motion: {},
      render: ({ prefersReducedMotion }) => (
        <SingletonDiagramScene phase="expose-facade" prefersReducedMotion={prefersReducedMotion} />
      ),
      code: 'export const registry = Object.freeze({\n  get: (key: string) => ConfigModule.getInstance().read(key)\n});'
    },
    {
      id: 'fanout-clients',
      label: 'Fan out to every consumer',
      description: 'All components reference the same instance, so shared state stays synchronized.',
      durationMs: 5200,
      motion: {},
      render: ({ prefersReducedMotion }) => (
        <SingletonDiagramScene phase="fanout-clients" prefersReducedMotion={prefersReducedMotion} />
      ),
      code: 'const a = registry.get("theme");\nconst b = registry.get("theme"); // same reference as a'
    }
  ]
};

export default content;
