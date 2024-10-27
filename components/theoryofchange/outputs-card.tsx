'use client';

import { Output } from '@/utils/types';
import { Badge } from '@/components/ui/badge';
import ActionButton from '../ui/action-button';

export default function OutputCard({ output }: { output: Output }) {
  return (
    <div className='grid grid-cols-[50px_auto_50px] items-baseline justify-between gap-4 text-sm'>
      <div>
        <Badge className='mr-2'>{output.code}</Badge>
      </div>
      <p className='grow'>{output.description}</p>
      <div className='flex justify-end'>
        <ActionButton action='edit' variant='icon' />
      </div>
    </div>
  );
}
