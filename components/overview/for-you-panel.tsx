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
      <section className='flex flex-col gap-4'>
        <Skeleton className='h-6 w-40' />
        <Skeleton className='h-4 w-64' />
        <Skeleton className='h-[4.5rem] w-full rounded-xl' />
      </section>
    );
  }

  if (isSuperAdmin) {
    return <NeedsAttention />;
  }

  if (isAdmin || isProjectManager || isPartner) {
    return <YourProjects scope={isPartner ? 'partner' : 'pm'} />;
  }

  return (
    <section className='flex flex-col gap-4'>
      <p className='text-sm text-muted-foreground'>
        Sign in with a project role to see your assignments here.
      </p>
    </section>
  );
}
