'use client';

import { Output } from '@/utils/types';
import { Badge } from '@/components/ui/badge';
import ActionButton from '../ui/action-button';

export default function OutputCard({
  output,
  onEdit,
}: {
  output: Output;
  onEdit: (output: Output) => void;
}) {
  return (
    <div className='grid grid-cols-[50px_1fr_50px] items-baseline justify-between gap-4 text-sm'>
      <div>
        <Badge className='mr-2'>{output.code}</Badge>
      </div>
      <div className=''>
        <p>{output.description}</p>
      </div>
      <div className='flex justify-end'>
        <ActionButton
          action='edit'
          variant='icon'
          onClick={() => onEdit(output)}
        />
      </div>
    </div>
  );
}
