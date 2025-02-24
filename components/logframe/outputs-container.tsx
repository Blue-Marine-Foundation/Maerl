'use client';

import { Output } from '@/utils/types';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { extractOutputCodeNumber } from '@/components/logframe/extractOutputCodeNumber';
import FeatureCardTheoryOfChange from './feature-card-theory-of-change';
import { logframeText } from './logframe-text';
import AddOutputButton from './add-output-button';
import { isUnplannedOutput } from './isUnplannedOutput';

export default function OutputsContainer({
  outputs,
  projectId,
}: {
  outputs: Output[];
  projectId: number;
}) {
  return (
    <div className='flex flex-col gap-8'>
      {outputs.length > 0 ? (
        outputs.map((output) => (
          <div key={output.id} id={`output-${output.id}`}>
            <FeatureCardTheoryOfChange
              key={output.id}
              title={
                isUnplannedOutput(output)
                  ? `Unplanned Output ${extractOutputCodeNumber(output.code || '')}`
                  : `Output ${extractOutputCodeNumber(output.code || '')}`
              }
              variant='output'
              tooltipText={logframeText.output.description}
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
          title='Outputs'
          variant='output'
          tooltipText={logframeText.output.description}
        >
          <AddOutputButton projectId={projectId} output={null} />
        </FeatureCardTheoryOfChange>
      )}
    </div>
  );
}
