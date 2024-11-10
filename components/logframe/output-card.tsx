'use client';

import { Output } from '@/utils/types';
import FeatureCard from '../ui/feature-card';
import OutputMeasurableTable from './output-measurable-table';
import { Badge } from '../ui/badge';
import OutputUpdatesWrapper from '../updates/output-updates-wrapper';

export default function OutputCard({ output }: { output: Output }) {
  return (
    <>
      <FeatureCard title={`Output ${output.code}`}>
        <p className='max-w-prose text-lg font-medium'>{output.description}</p>
        <OutputMeasurableTable output={output} />
      </FeatureCard>
      <div className='grid grid-cols-[4fr_1fr] items-start gap-8'>
        <OutputUpdatesWrapper />
        <FeatureCard title='Activities coming soon'>
          <div className='flex grow items-center justify-start'>
            <div className='flex flex-col items-start justify-start gap-2'>
              <Badge variant='default'>Coming soon</Badge>
              <p className='text-muted-foreground'>
                We'll be adding support for activities here soon.
              </p>
            </div>
          </div>
        </FeatureCard>
      </div>
    </>
  );
}
