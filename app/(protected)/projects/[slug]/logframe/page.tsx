'use client';

import TheoryOfChange from '@/components/logframe/theory-of-change';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function Logframe() {
  const { slug } = useParams();
  const queryClient = new QueryClient();

  return (
    <div className='flex flex-col gap-4 rounded-lg border border-dashed p-4'>
      <h3 className='mb-auto text-sm font-semibold text-muted-foreground'>
        Logframe
      </h3>

      <QueryClientProvider client={queryClient}>
        <TheoryOfChange slug={slug as string} />
      </QueryClientProvider>
    </div>
  );
}
