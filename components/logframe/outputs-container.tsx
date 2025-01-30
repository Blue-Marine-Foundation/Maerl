'use client';

import { Output } from '@/utils/types';
import OutputCard from './outputs-card';
import FeatureCard from '@/components/ui/feature-card';

export default function OutputsContainer({ outputs }: { outputs: Output[] }) {
  return (
    <div className='flex flex-col gap-8'>
      {outputs
        .sort((a, b) => a.code.localeCompare(b.code))
        .map((output) => (
          <FeatureCard
            key={output.id}
            minHeight='100px'
            title='Output'
            variant='slate'
          >
            <OutputCard output={output} />
          </FeatureCard>
        ))}
    </div>
  );
}
