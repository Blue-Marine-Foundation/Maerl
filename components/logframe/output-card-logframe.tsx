'use client';

import { useState } from 'react';
import { Output, OutputActivity } from '@/utils/types';
import ActionButton from '@/components/ui/action-button';
import FeatureCardLogframe from './feature-card-logframe';
import OutputForm from './output-form';
import { extractOutputCodeNumber } from './extractOutputCodeNumber';
import AddOutputButton from './add-output-button';
import { isUnplannedOutput } from './isUnplannedOutput';
import OutputIndicatorsDetailsTable from './output-indicators-table';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge, BadgeProps } from '../ui/badge';
import OutputActivityForm from './output-activity-form';
import { extractOutputActivityCodeNumber } from './extractOutputActivityCodeNumber';
import OutputActivitiesList from './output-activities-list';
import ArchiveToggle from '@/components/archive-toggle/archive-toggle';

export default function OutputCardLogframe({
  canEdit = false,
  output,
  projectId,
  projectSlug,
  existingCodes = [],
  showIndicator = true,
}: {
  /** Enables the Add Output and Edit Output buttons*/
  canEdit?: boolean;
  output: Output | null;
  projectId: number;
  projectSlug: string;
  existingCodes?: string[];
  showIndicator?: boolean;
}) {
  const [isOutputDialogOpen, setIsOutputDialogOpen] = useState(false);
  const [isTableExpanded, setIsTableExpanded] = useState(showIndicator);
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] =
    useState<OutputActivity | null>(null);

  const measurables = output?.output_measurables?.filter((m) => !m.archived);

  const activities = output?.activities?.sort(
    (a, b) =>
      extractOutputActivityCodeNumber(a.activity_code) -
      extractOutputActivityCodeNumber(b.activity_code),
  );

  return (
    <div className='relative flex flex-col gap-8'>
      {!output && canEdit && (
        <FeatureCardLogframe title='Output' minHeight='100%' variant='output'>
          <div className='flex grow flex-col items-center justify-center gap-4'>
            <AddOutputButton projectId={projectId} output={output} />
          </div>
        </FeatureCardLogframe>
      )}

      {output && (
        <div id={`output-${output.id}`} className='rounded-md bg-card'>
          <div className='-mt-0 w-full rounded-t-md bg-sky-600/50 px-4 py-6'>
            <div className='flex items-center justify-between gap-8'>
              <div className='flex items-baseline justify-start gap-8'>
                <div className='flex items-center gap-4'>
                  <h3 className='text-sm font-medium'>
                    {isUnplannedOutput(output)
                      ? `Unplanned Output  ${extractOutputCodeNumber(output.code)}`
                      : `Output ${extractOutputCodeNumber(output.code)}`}
                  </h3>
                  {output.status && (
                    <div className='flex items-center gap-4'>
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
                <p className='max-w-prose text-sm'>{output.description}</p>
              </div>
              <div className='flex items-center gap-2'>
                {canEdit && (
                  <ActionButton
                    action='edit'
                    onClick={() => setIsOutputDialogOpen(true)}
                    className='border-foreground/80 text-sm hover:bg-foreground/10'
                  />
                )}
                <ArchiveToggle outputType='output' data={output} />
              </div>
            </div>
          </div>
          <div className='px-4 pb-4'>
            <div className='flex w-full grow flex-col items-start justify-between gap-6'>
              <div className='flex w-full justify-between gap-8 bg-card'></div>
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
                    measurables={measurables || []}
                    outputId={output.id}
                    projectId={projectId}
                    outputCode={output.code}
                  />
                </div>
                <button
                  onClick={() => setIsActivitiesExpanded(!isActivitiesExpanded)}
                  className='my-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
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
                      ? 'max-h-none opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  {activities && output && (
                    <OutputActivitiesList
                      activities={activities}
                      output={output}
                      projectId={projectId}
                    />
                  )}
                </div>
              </div>
            </div>
            <OutputForm
              isOpen={isOutputDialogOpen}
              onClose={() => setIsOutputDialogOpen(false)}
              output={output}
              projectId={projectId}
              existingCodes={existingCodes}
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
          </div>
        </div>
      )}
    </div>
  );
}
