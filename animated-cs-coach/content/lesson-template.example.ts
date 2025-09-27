// Duplicate this file when creating a new lesson.
import type { LessonContent } from '../src/lib/types';

const lesson: LessonContent = {
  meta: {
    id: 'slug-here',
    slug: 'slug-here',
    title: 'Readable Lesson Title',
    trackId: 'dsa', // dsa | system-design | oop
    durationMs: 180000, // Estimated total playback time in milliseconds
    level: 'Beginner', // Beginner | Intermediate | Advanced
    summary: 'One sentence summary used on cards and SEO.'
  },
  steps: [
    {
      id: 'unique-step-id',
      label: 'Step headline',
      description: 'Concise description displayed beside the player.',
      durationMs: 4000,
      motion: {
        // Any Framer Motion props accepted by <motion.svg> / <motion.div>
        initial: { opacity: 0 },
        animate: { opacity: 1 }
      },
      code: '// Optional: code or pseudo code snippet rendered in the Code tab.'
    }
  ],
  resources: [
    // Optional: attach external references for learners.
    // { title: 'Deep dive article', url: 'https://example.com' }
  ]
};

export default lesson;
