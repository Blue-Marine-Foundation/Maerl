'use client';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { fetchOutputById } from '@/components/logframe/server-actions';
import OutputCard from '@/components/logframe/output-card';

function OutputContent() {
  const searchParams = useSearchParams();
  const outputId = searchParams.get('id');

  const { data: outputData, isLoading } = useQuery({
    queryKey: ['output', outputId],
    queryFn: () => fetchOutputById(outputId as string),
  });

  if (isLoading) {
    return <div>Loading output with database id: {outputId}</div>;
  }

  if (!outputData) {
    return (
      <div>
        Apologies, output with database id: {outputId} was not found, please
        notify the SII team.
      </div>
    );
  }

  return <OutputCard output={outputData} />;
}

export default function LogframeOutputPage() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <OutputContent />
    </QueryClientProvider>
  );
}
