'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { format, subDays } from 'date-fns';
import { Loader } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/utils/cn';
import DateRangePicker from './date-range-picker';

export function initializeDateRange(
  fromParam: string | null,
  toParam: string | null,
  defaultFrom: Date,
  defaultTo: Date,
): DateRange {
  const fromDate = fromParam ? new Date(fromParam) : defaultFrom;
  const toDate = toParam ? new Date(toParam) : defaultTo;

  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(23, 59, 59, 999);

  return { from: fromDate, to: toDate };
}

export default function SetDateRange({
  className,
}: {
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
}) {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const [date, setDate] = useState<DateRange | undefined>(() =>
    initializeDateRange(
      searchParams.get('from'),
      searchParams.get('to'),
      subDays(new Date(), 29),
      new Date(),
    ),
  );

  const [datesAreEdited, setDatesAreEdited] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Regret
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    setIsUpdating(false);

    const prevFrom = searchParams.get('from') as string;
    const prevTo = searchParams.get('to') as string;

    const newFrom = date?.from ? format(date.from, 'yyyy-MM-dd') : null;
    const newTo = date?.to ? format(date.to, 'yyyy-MM-dd') : null;

    if (newFrom && newTo && (prevFrom !== newFrom || prevTo !== newTo)) {
      setDatesAreEdited(true);
    } else {
      setDatesAreEdited(false);
    }
  }, [searchParams, date]);

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
          className='flex items-center justify-end gap-4'
        >
          <DateRangePicker date={date} onDateChange={handleDateChange} />
          <button
            type='submit'
            disabled={!datesAreEdited}
            className='h-10 w-24 rounded-md border bg-background text-center disabled:bg-transparent disabled:text-foreground/40'
          >
            {isUpdating ? (
              <Loader size={16} className='mx-auto animate-spin' />
            ) : (
              'Update'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
