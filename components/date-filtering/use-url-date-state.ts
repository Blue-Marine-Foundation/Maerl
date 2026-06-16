import { useSearchParams } from 'next/navigation';
import { getDefaultUpdateDateRange } from '../updates/update-date-range';

export interface DateState {
  from: string;
  to: string;
}

export default function useUrlDateState(): DateState {
  const queryStrings = useSearchParams();

  const fromParam = queryStrings?.get('from');
  const toParam = queryStrings?.get('to');

  if (fromParam && toParam) {
    return {
      from: fromParam,
      to: toParam,
    };
  }

  const defaultRange = getDefaultUpdateDateRange();

  return {
    from: fromParam ?? defaultRange.from,
    to: toParam ?? defaultRange.to,
  };
}
