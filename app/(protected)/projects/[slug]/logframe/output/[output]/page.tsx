'use client';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchOutputByCode } from '@/components/logframe/server-actions';
import FeatureCard from '@/components/ui/feature-card';
import { OutputMeasurable } from '@/utils/types';
import OutputCard from '@/components/logframe/output-card';

function OutputContent() {
  const { output, slug } = useParams();

  const { data: outputData, isLoading } = useQuery({
    queryKey: ['output', output, slug],
    queryFn: () => fetchOutputByCode(output as string, slug as string),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!outputData) {
    return <div>Output not found</div>;
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
