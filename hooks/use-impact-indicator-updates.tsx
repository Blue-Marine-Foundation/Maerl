import { useQuery } from '@tanstack/react-query';
import { fetchImpactIndicatorUpdates } from '@/api/fetch-impact-indicator-updates';
import useUrlDateState from '@/components/date-filtering/use-url-date-state';

export const useImpactIndicatorUpdates = (id: string) => {
  const dateRange = useUrlDateState();

  const { data, error, isLoading } = useQuery({
    queryKey: ['impact-indicator-updates', id, dateRange],
    queryFn: () =>
      fetchImpactIndicatorUpdates(id as string, dateRange.from, dateRange.to),
  });

  return { data, error, isLoading };
};
