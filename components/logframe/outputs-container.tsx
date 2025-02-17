'use client';

import { Output } from '@/utils/types';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { useParams } from 'next/navigation';
import { extractOutputCodeNumber } from '@/components/logframe/extractOutputCodeNumber';
import FeatureCardTheoryOfChange from './feature-card-theory-of-change';
import AddOutputButton from './add-output-button';

export default function OutputsContainer({ outputs }: { outputs: Output[] }) {
  const { slug } = useParams();

  return (
    <div className='flex flex-col gap-8'>
      {outputs.length > 0 ? (
        outputs.map((output) => (
          <div
            key={output.id}
            id={`output-${output.id}`}
            className='scroll-mt-20'
          >
            <FeatureCardTheoryOfChange
              key={output.id}
              minHeight='100%'
              title={`Output ${extractOutputCodeNumber(output.code)}`}
              variant='output'
              tooltipText='Outputs are specific, direct deliverables that result from the project’s activities. The Outputs should be fully within the control of the project, providing the assumptions hold. Taken together, the outputs should provide the conditions necessary to achieve the Outcome. Wherever possible it should be clear who will benefit from the output, and how they will benefit.'
            >
              <div className='flex justify-between'>
                <p className='max-w-prose'>{output.description}</p>
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
        ))
      ) : (
        <FeatureCardTheoryOfChange
          minHeight='100px'
          title='Outputs'
          variant='output'
          tooltipText='The direct results of project activities that contribute to outcomes'
        >
          <AddOutputButton projectId={Number(slug)} output={null} />
        </FeatureCardTheoryOfChange>
      )}
    </div>
  );
}
