'use client';

import { useUpdates } from '@/hooks/use-updates';
import { ErrorStateCard, LoadingStateCard } from '../base-states/base-states';
import AdminUpdatesDataTable from './admin-updates-data-table';

export default function AdminUpdates() {
  const { updates, isLoading, error } = useUpdates();

  if (isLoading) {
    return (
      <LoadingStateCard
        title='Loading updates'
        description="How's the weather?"
      />
    );
  }

  if (error) {
    return (
      <ErrorStateCard
        title='Error loading updates'
        errorMessage={error.message}
        description='Sometimes refreshing the page can resolve the error.'
      />
    );
  }

  return (
    <div className='space-y-4'>
      <p className='px-4 text-sm'>
        Filters match {updates.length} update{updates.length === 1 ? '' : 's'}
      </p>
      <AdminUpdatesDataTable updates={updates} />
    </div>
  );
}
