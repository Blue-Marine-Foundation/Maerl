'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LogframeContent from '@/components/logframe/logframe-content';

export default function LogframePage() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <LogframeContent />
    </QueryClientProvider>
  );
}
