'use client';

import { Output } from '@/utils/types';
import FeatureCard from '../ui/feature-card';
import OutputMeasurableTable from './output-measurable-table';

export default function OutputCard({ output }: { output: Output }) {
  return (
    <>
      <FeatureCard title={`Output ${output.code}`}>
        <p className='max-w-prose text-lg font-medium'>{output.description}</p>
        <OutputMeasurableTable output={output} />
      </FeatureCard>
      <div className='grid grid-cols-2 gap-8'>
        <FeatureCard title='Activities'>
          <div className='flex h-full items-center justify-center gap-2'>
            <p className='text-muted-foreground'>Activities coming soon</p>
          </div>
        </FeatureCard>
        <FeatureCard title='Updates'>
          <div className='flex h-full items-center justify-center gap-2'>
            <p className='text-muted-foreground'>
              Updates moving here soon; for now, keep adding updates in old
              Maerl
            </p>
          </div>
        </FeatureCard>
      </div>
    </>
  );
}
