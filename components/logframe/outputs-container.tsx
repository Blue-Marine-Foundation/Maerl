'use client';

import { Output } from '@/utils/types';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { extractOutputCodeNumber } from '@/components/logframe/extractOutputCodeNumber';
import FeatureCardTheoryOfChange from './feature-card-theory-of-change';

export default function OutputsContainer({ outputs }: { outputs: Output[] }) {
  const { slug } = useParams();

  return (
    <div className='flex flex-col gap-8'>
      {outputs.map((output) => (
        <div
          key={output.id}
          id={`output-${output.id}`}
          className='scroll-mt-20'
        >
          <FeatureCardTheoryOfChange
            key={output.id}
            minHeight='100px'
            title={`Output ${extractOutputCodeNumber(output.code)}`}
            variant='slate'
          >
            <div className='flex justify-between'>
              <Link
                href={`/projects/${slug}/logframe/output?id=${output.id}`}
                className='hover:underline'
              >
                <p className='max-w-prose'>{output.description}</p>
              </Link>

              {output.status && (
                <div>
                  <Badge
                    variant={
                      output.status
                        .toLowerCase()
                        .replace(' ', '_') as BadgeProps['variant']
                    }
                  >
                    {output.status}
                  </Badge>
                </div>
              )}
            </div>
          </FeatureCardTheoryOfChange>
        </div>
      ))}
    </div>
  );
}
