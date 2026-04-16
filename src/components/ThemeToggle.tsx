import type { Theme } from '../hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="material-symbols-outlined cursor-pointer hover:bg-surface-container-high p-2 rounded-full transition-colors"
      aria-label="Tema değiştir"
      title="Tema değiştir"
      type="button"
    >
      {theme === 'dark' ? 'light_mode' : 'dark_mode'}
    </button>
  );
}
