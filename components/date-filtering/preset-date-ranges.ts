import { DateRange } from 'react-day-picker';
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';

export const presetButtons = [
  { key: 'lastWeek', label: 'Last Week' },
  { key: 'lastMonth', label: 'Last Month' },
  { key: 'last3months', label: 'Last 3 Months' },
  { key: 'yearToDate', label: 'Year to Date' },
  { key: 'lastYear', label: 'Last Year' },
  { key: 'allTime', label: 'All Time' },
];

const presetDateRanges: Record<string, () => { dateRange: DateRange }> = {
  lastWeek: () => {
    const now = new Date();
    return {
      dateRange: {
        from: startOfWeek(subDays(now, 7), { weekStartsOn: 1 }),
        to: endOfWeek(subDays(now, 7), { weekStartsOn: 1 }),
      },
    };
  },
  lastMonth: () => {
    const now = new Date();
    const lastMonth = subMonths(now, 1);
    return {
      dateRange: {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
      },
    };
  },
  last3months: () => {
    const now = new Date();
    return {
      dateRange: {
        from: startOfMonth(subMonths(now, 3)),
        to: endOfMonth(subMonths(now, 1)),
      },
    };
  },
  yearToDate: () => {
    const now = new Date();
    return {
      dateRange: {
        from: startOfYear(now),
        to: now,
      },
    };
  },
  lastYear: () => {
    const now = new Date();
    return {
      dateRange: {
        from: startOfYear(subYears(now, 1)),
        to: endOfYear(subYears(now, 1)),
      },
    };
  },
  allTime: () => {
    const now = new Date();
    return {
      dateRange: {
        from: new Date(2009, 5, 12),
        to: now,
      },
    };
  },
};

export default presetDateRanges;
