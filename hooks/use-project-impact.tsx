'use client';

import { useUrlDates } from './use-url-dates';
import { fetchProjectImpactUpdates } from '@/api/fetch-project-impact-updates';
import { useQuery } from '@tanstack/react-query';

export const useProjectImpacts = (projectSlug: string) => {
  const dateRange = useUrlDates();

  const {
    data: projectImpactUpdates = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      'project-impact-updates',
      dateRange.from,
      dateRange.to,
      projectSlug,
    ],
    queryFn: () =>
      fetchProjectImpactUpdates(
        { from: dateRange.from, to: dateRange.to },
        projectSlug,
      ),
  });

  const impactIndicatorSummaries = projectImpactUpdates
    .reduce(
      (
        acc: {
          impactIndicatorId: number;
          impactIndicatorCode: string;
          impactIndicatorTitle: string;
          impactIndicatorUnit: string;
          count: number;
          value: number;
        }[],
        update,
      ) => {
        const indicator = update.impact_indicators;
        if (!indicator?.id) {
          return acc;
        }

        const impactIndicatorId = indicator.id;
        const impactIndicatorCode = indicator.indicator_code;
        const impactIndicatorTitle = indicator.indicator_title;
        const impactIndicatorUnit = indicator.indicator_unit;
        const value = update.value ?? 0;
        const existing = acc.find(
          (item) => item.impactIndicatorId === impactIndicatorId,
        );
        if (existing) {
          existing.count += 1;
          existing.value += value;
        } else {
          acc.push({
            impactIndicatorId,
            impactIndicatorCode,
            impactIndicatorTitle,
            impactIndicatorUnit,
            count: 1,
            value,
          });
        }
        return acc;
      },
      [],
    )
    .sort((a, b) => a.impactIndicatorId - b.impactIndicatorId);

  return {
    impactIndicatorSummaries,
    isLoading,
    error,
  };
};
