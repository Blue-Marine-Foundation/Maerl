'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { format } from 'date-fns';
import { Loader } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/utils/cn';
import DateRangePicker from './date-range-picker';
import useUrlDateState from './use-url-date-state';

function parseDateParam(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  return new Date(value);
}

export default function SetDateRange({
  className,
}: {
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
}) {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const { from: initialFrom, to: initialTo } = useUrlDateState();

  const [date, setDate] = useState<DateRange | undefined>(() => ({
    from: parseDateParam(initialFrom),
    to: parseDateParam(initialTo),
  }));

  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    setDate({
      from: parseDateParam(initialFrom),
      to: parseDateParam(initialTo),
    });
    setIsUpdating(false);
  }, [initialFrom, initialTo]);

  const selectedFrom = date?.from ? format(date.from, 'yyyy-MM-dd') : null;
  const selectedTo = date?.to ? format(date.to, 'yyyy-MM-dd') : null;
  const datesAreEdited = Boolean(
    selectedFrom &&
    selectedTo &&
    (initialFrom !== selectedFrom || initialTo !== selectedTo),
  );

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    const urlParams = new URLSearchParams(searchParams.toString());

    if (date?.from && date?.to) {
      urlParams.set('from', format(date.from, 'yyyy-MM-dd'));
      urlParams.set('to', format(date.to, 'yyyy-MM-dd'));
    }

    const queryString = urlParams.toString();
    router.replace(queryString ? `${path}?${queryString}` : path);
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
            className='h-10 w-32 rounded-r-md border border-l-0 bg-background text-center text-sm hover:bg-accent disabled:bg-transparent disabled:text-foreground/40'
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
