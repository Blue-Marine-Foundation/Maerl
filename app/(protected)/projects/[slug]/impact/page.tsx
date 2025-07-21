'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useProjectImpacts } from '@/hooks/use-project-impact';
import { useParams } from 'next/navigation';

export default function ImpactPage() {
  const { slug } = useParams();

  const { impactIndicatorSummaries, isLoading, error } = useProjectImpacts(
    slug as string,
  );

  return (
    <div>
      <h1>Impact</h1>
      <Card>
        <CardHeader className='pb-4'>
          <h3>Impact indicators:</h3>
        </CardHeader>
        <CardContent>
          {impactIndicatorSummaries.map(
            ({
              impactIndicatorId,
              impactIndicatorCode,
              impactIndicatorTitle,
              impactIndicatorUnit,
              count,
              value,
            }) => (
              <div
                key={impactIndicatorId}
                className='grid grid-cols-4 gap-2 text-sm'
              >
                <p>{impactIndicatorCode}</p>
                <p>{impactIndicatorTitle}</p>

                <div className='grid grid-cols-2 gap-2'>
                  <p className='text-right'>{count}</p>
                  <p className='text-right'>{value}</p>
                </div>
                <p>{impactIndicatorUnit}</p>
              </div>
            ),
          )}
        </CardContent>
      </Card>
    </div>
  );
}
