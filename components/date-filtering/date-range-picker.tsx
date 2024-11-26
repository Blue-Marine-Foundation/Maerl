import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import presetDateRanges, { presetButtons } from './preset-date-ranges';

type PresetKey = keyof typeof presetDateRanges;

interface DateRangePickerProps {
  date: DateRange | undefined;
  onDateChange: (newDate: DateRange | undefined, presetKey?: string) => void;
}

export default function DateRangePicker({
  date,
  onDateChange,
}: DateRangePickerProps) {
  const [preselectedRange, setPreselectedRange] = useState<string | null>(null);

  const handleButtonClick = (presetKey: PresetKey) => {
    const preset = presetDateRanges[presetKey];
    if (preset) {
      const { dateRange } = preset();
      onDateChange(dateRange, presetKey);
      setPreselectedRange(presetKey);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id='date'
          variant='outline'
          className={cn(
            'w-[300px] justify-start border-foreground/20 bg-background text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {!date && <span>Filter by date</span>}
          {date && date.from && date.to && (
            <span>
              {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
            </span>
          )}
          {date && date.from && !date.to && (
            <span>{format(date.from, 'LLL dd, y')}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='end'>
        <div className='flex'>
          <Calendar
            initialFocus
            mode='range'
            ISOWeek
            defaultMonth={startOfYear(subYears(new Date(), 1))}
            fromDate={startOfYear(subYears(new Date(), 1))}
            toDate={new Date()}
            selected={date}
            onSelect={(newDate) => onDateChange(newDate)}
            numberOfMonths={2}
          />
          <div className='flex flex-col space-y-2 p-2'>
            {presetButtons.map(({ key, label }) => (
              <Button
                key={key}
                variant={preselectedRange === key ? undefined : 'outline'}
                onClick={() => handleButtonClick(key as PresetKey)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
