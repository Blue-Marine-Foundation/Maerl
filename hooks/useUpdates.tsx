import useUrlDateState from "@/components/date-filtering/use-url-date-state";
import { fetchUpdates } from "@/components/updates/server-actions";
import { useQuery } from "@tanstack/react-query";

export const useUpdates = (projectId?: number) => {
    const dateRange = useUrlDateState();

    const { data, error } = useQuery({
      queryKey: ['updates', dateRange, projectId],
      queryFn: () => fetchUpdates(dateRange, projectId),
    });    

    return { data, error };
}
