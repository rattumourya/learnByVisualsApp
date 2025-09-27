import type { LessonMeta, TrackMeta } from './types';

export const tracks: TrackMeta[] = [
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Animated walkthroughs of core data structures and algorithm strategies.',
    slug: 'dsa',
    accent: 'from-emerald-500/80 to-teal-500/80'
  },
  {
    id: 'system-design',
    title: 'System Design & Patterns',
    description: 'Scalable architectures, patterns, and trade-offs visualized.',
    slug: 'system-design',
    accent: 'from-sky-500/80 to-blue-500/80'
  },
  {
    id: 'oop',
    title: 'OOP Concepts',
    description: 'Object-oriented principles illustrated with real-world analogies.',
    slug: 'oop',
    accent: 'from-purple-500/80 to-pink-500/80'
  }
];

export const lessonsByTrack: Record<string, LessonMeta[]> = {
  dsa: [
    {
      id: 'linked-list-intro',
      slug: 'linked-list-intro',
      title: 'Linked List Fundamentals',
      trackId: 'dsa',
      durationMs: 180000,
      level: 'Beginner',
      summary: 'Understand the structure and operations of singly linked lists with animations.'
    }
  ],
  'system-design': [
    {
      id: 'load-balancer-basics',
      slug: 'load-balancer-basics',
      title: 'Load Balancer Basics',
      trackId: 'system-design',
      durationMs: 210000,
      level: 'Intermediate',
      summary: 'See how requests are routed and distributed across servers.'
    }
  ],
  oop: [
    {
      id: 'singleton-pattern-visual',
      slug: 'singleton-pattern-visual',
      title: 'Singleton Design Pattern Visualized',
      trackId: 'oop',
      durationMs: 210000,
      level: 'Intermediate',
      summary: 'Watch how a singleton broker orchestrates shared state across many clients.'
    },
    {
      id: 'solid-single-responsibility',
      slug: 'solid-single-responsibility',
      title: 'SOLID: Single Responsibility Principle',
      trackId: 'oop',
      durationMs: 195000,
      level: 'Intermediate',
      summary: 'Explore SRP with animated class responsibilities and refactors.'
    }
  ]
};

export function getTrackBySlug(slug: string) {
  return tracks.find((track) => track.slug === slug);
}

export function getLessonMeta(trackSlug: string, lessonSlug: string) {
  return lessonsByTrack[trackSlug]?.find((lesson) => lesson.slug === lessonSlug);
}
