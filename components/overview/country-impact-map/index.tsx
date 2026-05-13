'use client';

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchCountryImpactData } from './server-actions';
import MapView from './map-view';

// Wrapper that owns the data fetch and renders the Mapbox GL map. Mirrors
// the projects-map pattern: a 'use client' component that runs useQuery,
// renders skeleton/error/empty states, and hands typed data to MapView.
// MapView itself lazy-imports `mapbox-gl` inside useEffect so the runtime
// is never bundled into the server build (per the Mapbox ODP skill).
export default function CountryImpactMap() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['overview-country-impact-map'],
    queryFn: fetchCountryImpactData,
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return <Skeleton className='h-full w-full rounded-lg' />;
  }

  if (error) {
    return (
      <div className='flex h-full items-center justify-center rounded-lg border bg-card'>
        <p className='text-sm text-muted-foreground'>
          Failed to load country map: {(error as Error).message}
        </p>
      </div>
    );
  }

  if (!data || data.rows.length === 0) {
    return (
      <div className='flex h-full items-center justify-center rounded-lg border bg-card'>
        <p className='text-sm text-muted-foreground'>
          No active projects with country data to display.
        </p>
      </div>
    );
  }

  return (
    <MapView
      rows={data.rows}
      activeProjectsWithoutCountry={data.activeProjectsWithoutCountry}
      defaultFocusBounds={data.defaultFocusBounds}
      defaultFocusLabel={data.defaultFocusLabel}
    />
  );
}
