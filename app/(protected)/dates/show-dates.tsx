'use client';

import useUrlDateState from '@/components/date-filtering/use-url-date-state';
import { format } from 'date-fns/format';

export default function ShowDates() {
  const { from, to } = useUrlDateState();

  return (
    <div className='flex justify-center gap-4 py-20'>
      <div className='grid w-1/3 grid-cols-[1fr_3fr] gap-2 rounded-md border p-8'>
        <p>From: </p>
        <p>{format(from, 'LLL dd, y')}</p>
        <p>To: </p>
        <p>{format(to, 'LLL dd, y')}</p>
      </div>
    </div>
  );
}
