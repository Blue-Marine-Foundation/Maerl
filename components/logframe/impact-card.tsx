'use client';

import { Impact } from '@/utils/types';
import { useState } from 'react';
import ImpactForm from './impact-form';
import ActionButton from '../ui/action-button';
import FeatureCardTheoryOfChange from './feature-card-theory-of-change';
import { logframeText } from './logframe-text';

export default function ImpactCard({
  impact,
  projectId,
  canEdit = false,
}: {
  impact: Impact | null;
  projectId: number;
  /** Enables the Add Impact and Edit Impact buttons  */
  canEdit?: boolean;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <FeatureCardTheoryOfChange
      title='Impact'
      variant='impact'
      tooltipText={logframeText.impact.description}
    >
      {!impact && canEdit && (
        <div className='flex items-center justify-center rounded-md border border-dashed p-12'>
          <ActionButton
            action='add'
            label='Add impact'
            onClick={() => setIsDialogOpen(true)}
          />
        </div>
      )}
      {impact && (
        <div className='flex grow items-center justify-between gap-4'>
          <p className='max-w-prose text-sm'>{impact.title}</p>
          {canEdit && (
            <div className='flex-shrink-0 text-sm'>
              <ActionButton
                action='edit'
                onClick={() => setIsDialogOpen(true)}
              />
            </div>
          )}
        </div>
      )}
      <ImpactForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        impact={impact}
        projectId={projectId}
      />
    </FeatureCardTheoryOfChange>
  );
}
