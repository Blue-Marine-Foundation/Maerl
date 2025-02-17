'use client';

import { Impact } from '@/utils/types';
import { useState } from 'react';
import ImpactForm from './impact-form';
import ActionButton from '../ui/action-button';
import FeatureCardLogframe from './feature-card-logframe';

export default function ImpactCardLogframe({
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
    <FeatureCardLogframe
      title='Impact'
      variant='impact'
      minHeight='100%'
      tooltipText='The long-term, high-level change that the project aims to achieve.'
    >
      {!impact && canEdit && (
        <div className='flex grow flex-col items-center justify-center gap-4'>
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
    </FeatureCardLogframe>
  );
}
