import { Button } from './ui/button';

interface SpeedSelectProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const speeds = [0.5, 1, 1.5, 2];

export function SpeedSelect({ speed, onSpeedChange }: SpeedSelectProps) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Playback speed">
      {speeds.map((value) => (
        <Button
          key={value}
          variant={speed === value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSpeedChange(value)}
          aria-pressed={speed === value}
        >
          {value}x
        </Button>
      ))}
    </div>
  );
}
