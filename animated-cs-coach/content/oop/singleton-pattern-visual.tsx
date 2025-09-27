import { memo, useMemo, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  Panel,
  type Edge,
  type Node,
  type NodeProps
} from 'reactflow';
import 'reactflow/dist/style.css';

import type { LessonContent } from '../../src/lib/types';
import { cn } from '../../src/lib/utils';

type SingletonPhase =
  | 'introduce-blueprint'
  | 'clients-demand'
  | 'first-request'
  | 'reuse-instance'
  | 'global-accessor'
  | 'thread-guard';

type NodeStatus = 'dim' | 'focus' | 'pulse';
type GuardStatus = NodeStatus | 'hidden';
type EdgeStatus = 'inactive' | 'request' | 'return' | 'guard';

interface SingletonNodeData {
  label: string;
  description?: string;
  status: NodeStatus;
  accent: string;
  prefersReducedMotion: boolean;
}

const basePositions: Record<string, { x: number; y: number }> = {
  'client-a': { x: 0, y: 0 },
  'client-b': { x: 0, y: 150 },
  'client-c': { x: 0, y: 300 },
  accessor: { x: 280, y: 40 },
  singleton: { x: 520, y: 180 },
  guard: { x: 520, y: 340 }
};

const baseEdges: Edge[] = [
  { id: 'client-a-to-accessor', source: 'client-a', target: 'accessor', type: 'smoothstep' },
  { id: 'client-b-to-accessor', source: 'client-b', target: 'accessor', type: 'smoothstep' },
  { id: 'client-c-to-accessor', source: 'client-c', target: 'accessor', type: 'smoothstep' },
  { id: 'accessor-to-singleton', source: 'accessor', target: 'singleton', type: 'smoothstep' },
  { id: 'singleton-to-client-a', source: 'singleton', target: 'client-a', type: 'smoothstep' },
  { id: 'singleton-to-client-b', source: 'singleton', target: 'client-b', type: 'smoothstep' },
  { id: 'singleton-to-client-c', source: 'singleton', target: 'client-c', type: 'smoothstep' },
  { id: 'guard-to-singleton', source: 'guard', target: 'singleton', type: 'smoothstep' }
];

const phaseConfig: Record<
  SingletonPhase,
  {
    nodeStatus: { singleton: NodeStatus; clients: NodeStatus; accessor: NodeStatus; guard: GuardStatus };
    edgeStatus: Partial<Record<string, EdgeStatus>>;
    note: string;
  }
> = {
  'introduce-blueprint': {
    nodeStatus: { singleton: 'pulse', clients: 'dim', accessor: 'dim', guard: 'hidden' },
    edgeStatus: {},
    note: 'Define the unique instance and make construction private so callers cannot create duplicates.'
  },
  'clients-demand': {
    nodeStatus: { singleton: 'dim', clients: 'pulse', accessor: 'focus', guard: 'hidden' },
    edgeStatus: {
      'client-a-to-accessor': 'request',
      'client-b-to-accessor': 'request',
      'client-c-to-accessor': 'request'
    },
    note: 'Multiple services request configuration access through the accessor entry point.'
  },
  'first-request': {
    nodeStatus: { singleton: 'focus', clients: 'focus', accessor: 'pulse', guard: 'hidden' },
    edgeStatus: {
      'client-a-to-accessor': 'request',
      'client-b-to-accessor': 'request',
      'client-c-to-accessor': 'request',
      'accessor-to-singleton': 'request'
    },
    note: 'The first accessor call builds the singleton and caches it for future reuse.'
  },
  'reuse-instance': {
    nodeStatus: { singleton: 'pulse', clients: 'focus', accessor: 'focus', guard: 'hidden' },
    edgeStatus: {
      'client-a-to-accessor': 'request',
      'client-b-to-accessor': 'request',
      'client-c-to-accessor': 'request',
      'accessor-to-singleton': 'request',
      'singleton-to-client-a': 'return',
      'singleton-to-client-b': 'return',
      'singleton-to-client-c': 'return'
    },
    note: 'Every subsequent caller receives the same instance reference instead of creating new objects.'
  },
  'global-accessor': {
    nodeStatus: { singleton: 'focus', clients: 'focus', accessor: 'pulse', guard: 'hidden' },
    edgeStatus: {
      'client-a-to-accessor': 'request',
      'client-b-to-accessor': 'request',
      'client-c-to-accessor': 'request',
      'accessor-to-singleton': 'request',
      'singleton-to-client-a': 'return',
      'singleton-to-client-b': 'return',
      'singleton-to-client-c': 'return'
    },
    note: 'Keep the accessor lightweight and stable so the singleton feels like a global service.'
  },
  'thread-guard': {
    nodeStatus: { singleton: 'focus', clients: 'dim', accessor: 'focus', guard: 'pulse' },
    edgeStatus: {
      'client-a-to-accessor': 'request',
      'client-b-to-accessor': 'request',
      'client-c-to-accessor': 'request',
      'accessor-to-singleton': 'request',
      'singleton-to-client-a': 'return',
      'singleton-to-client-b': 'return',
      'singleton-to-client-c': 'return',
      'guard-to-singleton': 'guard'
    },
    note: 'Add a synchronization guard to protect instance creation when threads race to access it.'
  }
};

