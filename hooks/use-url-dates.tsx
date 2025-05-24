"use client";

import { useEffect, useMemo } from "react";
import {
  endOfDay,
  isAfter,
  isBefore,
  isEqual,
  startOfDay,
  subDays,
} from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

import { calculateComparisonDateRange, parseValidDate } from "@/utils/date-utils";

export interface UrlDates {
  from: string;
  to: string;
  comparisonFrom: string;
  comparisonTo: string;
}

export const useUrlDates = (): UrlDates => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const comparisonFromParam = searchParams.get("comparisonFrom");
  const comparisonToParam = searchParams.get("comparisonTo");

  const dates = useMemo(() => {
    return {
      fromDate: parseValidDate(fromParam, startOfDay),
      toDate: parseValidDate(toParam, endOfDay),
      comparisonFromDate: parseValidDate(comparisonFromParam, startOfDay),
      comparisonToDate: parseValidDate(comparisonToParam, endOfDay),
    };
  }, [fromParam, toParam, comparisonFromParam, comparisonToParam]);

  const { fromDate, toDate, comparisonFromDate, comparisonToDate } = dates;

  useEffect(() => {
    const isValidDates = [
      [fromDate, fromParam],
      [toDate, toParam],
      [comparisonFromDate, comparisonFromParam],
      [comparisonToDate, comparisonToParam],
    ].every(([date, stringDate]) => Boolean(date) === Boolean(stringDate));

    const now = endOfDay(new Date());

    const mainRangeValid =
      fromDate && toDate
        ? !isAfter(fromDate, toDate) &&
          (isBefore(toDate, now) || isEqual(toDate, now))
        : true;

    const comparisonValid =
      comparisonFromDate && comparisonToDate
        ? !isAfter(comparisonFromDate, comparisonToDate) &&
          isBefore(comparisonToDate, now)
        : true;

    const comparisonIsBeforeMain =
      comparisonFromDate && comparisonToDate && fromDate
        ? isBefore(comparisonFromDate, fromDate) &&
          isBefore(comparisonToDate, fromDate)
        : true;

    const isValidRange =
      isValidDates &&
      comparisonIsBeforeMain &&
      mainRangeValid &&
      comparisonValid;

    if (!isValidRange) {
      const redirectUrl = encodeURIComponent(window.location.pathname);
      router.replace(`/invalid-dates?redirect=${redirectUrl}`);
    }
  }, [
    fromDate,
    toDate,
    comparisonFromDate,
    comparisonToDate,
    router,
    fromParam,
    toParam,
    comparisonFromParam,
    comparisonToParam,
  ]);

  if (fromDate && toDate && comparisonFromDate && comparisonToDate) {
    return {
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
      comparisonFrom: comparisonFromDate.toISOString(),
      comparisonTo: comparisonToDate.toISOString(),
    };
  }

  if (fromDate && toDate) {
    const { from: comparisonFrom, to: comparisonTo } =
      calculateComparisonDateRange(fromDate, toDate);

    return {
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
      comparisonFrom: comparisonFrom.toISOString(),
      comparisonTo: comparisonTo.toISOString(),
    };
  }

  const defaultTo = endOfDay(new Date());
  const defaultFrom = startOfDay(subDays(defaultTo, 30));

  const { from: comparisonFrom, to: comparisonTo } =
    calculateComparisonDateRange(defaultFrom, defaultTo);

  return {
    from: defaultFrom.toISOString(),
    to: defaultTo.toISOString(),
    comparisonFrom: comparisonFrom.toISOString(),
    comparisonTo: comparisonTo.toISOString(),
  };
};