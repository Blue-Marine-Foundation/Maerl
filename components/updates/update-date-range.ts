import { format, startOfYear } from 'date-fns';

export type UpdateDateRange = {
  from: string;
  to: string;
};

export function getDefaultUpdateDateRange(now: Date = new Date()): UpdateDateRange {
  return {
    from: format(startOfYear(now), 'yyyy-MM-dd'),
    to: format(now, 'yyyy-MM-dd'),
  };
}
