'use client';

import { useUser } from '@/components/user/user-provider';
import { Skeleton } from '@/components/ui/skeleton';
import NeedsAttention from './needs-attention';
import YourProjects from './your-projects';

export default function ForYouPanel() {
  const { isLoading, isSuperAdmin, isAdmin, isProjectManager, isPartner } =
    useUser();

  if (isLoading) {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-3 rounded-lg border bg-card p-5'>
          <Skeleton className='h-5 w-32' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-3/4' />
        </div>
      </div>
    );
  }

  // Needs Attention is reserved for Super Admins, who own data review and
  // don't own portfolio projects, so the per-user contribution rollup
  // would be misleading for them.
  if (isSuperAdmin) {
    return <NeedsAttention />;
  }

  if (isAdmin || isProjectManager || isPartner) {
    return (
      <div className='flex flex-col gap-4'>
        <YourProjects scope={isPartner ? 'partner' : 'pm'} />
      </div>
    );
  }

  return null;
}
