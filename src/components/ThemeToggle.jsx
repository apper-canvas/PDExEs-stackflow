import React from 'react';
import { useTheme } from '../contexts/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
}