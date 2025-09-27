import { Link, NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState } from 'react';

import { tracks } from '../lib/tracks';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../lib/utils';

export function AppHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="text-lg font-semibold">
            Animated CS Coach
          </Link>
        </div>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {tracks.map((track) => (
            <NavLink
              key={track.id}
              to={`/tracks/${track.slug}`}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition hover:text-primary',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )
              }
            >
              {track.title}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" className="md:hidden" aria-label="Mobile">
          <ul className="space-y-2 border-t border-border bg-card p-4">
            {tracks.map((track) => (
              <li key={track.id}>
                <NavLink
                  to={`/tracks/${track.slug}`}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-md px-3 py-2 text-sm font-medium',
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent',
                    )
                  }
                  onClick={() => setOpen(false)}
                >
                  {track.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
