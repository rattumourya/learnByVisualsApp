import { Minus, Plus, RotateCcw } from 'lucide-react';

import { cn } from '../lib/utils';
import { Slider } from './ui/slider';
import { Button } from './ui/button';

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (value: number) => void;
  onReset?: () => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const DEFAULT_MIN = 0.75;
const DEFAULT_MAX = 1.5;
const DEFAULT_STEP = 0.05;

export function ZoomControls({
  zoom,
  onZoomChange,
  onReset,
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  step = DEFAULT_STEP,
  className
}: ZoomControlsProps) {
  const clampZoom = (value: number) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : 1));

  const handleAdjust = (delta: number) => {
    const next = clampZoom(zoom + delta);
    onZoomChange(Number(next.toFixed(2)));
  };

  const sliderMin = Math.round(min * 100);
  const sliderMax = Math.round(max * 100);
  const sliderValue = Math.round(clampZoom(zoom) * 100);

  return (
    <div className={cn('flex w-full flex-col gap-2', className)} role="group" aria-label="Zoom controls">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Zoom</span>
        <span>{sliderValue}%</span>
      </div>
      <div className="flex flex-1 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => handleAdjust(-step)}
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Slider
          aria-label="Animation zoom"
          value={[sliderValue]}
          min={sliderMin}
          max={sliderMax}
          step={Math.round(step * 100)}
          onValueChange={([value]) => {
            const percent = clampZoom((value ?? sliderValue) / 100);
            onZoomChange(Number(percent.toFixed(2)));
          }}
          onValueCommit={([value]) => {
            const percent = clampZoom((value ?? sliderValue) / 100);
            onZoomChange(Number(percent.toFixed(2)));
          }}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => handleAdjust(step)}
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            const baseline = 1;
            onZoomChange(baseline);
            onReset?.();
          }}
          aria-label="Reset zoom"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default ZoomControls;
