import { DateRange } from 'react-day-picker';
import {
  differenceInMonths,
  endOfDay,
  endOfMonth,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  isValid,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns';

export const serverDateFormat = 'yyyy-MM-dd';
export const textDateFormat = 'dd MMMM yyyy';
export const shortTextDateFormat = 'd MMM yyyy';
export const timeDateFormat = 'HH:mm';

/**
 * Gets the start date for the allowed date range (3 months ago from today)
 */
export const getStartPeriod = () => {
  return startOfMonth(subMonths(new Date(), 3));
};

/**
 * Gets the end date for the allowed date range (today)
 */
export const getEndPeriod = () => {
  return new Date();
};

/**
 * Calculates a comparison date range based on the selected date range.
 *
 * If the selected range spans complete months (starts on first of month and ends on last of month),
 * returns the previous period of the same length. For example:
 * - Feb 1st to Mar 31st → Dec 1st to Jan 31st
 * - Jan 1st to Mar 31st → Oct 1st to Dec 31st
 *
 * Otherwise, returns a range of the same length immediately preceding the selected range.
 * For example:
 * - Feb 15th to Mar 15th → Jan 15th to Feb 15th
 *
 * @param from - The start date of the selected range
 * @param to - The end date of the selected range
 * @returns A DateRange object containing the comparison period, with both from and to dates guaranteed to be non-null
 */
export function calculateComparisonDateRange(
  from: Date,
  to: Date,
): { from: Date; to: Date } {
  // Check if this is a range of complete months
  const isCompleteMonthsRange = isFirstDayOfMonth(from) && isLastDayOfMonth(to);

  if (isCompleteMonthsRange) {
    // Calculate how many months are in the range
    const monthsInRange = differenceInMonths(to, from) + 1;

    // For complete month ranges, set comparison to previous period of same length
    const previousPeriodStart = subMonths(from, monthsInRange);
    const previousPeriodEnd = subMonths(to, monthsInRange);

    return {
      from: startOfMonth(previousPeriodStart),
      to: endOfMonth(previousPeriodEnd),
    };
  }

  // Default behavior for non-complete-month ranges
  const comparisonToDate = subDays(from, 1);
  const selectedDateRange = to.getTime() - from.getTime();
  const comparisonFromDate = new Date(
    comparisonToDate.getTime() - selectedDateRange,
  );

  return {
    from: startOfDay(comparisonFromDate),
    to: endOfDay(comparisonToDate),
  };
}

export function parseValidDate(
  input: string | null,
  transform: (date: Date) => Date = (date) => date,
): Date | null {
  if (!input) return null;
  const raw = new Date(input);
  return isValid(raw) ? transform(raw) : null;
}

/**
 * Initialises a date range from URL parameters or default values.
 * Sets appropriate time values for the dates (start of day for 'from', end of day for 'to').
 *
 * @param fromParam - The 'from' date parameter from the URL
 * @param toParam - The 'to' date parameter from the URL
 * @param defaultFrom - Default start date if no URL parameter is provided
 * @param defaultTo - Default end date if no URL parameter is provided
 * @returns A DateRange object with properly initialized dates
 */
export function initialiseDateRange(
  fromParam: string | null,
  toParam: string | null,
  defaultFrom: Date,
  defaultTo: Date,
): DateRange {
  const fromDate = parseValidDate(fromParam, startOfDay);
  const toDate = parseValidDate(toParam, endOfDay);

  return {
    from: fromDate || defaultFrom,
    to: toDate || defaultTo,
  };
}

/**
 * Extracts only date-related search parameters from URLSearchParams
 * @param searchParams - The URLSearchParams object
 * @returns A new URLSearchParams object containing only date parameters
 */
export function extractDateParams(
  searchParams: URLSearchParams,
): URLSearchParams {
  const dateParams = new URLSearchParams();
  if (searchParams.get('from'))
    dateParams.set('from', searchParams.get('from')!);
  if (searchParams.get('to')) dateParams.set('to', searchParams.get('to')!);
  return dateParams;
}
