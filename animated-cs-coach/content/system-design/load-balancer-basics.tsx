import { useMemo } from 'react';
import { motion } from 'framer-motion';

import type { LessonContent } from '../../src/lib/types';

type LoadBalancerPhase =
  | 'clients-request'
  | 'highlight-balancer'
  | 'routing'
  | 'health-checks'
  | 'scale-out';

interface LoadBalancerSceneProps {
  phase: LoadBalancerPhase;
  prefersReducedMotion?: boolean;
}

const phaseConfig: Record<LoadBalancerPhase, {
  clients: 'dim' | 'focus' | 'pulse';
  balancer: 'dim' | 'focus' | 'pulse';
  servers: Array<'dim' | 'focus' | 'pulse'>;
  arrows: number;
  health: number;
  newServer: boolean;
}> = {
  'clients-request': {
    clients: 'pulse',
    balancer: 'dim',
    servers: ['dim', 'dim', 'dim'],
    arrows: 0,
    health: 0,
    newServer: false
  },
  'highlight-balancer': {
    clients: 'focus',
    balancer: 'pulse',
    servers: ['dim', 'dim', 'dim'],
    arrows: 0.25,
    health: 0,
    newServer: false
  },
  routing: {
    clients: 'focus',
    balancer: 'focus',
    servers: ['pulse', 'pulse', 'pulse'],
    arrows: 1,
    health: 0.2,
    newServer: false
  },
  'health-checks': {
    clients: 'dim',
    balancer: 'focus',
    servers: ['pulse', 'focus', 'pulse'],
    arrows: 1,
    health: 1,
    newServer: false
  },
  'scale-out': {
    clients: 'focus',
    balancer: 'focus',
    servers: ['focus', 'focus', 'focus'],
    arrows: 1,
    health: 0.6,
    newServer: true
  }
};

const pulseTransition = (prefersReducedMotion?: boolean) =>
  prefersReducedMotion
    ? { duration: 0.2 }
    : { duration: 1.6, repeat: Infinity as const, repeatType: 'loop' as const };

function getHighlightStyles(prefersReducedMotion?: boolean) {
  const transition = { duration: prefersReducedMotion ? 0.2 : 0.5 };
  return {
    dim: { opacity: 0.35, scale: 1, transition },
    focus: { opacity: 1, scale: 1, transition },
    pulse: {
      opacity: 1,
      scale: prefersReducedMotion ? 1 : [1, 1.05, 1],
      transition: pulseTransition(prefersReducedMotion)
    }
  } as const;
}

