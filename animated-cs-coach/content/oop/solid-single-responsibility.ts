import type { LessonContent } from '../../src/lib/types';

const content: LessonContent = {
  meta: {
    id: 'solid-single-responsibility',
    slug: 'solid-single-responsibility',
    title: 'SOLID: Single Responsibility Principle',
    trackId: 'oop',
    durationMs: 195000,
    level: 'Intermediate',
    summary: 'See how separating responsibilities improves maintainability.'
  },
  steps: [
    {
      id: 'problem-card',
      label: 'Monolithic class',
      description: 'A single card appears containing too many duties.',
      durationMs: 4000,
      motion: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
      },
      code: 'class ReportService { /* handles fetch + render + email */ }'
    },
    {
      id: 'stress-highlight',
      label: 'Pain points',
      description: 'The card shakes to show the maintenance burden.',
      durationMs: 4500,
      motion: {
        initial: { rotate: 0 },
        animate: { rotate: [-2, 2, -2, 2, 0], transition: { duration: 1.2 } }
      },
      code: '// hard to change without breaking everything'
    },
    {
      id: 'split-cards',
      label: 'Split responsibilities',
      description: 'Cards slide apart into fetch, render, and email services.',
      durationMs: 5500,
      motion: {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.6 }
      },
      code: 'class ReportFetcher {}\nclass ReportRenderer {}\nclass ReportEmailer {}'
    },
    {
      id: 'collaboration',
      label: 'Collaborate',
      description: 'Arrows show the small classes collaborating.',
      durationMs: 5000,
      motion: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.6 }
      },
      code: 'new ReportCoordinator(new ReportFetcher(), new ReportRenderer(), new ReportEmailer());'
    },
    {
      id: 'benefit',
      label: 'Benefits',
      description: 'Each card pulses subtly to highlight clarity.',
      durationMs: 4500,
      motion: {
        initial: { scale: 1 },
        animate: { scale: [1, 1.05, 1], transition: { repeat: 2, repeatType: 'reverse', duration: 1.2 } }
      },
      code: '// easier to test and change'
    }
  ]
};

export default content;
