import { subDays, format } from 'date-fns';
import { useSearchParams } from 'next/navigation';

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

  const from = new Date(fromParam ?? subDays(new Date(), 29));
  const to = new Date(toParam ?? new Date());

  return {
    from: format(from, 'yyyy-MM-dd'),
    to: format(to, 'yyyy-MM-dd'),
  };
}
