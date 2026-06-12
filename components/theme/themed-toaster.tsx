'use client';

import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

export default function ThemedToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster richColors theme={resolvedTheme === 'dark' ? 'dark' : 'light'} />
  );
}
