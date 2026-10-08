import { Menu, Sun, Moon, Bell, Search } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useEffect, useState } from 'react';

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { theme, setTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <button onClick={onMenuClick} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden items-center gap-2 text-sm text-slate-500 md:flex">
        <span>{time.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
        <span className="text-slate-300">|</span>
        <span className="font-mono">{time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Search className="h-5 w-5 text-slate-500" />
        </button>
        <button className="relative rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell className="h-5 w-5 text-slate-500" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <button onClick={toggleTheme} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          {theme === 'dark' ? <Sun className="h-5 w-5 text-slate-500" /> : <Moon className="h-5 w-5 text-slate-500" />}
        </button>
        <div className="ml-2 hidden items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-700 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">
            {user?.name?.charAt(0)}
          </div>
          <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
        </div>
      </div>
    </header>
  );
}
