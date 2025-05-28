'use client';

import { useUrlDates } from "./use-url-dates";
import { fetchUpdates } from "@/api/fetch-updates";
import { useQuery } from "@tanstack/react-query";

export const useUpdates = (projectId?: number) => {
  const dateRange = useUrlDates();
  
  const {
    data: updates = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "updates",
      dateRange.from,
      dateRange.to,
      projectId
    ],
    queryFn: () => fetchUpdates({ from: dateRange.from, to: dateRange.to }, projectId),
  });

  return {
    updates,
    isLoading,
    error,
  }
}