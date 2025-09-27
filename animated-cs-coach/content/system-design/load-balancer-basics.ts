import type { LessonContent } from '../../src/lib/types';

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
      label: 'Client requests',
      description: 'Clients appear sending requests to the edge.',
      durationMs: 4000,
      motion: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      },
      code: '// Clients send HTTP requests'
    },
    {
      id: 'lb-highlight',
      label: 'Load balancer',
      description: 'Highlight the load balancer distributing traffic.',
      durationMs: 4500,
      motion: {
        initial: { scale: 1 },
        animate: { scale: [1, 1.05, 1], transition: { repeat: 2, duration: 1 } }
      },
      code: 'const server = pickServer(request);'
    },
    {
      id: 'routing',
      label: 'Routing',
      description: 'Arrows animate from load balancer to servers.',
      durationMs: 5000,
      motion: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.4 }
      },
      code: 'forward(request, server);'
    },
    {
      id: 'health-checks',
      label: 'Health checks',
      description: 'Pulse indicates health checks ensuring availability.',
      durationMs: 5000,
      motion: {
        initial: { opacity: 0.6 },
        animate: { opacity: [0.6, 1, 0.6], transition: { repeat: 2, duration: 1.5 } }
      },
      code: 'if (!server.healthy) rotateOut(server);'
    },
    {
      id: 'scale-out',
      label: 'Scale out',
      description: 'New server fades in to show scaling horizontally.',
      durationMs: 4500,
      motion: {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6 }
      },
      code: 'cluster.add(newServer);'
    }
  ]
};

export default content;
