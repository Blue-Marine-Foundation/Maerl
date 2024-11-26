import SetDateRange from '@/components/date-filtering/set-date-range';
import ShowDates from './show-dates';

export default function DatesPage() {
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex items-center justify-between gap-4'>
        <h2 className='text-xl font-semibold'>Dates</h2>
        <SetDateRange />
      </div>
      <ShowDates />
    </div>
  );
}
