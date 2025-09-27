import { Pause, Play, Redo2, StepBack, StepForward } from 'lucide-react';

import { Button } from './ui/button';
import { usePlayerStore } from '../store/playerStore';

interface TransportControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRestart: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
}

export function TransportControls({
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onRestart,
  canGoPrevious = true,
  canGoNext = true
}: TransportControlsProps) {
  const status = usePlayerStore((state) => state.status);

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Playback controls">
      <Button variant="outline" size="sm" onClick={onPrevious} aria-label="Previous step" disabled={!canGoPrevious}>
        <StepBack className="h-4 w-4" />
      </Button>
      {status === 'playing' ? (
        <Button variant="default" size="sm" onClick={onPause} aria-label="Pause">
          <Pause className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="default" size="sm" onClick={onPlay} aria-label="Play">
          <Play className="h-4 w-4" />
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={onNext} aria-label="Next step" disabled={!canGoNext}>
        <StepForward className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onRestart} aria-label="Restart">
        <Redo2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
