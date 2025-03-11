'use client';

import { useState } from 'react';
import { Output, OutputActivity } from '@/utils/types';
import ActionButton from '@/components/ui/action-button';
import FeatureCardLogframe from './feature-card-logframe';
import OutputForm from './output-form';
import { extractOutputCodeNumber } from './extractOutputCodeNumber';
import { logframeText } from './logframe-text';
import AddOutputButton from './add-output-button';
import { isUnplannedOutput } from './isUnplannedOutput';
import OutputIndicatorsDetailsTable from './output-indicators-table';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { Badge, BadgeProps } from '../ui/badge';
import OutputActivityForm from './output-activity-form';
import { extractOutputActivityCodeNumber } from './extractOutputActivityCodeNumber';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

export default function OutputCardLogframe({
  canEdit = false,
  output,
  projectId,
}: {
  /** Enables the Add Output and Edit Output buttons*/
  canEdit?: boolean;
  output: Output | null;
  projectId: number;
}) {
  const [isOutputDialogOpen, setIsOutputDialogOpen] = useState(false);
  const [isTableExpanded, setIsTableExpanded] = useState(true);
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] =
    useState<OutputActivity | null>(null);

  const activities = output?.activities?.sort(
    (a, b) =>
      extractOutputActivityCodeNumber(a.activity_code) -
      extractOutputActivityCodeNumber(b.activity_code),
  );

  return (
    <div className='relative flex flex-col gap-8'>
      {!output && canEdit && (
        <FeatureCardLogframe
          title='Output'
          minHeight='100%'
          variant='output'
          tooltipText={logframeText.output.description}
        >
          <div className='flex grow flex-col items-center justify-center gap-4'>
            <AddOutputButton projectId={projectId} output={output} />
          </div>
        </FeatureCardLogframe>
      )}

      {output && (
        <div id={`output-${output.id}`}>
          <FeatureCardLogframe
            title={
              isUnplannedOutput(output)
                ? `Unplanned Output  ${extractOutputCodeNumber(output.code)}`
                : `Output ${extractOutputCodeNumber(output.code)}`
            }
            variant='output'
            minHeight='100%'
            tooltipText={logframeText.output.description}
          >
            <div className='flex w-full grow flex-col items-start justify-between gap-6'>
              <div className='flex w-full justify-between gap-8 bg-card'>
                {output.status && (
                  <div className='flex items-center gap-4'>
                    <p className='max-w-prose text-sm'>{output.description}</p>
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

                {canEdit && (
                  <div className='flex-shrink-0 space-x-2 text-sm'>
                    <ActionButton
                      action='edit'
                      onClick={() => setIsOutputDialogOpen(true)}
                    />
                  </div>
                )}
              </div>
              <div className='w-full'>
                <button
                  onClick={() => setIsTableExpanded(!isTableExpanded)}
                  className='mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
                >
                  {isTableExpanded ? (
                    <>
                      <ChevronDown className='h-4 w-4 transition-transform duration-200' />{' '}
                      Hide indicators
                    </>
                  ) : (
                    <>
                      <ChevronRight className='h-4 w-4 transition-transform duration-200' />{' '}
                      Show indicators
                    </>
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isTableExpanded
                      ? 'max-h-none opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <OutputIndicatorsDetailsTable
                    measurables={output?.output_measurables || []}
                    outputId={output.id}
                    projectId={projectId}
                  />
                </div>
                <button
                  onClick={() => setIsActivitiesExpanded(!isActivitiesExpanded)}
                  className='my-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
                >
                  {isActivitiesExpanded ? (
                    <>
                      <ChevronDown className='h-4 w-4 transition-transform duration-200' />{' '}
                      Hide activities
                    </>
                  ) : (
                    <>
                      <ChevronRight className='h-4 w-4 transition-transform duration-200' />{' '}
                      Show activities
                    </>
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isActivitiesExpanded
                      ? 'max-h-[1000px] opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className='flex flex-col gap-4'>
                    {activities && activities.length > 0 ? (
                      <div>
                        <div className='rounded-md border bg-card p-4'>
                          <div className='flex items-center gap-2'>
                            <p className='font-medium text-muted-foreground'>
                              Activities
                            </p>

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
                                  <ActionButton
                                    action='edit'
                                    variant='icon'
                                    onClick={() => {
                                      setSelectedActivity(activity);
                                      setIsActivityDialogOpen(true);
                                    }}
                                  />

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
                                          .replace(
                                            ' ',
                                            '_',
                                          ) as BadgeProps['variant']
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
                        <ActionButton
                          action='add'
                          label='Add activity'
                          onClick={() => setIsActivityDialogOpen(true)}
                          className='mt-6'
                        />
                      </div>
                    ) : (
                      <div className='mt-2 flex items-center justify-center rounded-md border border-dashed p-12'>
                        <ActionButton
                          action='add'
                          label='Add activity'
                          onClick={() => setIsActivityDialogOpen(true)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <OutputForm
              isOpen={isOutputDialogOpen}
              onClose={() => setIsOutputDialogOpen(false)}
              output={output}
              projectId={projectId}
            />
            <OutputActivityForm
              isOpen={isActivityDialogOpen}
              onClose={() => {
                setIsActivityDialogOpen(false);
                setSelectedActivity(null);
              }}
              activity={selectedActivity}
              activities={activities || []}
              projectId={projectId}
              output={output}
            />
          </FeatureCardLogframe>
        </div>
      )}
    </div>
  );
}
