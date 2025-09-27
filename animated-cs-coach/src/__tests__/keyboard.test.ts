import { describe, expect, it } from 'vitest';

import { mapKeyToPlayerAction } from '../lib/keyboard';

describe('mapKeyToPlayerAction', () => {
  it('maps arrow keys to navigation', () => {
    expect(mapKeyToPlayerAction('ArrowRight')).toBe('next');
    expect(mapKeyToPlayerAction('ArrowLeft')).toBe('previous');
  });

  it('maps space to toggle', () => {
    expect(mapKeyToPlayerAction(' ')).toBe('toggle');
  });

  it('maps r to restart', () => {
    expect(mapKeyToPlayerAction('r')).toBe('restart');
    expect(mapKeyToPlayerAction('R')).toBe('restart');
  });

  it('maps +/- to speed adjustments', () => {
    expect(mapKeyToPlayerAction('+')).toEqual({ type: 'speed', delta: 0.25 });
    expect(mapKeyToPlayerAction('-')).toEqual({ type: 'speed', delta: -0.25 });
  });

  it('returns null for unknown keys', () => {
    expect(mapKeyToPlayerAction('a')).toBeNull();
  });
});
