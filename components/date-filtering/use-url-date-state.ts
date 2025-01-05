import { startOfYear, format } from 'date-fns';
import { useSearchParams } from 'next/navigation';

export interface DateState {
  from: string;
  to: string;
}

export const defaultFrom = startOfYear(new Date());
export const defaultTo = new Date();

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

  const from = new Date(fromParam ?? defaultFrom);
  const to = new Date(toParam ?? defaultTo);

  return {
    from: format(from, 'yyyy-MM-dd'),
    to: format(to, 'yyyy-MM-dd'),
  };
}
