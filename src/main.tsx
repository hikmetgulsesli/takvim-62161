import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CalendarProvider } from './context/CalendarContext.tsx'

// Apply saved theme before React renders to prevent flash
(function applyInitialTheme() {
  try {
    const saved = localStorage.getItem('takvim-theme');
    const theme = saved ? JSON.parse(saved) : 'dark';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch {
    document.documentElement.classList.add('dark');
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CalendarProvider>
      <App />
    </CalendarProvider>
  </StrictMode>,
)