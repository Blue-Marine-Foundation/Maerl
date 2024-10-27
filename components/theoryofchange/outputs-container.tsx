'use client';

import { Output } from '@/utils/types';
import OutputCard from './outputs-card';
import ActionButton from '../ui/action-button';

export default function OutputsContainer({ outputs }: { outputs: Output[] }) {
  return (
    <div className='flex flex-col gap-4'>
      <h4 className='text-sm font-medium text-muted-foreground'>Outputs</h4>
      {outputs
        .sort((a, b) => a.code.localeCompare(b.code))
        .map((output) => (
          <OutputCard key={output.id} output={output} />
        ))}
      <div className='flex justify-center border border-dashed p-4'>
        <ActionButton action='add' label='Add output' />
      </div>
    </div>
  );
}