function LoadBalancerScene({ phase, prefersReducedMotion }: LoadBalancerSceneProps) {
  const highlights = useMemo(() => getHighlightStyles(prefersReducedMotion), [prefersReducedMotion]);
  const config = phaseConfig[phase];

  const transition = prefersReducedMotion ? { duration: 0.2 } : { duration: 0.5 };

  const serverPositions = [60, 120, 180];

  return (
    <motion.svg
      viewBox="0 0 360 240"
      className="h-full w-full"
      role="presentation"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={transition}
    >
      <defs>
        <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />
        </pattern>
        <linearGradient id="lbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="360" height="240" rx="24" fill="url(#grid)" opacity={0.65} />

      <motion.g animate={highlights[config.clients]} style={{ transformOrigin: '60px 120px' }}>
        {[36, 116, 196].map((y, index) => (
          <g key={`client-${index}`}>
            <rect
              x={24}
              y={y}
              width={110}
              height={48}
              rx={12}
              fill="rgba(34, 197, 94, 0.18)"
              stroke="rgba(16, 185, 129, 0.6)"
            />
            <text x={40} y={y + 22} className="fill-current text-sm font-semibold">
              Client {index + 1}
            </text>
            <text x={40} y={y + 38} className="fill-current text-xs opacity-70">
              HTTP request
            </text>
          </g>
        ))}
      </motion.g>

      <motion.g animate={highlights[config.balancer]} style={{ transformOrigin: '180px 120px' }}>
        <rect x={150} y={96} width={60} height={48} rx={12} fill="url(#lbGradient)" opacity={0.95} />
        <text x={180} y={122} textAnchor="middle" className="fill-white text-sm font-semibold">
          Load
        </text>
        <text x={180} y={136} textAnchor="middle" className="fill-white text-xs tracking-wide">
          Balancer
        </text>
      </motion.g>

      {serverPositions.map((y, index) => (
        <motion.g key={`server-${index}`} animate={highlights[config.servers[index]]} style={{ transformOrigin: '292px 80px' }}>
          <rect
            x={260}
            y={y - 24}
            width={80}
            height={44}
            rx={10}
            fill="rgba(96, 165, 250, 0.16)"
            stroke="rgba(59, 130, 246, 0.6)"
          />
          <text x={300} y={y - 6} textAnchor="middle" className="fill-current text-sm font-semibold">
            Server {index + 1}
          </text>
          <text x={300} y={y + 10} textAnchor="middle" className="fill-current text-xs opacity-70">
            healthy
          </text>
        </motion.g>
      ))}

      {config.newServer ? (
        <motion.g
          style={{ transformOrigin: '300px 224px' }}
          initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 20 }}
          animate={{
            opacity: highlights.focus.opacity,
            scale: highlights.focus.scale,
            x: 0
          }}
          transition={highlights.focus.transition}
        >
          <rect
            x={260}
            y={204}
            width={80}
            height={44}
            rx={10}
            fill="rgba(251, 191, 36, 0.2)"
            stroke="rgba(245, 158, 11, 0.7)"
          />
          <text x={300} y={228} textAnchor="middle" className="fill-current text-sm font-semibold">
            Server 4
          </text>
          <text x={300} y={244} textAnchor="middle" className="fill-current text-xs opacity-70">
            scaled
          </text>
        </motion.g>
      ) : null}

      {[36, 116, 196].map((y, index) => (
        <motion.path
          key={`arrow-${index}`}
          d={`M 134 ${y + 24} C 150 ${y + 18}, 158 120, 150 130`}
          stroke="rgba(59, 130, 246, 0.85)"
          strokeWidth={3}
          fill="none"
          strokeDasharray="6 6"
          animate={{ opacity: config.arrows }}
          transition={transition}
        />
      ))}

      {serverPositions.map((y, index) => (
        <motion.path
          key={`arrow-lb-${index}`}
          d={`M 210 120 C 232 ${120 + (index - 1) * 40}, 240 ${y}, 252 ${y}`}
          stroke="rgba(14, 116, 144, 0.85)"
          strokeWidth={3}
          fill="none"
          markerEnd="url(#arrowhead)"
          strokeDasharray="8 6"
          animate={{ opacity: config.arrows }}
          transition={transition}
        />
      ))}

      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="4"
          orient="auto"
          fill="rgba(14, 116, 144, 0.85)"
        >
          <polygon points="0 0, 8 4, 0 8" />
        </marker>
      </defs>

      <motion.circle
        cx={180}
        cy={120}
        r={68}
        stroke="rgba(248, 250, 252, 0.2)"
        strokeWidth={2}
        fill="none"
        animate={{ opacity: config.health }}
        transition={prefersReducedMotion ? { duration: 0.2 } : { duration: 1, repeat: Infinity, repeatType: 'mirror' }}
      />

      <motion.circle
        cx={300}
        cy={60}
        r={18}
        stroke="rgba(34, 197, 94, 0.5)"
        strokeWidth={3}
        fill="none"
        animate={{ opacity: config.health }}
        transition={prefersReducedMotion ? { duration: 0.2 } : { duration: 1.2, repeat: Infinity, repeatType: 'mirror' }}
      />

      <text x={24} y={28} className="fill-current text-xs uppercase tracking-wide opacity-60">
        Traffic flow
      </text>
      <text x={180} y={220} textAnchor="middle" className="fill-current text-xs opacity-70">
        Diagram: clients ⇢ balancer ⇢ servers
      </text>
    </motion.svg>
  );
}

const content: LessonContent = {
  meta: {
    id: 'load-balancer-basics',
    slug: 'load-balancer-basics',
    title: 'Load Balancer Basics',
    trackId: 'system-design',
    durationMs: 210000,
    level: 'Intermediate',
    summary: 'Visualize how requests flow through a simple load balancer setup.'
  },
  steps: [
    {
      id: 'client-requests',
      label: 'Clients send traffic',
      description: 'Multiple clients fire requests toward the entry point.',
      durationMs: 4200,
      motion: {},
      render: ({ prefersReducedMotion }) => (
        <LoadBalancerScene phase="clients-request" prefersReducedMotion={prefersReducedMotion} />
      ),
      code: '// Clients send HTTP requests\nPOST /api/orders\nGET /api/catalog'
    },
    {
      id: 'lb-highlight',
      label: 'Load balancer coordinates',
      description: 'Showcase the balancer distributing work evenly.',
      durationMs: 4500,
      motion: {},
      render: ({ prefersReducedMotion }) => (
        <LoadBalancerScene phase="highlight-balancer" prefersReducedMotion={prefersReducedMotion} />
      ),
      code: 'const target = pickServer(request);'
    },
    {
      id: 'routing',
      label: 'Routing to servers',
      description: 'Animate traffic flowing across instances.',
      durationMs: 5200,
      motion: {},
      render: ({ prefersReducedMotion }) => (
        <LoadBalancerScene phase="routing" prefersReducedMotion={prefersReducedMotion} />
      ),
      code: 'forward(request, target)'
    },
    {
      id: 'health-checks',
      label: 'Health checks',
      description: 'Keep monitoring signals around the balancer.',
      durationMs: 5200,
      motion: {},
      render: ({ prefersReducedMotion }) => (
        <LoadBalancerScene phase="health-checks" prefersReducedMotion={prefersReducedMotion} />
      ),
      code: 'if (!target.healthy) rotateOut(target);'
    },
    {
      id: 'scale-out',
      label: 'Scale horizontally',
      description: 'A new server fades in to absorb more load.',
      durationMs: 5000,
      motion: {},
      render: ({ prefersReducedMotion }) => (
        <LoadBalancerScene phase="scale-out" prefersReducedMotion={prefersReducedMotion} />
      ),
      code: 'cluster.add(new ServerInstance());'
    }
  ]
};

export default content;

