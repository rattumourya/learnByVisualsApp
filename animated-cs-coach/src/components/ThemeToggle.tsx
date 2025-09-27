import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../hooks/useTheme';
import { VisuallyHidden } from './ui/visually-hidden';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Activate ${theme === 'dark' ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
    >
      <VisuallyHidden>{theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}</VisuallyHidden>
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
