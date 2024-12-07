'use client';

import TheoryOfChange from '@/components/logframe/theory-of-change';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function TheoryOfChangePage() {
  const { slug } = useParams();
  const queryClient = new QueryClient();

  return (
    <div className='flex flex-col gap-4'>
      <QueryClientProvider client={queryClient}>
        <TheoryOfChange slug={slug as string} />
      </QueryClientProvider>
    </div>
  );
}
