export type PlayerAction =
  | 'next'
  | 'previous'
  | 'toggle'
  | 'restart'
  | { type: 'speed'; delta: number }
  | null;

export function mapKeyToPlayerAction(key: string): PlayerAction {
  switch (key) {
    case 'ArrowRight':
      return 'next';
    case 'ArrowLeft':
      return 'previous';
    case ' ':
    case 'Spacebar':
      return 'toggle';
    case 'r':
    case 'R':
      return 'restart';
    case '+':
    case '=':
      return { type: 'speed', delta: 0.25 };
    case '-':
    case '_':
      return { type: 'speed', delta: -0.25 };
    default:
      return null;
  }
}
