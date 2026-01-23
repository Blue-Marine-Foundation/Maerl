'use client';

import { OutputMeasurable } from '@/utils/types';
import { Badge } from '@/components/ui/badge';
import ActionButton from '@/components/ui/action-button';
import FeatureCard from '@/components/ui/feature-card';
import Link from 'next/link';
import * as d3 from 'd3';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import UpdateForm from '../updates/update-form';
import { useUser } from '@/components/user/user-provider';

export default function OutputIndicatorUpdates({
  measurable,
}: Readonly<{
  measurable: OutputMeasurable;
}>) {
  const { authUserId, isAdmin } = useUser();
  const measurableUpdates = measurable.updates
    ?.filter((update) => !update.duplicate && update.valid)
    .sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  return (
    <div className='mb-8 mt-4 pl-12'>
      <div className='mr-8 rounded-lg border border-slate-400/20'>
        <div className='p-4'>
          <p className='mb-4 font-medium text-muted-foreground'>Updates</p>
          {measurableUpdates?.length ? (
            <div className='flex flex-col gap-3'>
              {measurableUpdates.map((update) => (
                <div
                  className='group flex flex-col gap-2 px-2 py-3.5'
                  key={update.id}
                >
                  <div className='flex flex-row gap-4'>
                    <div>
                      {(isAdmin ||
                        (authUserId && update.posted_by === authUserId)) && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <ActionButton action='edit' variant='icon' />
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit update</DialogTitle>
                            </DialogHeader>
                            <UpdateForm
                              outputMeasurable={measurable}
                              impactIndicator={measurable.impact_indicators!}
                              projectId={measurable.project_id}
                              update={update}
                              isAdmin={isAdmin}
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                    <div>
                      <p className='max-w-prose text-sm'>
                        {update.description}
                      </p>
                      <div className='mt-2 flex items-center gap-3'>
                        <span className='text-xs text-muted-foreground'>
                          {d3.timeFormat('%d %b %Y')(new Date(update.date))}
                        </span>
                        <span className='text-xs text-muted-foreground'>|</span>
                        <Badge
                          variant={
                            update.type === 'Progress'
                              ? 'in_progress'
                              : 'success'
                          }
                          className='px-1.5 py-0 text-xs'
                        >
                          {update.type}
                        </Badge>
                        {update.value ? (
                          <>
                            <span className='text-xs text-muted-foreground'>
                              |
                            </span>
                            <span className='text-xs text-muted-foreground'>
                              {`${update.value} ${measurable.impact_indicators?.indicator_unit ?? ''}`}
                            </span>
                          </>
                        ) : null}
                        {update.link ? (
                          <>
                            <span className='text-xs text-muted-foreground'>
                              |
                            </span>
                            {update.link && (
                              <Link
                                href={update.link}
                                target='_blank'
                                className='text-xs text-sky-400 hover:underline'
                              >
                                View evidence
                              </Link>
                            )}
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <FeatureCard minHeight='24'>
              <div className='text-muted-foreground'>No updates yet.</div>
            </FeatureCard>
          )}
        </div>
      </div>
    </div>
  );
}
