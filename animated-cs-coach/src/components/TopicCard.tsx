import { Link } from 'react-router-dom';

import type { TrackMeta } from '../lib/types';
import { cn } from '../lib/utils';

interface TopicCardProps {
  track: TrackMeta;
}

export function TopicCard({ track }: TopicCardProps) {
  return (
    <Link
      to={`/tracks/${track.slug}`}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
    >
      <div className={cn('absolute inset-0 opacity-60 blur-xl transition group-hover:opacity-90', `bg-gradient-to-br ${track.accent}`)} />
      <div className="relative flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Track</span>
        <h3 className="text-lg font-semibold">{track.title}</h3>
        <p className="text-sm text-muted-foreground">{track.description}</p>
      </div>
    </Link>
  );
}
