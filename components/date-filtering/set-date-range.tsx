'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { format } from 'date-fns';
import { Loader } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import DateRangePicker from './date-range-picker';
import useUrlDateState from './use-url-date-state';

export default function SetDateRange({
  className,
}: {
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
}) {
  const router = useRouter();
  const path = usePathname();
  const { from: initialFrom, to: initialTo } = useUrlDateState();

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(initialFrom),
    to: new Date(initialTo),
  });

  const [datesAreEdited, setDatesAreEdited] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    setIsUpdating(false);

    const newFrom = date?.from ? format(date.from, 'yyyy-MM-dd') : null;
    const newTo = date?.to ? format(date.to, 'yyyy-MM-dd') : null;

    if (newFrom && newTo && (initialFrom !== newFrom || initialTo !== newTo)) {
      setDatesAreEdited(true);
    } else {
      setDatesAreEdited(false);
    }
  }, [initialFrom, initialTo, date]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    const urlParams = new URLSearchParams();

    if (date?.from && date?.to) {
      urlParams.set('from', format(date.from, 'yyyy-MM-dd'));
      urlParams.set('to', format(date.to, 'yyyy-MM-dd'));
    }

    router.replace(`${path}?${urlParams.toString()}`);
  };

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
  };

  return (
    <div className='flex flex-col gap-1'>
      <div className={cn('grid gap-2', className)}>
        <form
          onSubmit={handleFormSubmit}
          className='flex items-center justify-end'
        >
          <DateRangePicker date={date} onDateChange={handleDateChange} />
          <button
            type='submit'
            disabled={!datesAreEdited}
            className='h-10 w-32 rounded-r-md border border-l-0 bg-background text-center text-sm hover:bg-sky-500/20 disabled:bg-transparent disabled:text-foreground/40'
          >
            {isUpdating ? (
              <Loader size={12} className='mx-auto animate-spin' />
            ) : (
              'Change dates'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