const phaseTitles: Record<SingletonPhase, string> = {
  'introduce-blueprint': 'Blueprint the Singleton',
  'clients-demand': 'Clients Request Access',
  'first-request': 'First Request Creates Instance',
  'reuse-instance': 'Reuse the Cached Instance',
  'global-accessor': 'Global Accessor Facade',
  'thread-guard': 'Thread Safety Guard'
};

const edgeStyles: Record<EdgeStatus, { color: string; width: number; dash?: string; animated: boolean }> = {
  inactive: { color: 'rgba(148, 163, 184, 0.6)', width: 1.5, dash: '6 4', animated: false },
  request: { color: '#38bdf8', width: 2.4, animated: true },
  return: { color: '#a855f7', width: 2.4, dash: '2 2', animated: true },
  guard: { color: '#bef264', width: 2.4, dash: '4 2', animated: false }
};

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const SingletonNode = memo(({ data }: NodeProps<SingletonNodeData>) => {
  const { label, description, status, accent, prefersReducedMotion } = data;

  const animate = useMemo(() => {
    if (status === 'pulse' && !prefersReducedMotion) {
      return { scale: [1, 1.05, 1], opacity: 1 };
    }

    if (status === 'focus') {
      return { scale: 1, opacity: 1 };
    }

    return { scale: 0.96, opacity: 0.65 };
  }, [prefersReducedMotion, status]);

  const transition = useMemo(() => {
    if (status === 'pulse' && !prefersReducedMotion) {
      return { duration: 1.6, repeat: Infinity as const, repeatType: 'loop' as const };
    }

    return { duration: 0.3 };
  }, [prefersReducedMotion, status]);

  const style = useMemo(() => {
    const baseBackground = status === 'dim' ? hexToRgba(accent, 0.08) : hexToRgba(accent, 0.18);
    const borderColor = status === 'dim' ? hexToRgba(accent, 0.5) : accent;
    const boxShadow =
      status === 'focus'
        ? `0 0 0 2px ${hexToRgba(accent, 0.2)}`
        : status === 'pulse'
          ? `0 0 0 4px ${hexToRgba(accent, 0.16)}`
          : '0 0 0 1px rgba(15, 23, 42, 0.08)';

    return {
      background: baseBackground,
      borderColor,
      boxShadow
    } satisfies CSSProperties;
  }, [accent, status]);

  const labelColor = status === 'dim' ? 'var(--muted-foreground)' : accent;

  return (
    <motion.div
      initial={{ opacity: 0.9, scale: 0.97 }}
      animate={animate}
      transition={transition}
      className={cn(
        'rounded-xl border px-4 py-3 text-left shadow-sm backdrop-blur-sm transition-all duration-300',
        status === 'dim' && 'opacity-75'
      )}
      style={style}
    >
      <p className="text-sm font-semibold" style={{ color: labelColor }}>
        {label}
      </p>
      {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
    </motion.div>
  );
});
SingletonNode.displayName = 'SingletonNode';

const nodeTypes = { singletonNode: SingletonNode };

interface SingletonFlowSceneProps {
  phase: SingletonPhase;
  prefersReducedMotion?: boolean;
  zoom?: number;
}

function SingletonFlowScene({ phase, prefersReducedMotion = false, zoom = 1 }: SingletonFlowSceneProps) {
  const config = phaseConfig[phase];

  const nodes = useMemo(() => {
    const clients: Node<SingletonNodeData>[] = ['client-a', 'client-b', 'client-c'].map((id, index) => ({
      id,
      type: 'singletonNode',
      position: basePositions[id],
      data: {
        label: `Client ${String.fromCharCode(65 + index)}`,
        description: 'Requests configuration',
        status: config.nodeStatus.clients,
        accent: '#0f766e',
        prefersReducedMotion
      },
      draggable: false
    }));

    const accessor: Node<SingletonNodeData> = {
      id: 'accessor',
      type: 'singletonNode',
      position: basePositions.accessor,
      data: {
        label: 'getInstance()',
        description: 'Controlled entry point',
        status: config.nodeStatus.accessor,
        accent: '#2563eb',
        prefersReducedMotion
      },
      draggable: false
    };

    const singleton: Node<SingletonNodeData> = {
      id: 'singleton',
      type: 'singletonNode',
      position: basePositions.singleton,
      data: {
        label: 'Singleton Instance',
        description: 'Shared state & behavior',
        status: config.nodeStatus.singleton,
        accent: '#4f46e5',
        prefersReducedMotion
      },
      draggable: false
    };

    const guard: Node<SingletonNodeData> | null =
      config.nodeStatus.guard === 'hidden'
        ? null
        : {
            id: 'guard',
            type: 'singletonNode',
            position: basePositions.guard,
            data: {
              label: 'Thread Guard',
              description: 'Locks creation',
              status: config.nodeStatus.guard === 'hidden' ? 'dim' : config.nodeStatus.guard,
              accent: '#bef264',
              prefersReducedMotion
            },
            draggable: false
          };

    return guard ? [...clients, accessor, singleton, guard] : [...clients, accessor, singleton];
  }, [config.nodeStatus.accessor, config.nodeStatus.clients, config.nodeStatus.guard, config.nodeStatus.singleton, prefersReducedMotion]);

  const edges = useMemo(() => {
    const nodeIds = new Set(nodes.map((node) => node.id));

    return baseEdges
      .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
      .map((edge) => {
        const status = config.edgeStatus[edge.id] ?? 'inactive';
        const palette = edgeStyles[status];
        const strokeDasharray = palette.dash ?? undefined;

        return {
          ...edge,
          animated: palette.animated && !prefersReducedMotion,
          style: {
            stroke: palette.color,
            strokeWidth: palette.width,
            strokeDasharray
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: palette.color,
            width: 20,
            height: 20
          }
        } satisfies Edge;
      });
  }, [config.edgeStatus, nodes, prefersReducedMotion]);

  return (
    <motion.div
      className="h-full w-full"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: prefersReducedMotion ? 0.2 : 0.45 }}
    >
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        minZoom={0.6}
        maxZoom={1.6}
        defaultViewport={{ x: 0, y: 0, zoom }}
        panOnScroll={false}
        panOnDrag
        zoomOnScroll={false}
        zoomOnPinch={false}
        proOptions={{ hideAttribution: true }}
        className="bg-transparent"
        aria-label={`Singleton flow diagram phase: ${phaseTitles[phase]}`}
      >
        <Background gap={24} size={1} color="rgba(148, 163, 184, 0.25)" />
        <MiniMap pannable zoomable className="!bg-background/80" />
        <Controls showInteractive={false} />
        <Panel position="top-right" className="max-w-xs rounded-lg border border-border bg-background/85 p-3 text-xs shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{phaseTitles[phase]}</p>
          <p className="mt-2 leading-relaxed text-muted-foreground">{config.note}</p>
        </Panel>
      </ReactFlow>
    </motion.div>
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
      render: ({ prefersReducedMotion, zoom = 1 }) => (
        <SingletonFlowScene phase="introduce-blueprint" prefersReducedMotion={prefersReducedMotion} zoom={zoom} />
      ),
      code: 'class ConfigRegistry {\n  private static instance: ConfigRegistry;\n  private constructor() {}\n  static getInstance() {\n    if (!ConfigRegistry.instance) {\n      ConfigRegistry.instance = new ConfigRegistry();\n    }\n    return ConfigRegistry.instance;\n  }\n}'
    },
    {
      id: 'clients-request',
      label: 'Clients queue up',
      description: 'Multiple consumers ask for configuration, hinting at potential duplication.',
      durationMs: 4800,
      motion: {},
      render: ({ prefersReducedMotion, zoom = 1 }) => (
        <SingletonFlowScene phase="clients-demand" prefersReducedMotion={prefersReducedMotion} zoom={zoom} />
      ),
      code: '// Services all request configuration access\nconst a = ConfigRegistry.getInstance();\nconst b = ConfigRegistry.getInstance();'
    },
    {
      id: 'first-access',
      label: 'First accessor creates it',
      description: 'The first request builds the instance through the accessor.',
      durationMs: 5200,
      motion: {},
      render: ({ prefersReducedMotion, zoom = 1 }) => (
        <SingletonFlowScene phase="first-request" prefersReducedMotion={prefersReducedMotion} zoom={zoom} />
      ),
      code: 'if (!instance) {\n  instance = new ConfigRegistry();\n}'
    },
    {
      id: 'reuse-instance',
      label: 'Everyone reuses the same instance',
      description: 'Subsequent calls return the cached singleton instead of constructing anew.',
      durationMs: 5200,
      motion: {},
      render: ({ prefersReducedMotion, zoom = 1 }) => (
        <SingletonFlowScene phase="reuse-instance" prefersReducedMotion={prefersReducedMotion} zoom={zoom} />
      ),
      code: 'return ConfigRegistry.instance; // same reference for all callers'
    },
    {
      id: 'global-access',
      label: 'Global accessor stays lightweight',
      description: 'The getInstance facade exposes a simple entry point while hiding creation details.',
      durationMs: 5000,
      motion: {},
      render: ({ prefersReducedMotion, zoom = 1 }) => (
        <SingletonFlowScene phase="global-accessor" prefersReducedMotion={prefersReducedMotion} zoom={zoom} />
      ),
      code: 'export const registry = Object.freeze({ get: (key) => ConfigRegistry.getInstance().get(key) });'
    },
    {
      id: 'thread-guard',
      label: 'Guard against races',
      description: 'Introduce a synchronization boundary to keep the singleton safe in concurrent scenarios.',
      durationMs: 5200,
      motion: {},
      render: ({ prefersReducedMotion, zoom = 1 }) => (
        <SingletonFlowScene phase="thread-guard" prefersReducedMotion={prefersReducedMotion} zoom={zoom} />
      ),
      code: 'static getInstance() {\n  if (!ConfigRegistry.instance) {\n    synchronized(ConfigRegistry) {\n      if (!ConfigRegistry.instance) {\n        ConfigRegistry.instance = new ConfigRegistry();\n      }\n    }\n  }\n  return ConfigRegistry.instance;\n}'
    }
  ]
};

export default content;
