import { NavLink, useLocation } from 'react-router-dom';

import { lessonsByTrack, tracks } from '../lib/tracks';
import { cn } from '../lib/utils';

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="top-20 z-20 flex shrink-0 flex-col gap-4 rounded-xl border border-border bg-card/60 p-4 shadow-sm md:sticky md:h-[calc(100vh-6rem)] md:w-64">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Tracks</h2>
      <nav className="space-y-3">
        {tracks.map((track) => {
          const active = location.pathname.includes(`/tracks/${track.slug}`);
          return (
            <div key={track.id}>
              <NavLink
                to={`/tracks/${track.slug}`}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between rounded-lg border px-3 py-2 text-sm font-medium transition',
                    isActive || active ? 'border-primary bg-primary/10 text-primary' : 'border-transparent hover:bg-accent',
                  )
                }
              >
                {track.title}
              </NavLink>
              <ul className="mt-2 space-y-1 pl-4">
                {lessonsByTrack[track.slug]?.map((lesson) => (
                  <li key={lesson.id}>
                    <NavLink
                      to={`/tracks/${track.slug}/${lesson.slug}`}
                      className={({ isActive }) =>
                        cn(
                          'block rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-primary',
                          isActive ? 'bg-primary/10 text-primary' : null,
                        )
                      }
                    >
                      {lesson.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
