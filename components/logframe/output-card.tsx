'use client';

import { Output } from '@/utils/types';
import FeatureCard from '../ui/feature-card';
import OutputMeasurableTable from './output-measurable-table';

export default function OutputCard({ output }: { output: Output }) {
  return (
    <>
      <FeatureCard title={`Output ${output.code}`}>
        <p className='mb-4'>{output.description}</p>
        <OutputMeasurableTable output={output} />
      </FeatureCard>
      <div className='grid grid-cols-2 gap-8'>
        <FeatureCard title='Activities'>
          <p>Blah blah blah</p>
        </FeatureCard>
        <FeatureCard title='Updates'>
          <p>Foo bar baz</p>
        </FeatureCard>
      </div>
    </>
  );
}
