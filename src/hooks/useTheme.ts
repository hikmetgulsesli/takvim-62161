import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'dark' | 'light';

export function useTheme(): [boolean, () => void] {
  const [theme, setTheme] = useLocalStorage<Theme>('takvim-theme', 'dark');
  const isDark = theme === 'dark';

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return [isDark, toggleTheme];
}
