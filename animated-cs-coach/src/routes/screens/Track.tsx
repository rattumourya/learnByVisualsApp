import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LessonCard } from '../../components/LessonCard';
import { getTrackBySlug, lessonsByTrack } from '../../lib/tracks';

export function Track() {
  const { trackSlug } = useParams();
  const navigate = useNavigate();
  const track = useMemo(() => (trackSlug ? getTrackBySlug(trackSlug) : undefined), [trackSlug]);

  if (!track) {
    navigate('/');
    return null;
  }

  const lessons = lessonsByTrack[track.slug] ?? [];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: track.title }]} />
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">{track.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{track.description}</p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </section>
    </div>
  );
}

export default Track;
