import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [isDark, toggleTheme] = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`material-symbols-outlined cursor-pointer hover:bg-surface-container-high p-2 rounded-full transition-colors ${className}`}
      aria-label="Tema değiştir"
      title="Tema değiştir"
    >
      {isDark ? 'light_mode' : 'dark_mode'}
    </button>
  );
}
