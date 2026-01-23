'use client';

import { useState } from 'react';
import { Output, OutputActivity } from '@/utils/types';
import ActionButton from '@/components/ui/action-button';
import { Badge, BadgeProps } from '../ui/badge';
import { Info } from 'lucide-react';
import { extractOutputActivityCodeNumber } from './extractOutputActivityCodeNumber';
import { logframeText } from './logframe-text';
import OutputActivityForm from './output-activity-form';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface OutputActivitiesListProps {
  activities: OutputActivity[];
  output: Output;
  projectId: number;
  canEdit?: boolean;
}

export default function OutputActivitiesList({
  activities,
  output,
  projectId,
  canEdit = true,
}: Readonly<OutputActivitiesListProps>) {
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] =
    useState<OutputActivity | null>(null);

  return (
    <div className='flex flex-col gap-4'>
      {activities && activities.length > 0 ? (
        <div>
          <div className='rounded-md border bg-card p-4'>
            <div className='flex items-center gap-2'>
              <p className='font-medium text-muted-foreground'>Activities</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className='h-4 w-4 text-white/60 hover:text-white' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='max-w-xs text-sm'>
                      {logframeText.activity.description}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <ol className='mt-2 list-none'>
              {activities.map((activity) => (
                <li key={activity.id} className='my-4'>
                  <div className='flex items-start gap-4'>
                    {canEdit && (
                      <ActionButton
                        action='edit'
                        variant='icon'
                        onClick={() => {
                          setSelectedActivity(activity);
                          setIsActivityDialogOpen(true);
                        }}
                      />
                    )}

                    <span className='text-sm'>
                      {`${extractOutputActivityCodeNumber(
                        activity.activity_code,
                      )}.`}
                    </span>
                    <span className='max-w-prose text-sm'>
                      {activity.activity_description}
                    </span>
                    {activity.activity_status && (
                      <Badge
                        variant={
                          activity.activity_status
                            .toLowerCase()
                            .replace(' ', '_') as BadgeProps['variant']
                        }
                      >
                        {activity.activity_status}
                      </Badge>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
          {canEdit && (
            <ActionButton
              action='add'
              label='Add activity'
              onClick={() => setIsActivityDialogOpen(true)}
              className='mt-6'
            />
          )}
        </div>
      ) : (
        <div className='mt-2 flex items-center justify-center rounded-md border border-dashed p-12'>
          {canEdit ? (
            <ActionButton
              action='add'
              label='Add activity'
              onClick={() => setIsActivityDialogOpen(true)}
            />
          ) : (
            <p className='text-sm text-muted-foreground'>No activities yet.</p>
          )}
        </div>
      )}

      {canEdit && (
        <OutputActivityForm
          isOpen={isActivityDialogOpen}
          onClose={() => {
            setIsActivityDialogOpen(false);
            setSelectedActivity(null);
          }}
          activity={selectedActivity}
          activities={activities}
          projectId={projectId}
          output={output}
        />
      )}
    </div>
  );
}
