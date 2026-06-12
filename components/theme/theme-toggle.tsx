'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from 'lucide-react';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type='button'
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className='flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-accent'
    >
      {mounted ? (
        isDark ? (
          <SunIcon className='h-4 w-4' />
        ) : (
          <MoonIcon className='h-4 w-4' />
        )
      ) : (
        <MoonIcon className='h-4 w-4 opacity-0' />
      )}
    </button>
  );
}
