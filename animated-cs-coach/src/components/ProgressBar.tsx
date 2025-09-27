import { useMemo } from 'react';

import { formatDuration } from '../lib/utils';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';

interface ProgressBarProps {
  value: number;
  elapsed: number;
  totalDuration: number;
  onSeek: (position: number) => void;
}

export function ProgressBar({ value, elapsed, totalDuration, onSeek }: ProgressBarProps) {
  const label = useMemo(
    () => `${formatDuration(elapsed)} / ${formatDuration(totalDuration)}`,
    [elapsed, totalDuration],
  );

  return (
    <div className="flex flex-col gap-2">
      <Slider
        aria-label="Seek lesson"
        value={[Number.isFinite(value) ? value : 0]}
        max={100}
        step={0.5}
        onValueChange={([next]) => onSeek((next / 100) * totalDuration)}
        onValueCommit={([next]) => onSeek((next / 100) * totalDuration)}
      />
      <Progress value={Number.isFinite(value) ? value : 0} className="h-1" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
    </div>
  );
}
