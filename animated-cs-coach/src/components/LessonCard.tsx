import { Link } from 'react-router-dom';

import type { LessonMeta } from '../lib/types';
import { formatDuration } from '../lib/utils';

interface LessonCardProps {
  lesson: LessonMeta;
}

export function LessonCard({ lesson }: LessonCardProps) {
  return (
    <Link
      to={`/tracks/${lesson.trackId}/${lesson.slug}`}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{lesson.level}</span>
        <span>{formatDuration(lesson.durationMs)}</span>
      </div>
      <h3 className="text-lg font-semibold text-foreground">{lesson.title}</h3>
      <p className="text-sm text-muted-foreground">{lesson.summary}</p>
    </Link>
  );
}
