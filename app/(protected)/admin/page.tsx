'use client';

import { useState } from 'react';
import AdminUpdateFilters from '@/components/admin/admin-update-filters';
import SetDateRange from '@/components/date-filtering/set-date-range';
import { useUpdates } from '@/hooks/use-updates';
import AdminUpdatesDataTable from '@/components/admin/admin-updates-data-table';
import {
  LoadingStateCard,
  ErrorStateCard,
} from '@/components/base-states/base-states';

export default function AdminPage() {
  const { updates, isLoading, error } = useUpdates();

  // Compute unique project names and impact indicator codes
  const projectOptions = Array.from(
    new Set(updates.map((u) => u.projects?.name).filter(Boolean)),
  ).sort() as string[];
  const indicatorOptions = Array.from(
    new Set(
      updates.map((u) => u.impact_indicators?.indicator_code).filter(Boolean),
    ),
  ).sort() as string[];

  // Define filter types and options here so both filters and updates can use them
  const filterTypes = [
    {
      label: 'Project',
      options: projectOptions,
    },
    {
      label: 'Impact Indicator',
      options: indicatorOptions,
    },
    {
      label: 'Update Type',
      options: ['Progress', 'Impact'],
    },
    {
      label: 'Metadata',
      options: ['Has link', 'Verified', 'Duplicate', 'Valid', 'Admin Reviewed'],
    },
  ];

  // State: { [filterLabel]: Set of selected options }
  const [selectedFilters, setSelectedFilters] = useState(() => {
    const initial: Record<string, Set<string>> = {};
    filterTypes.forEach((f) => {
      initial[f.label] = new Set();
    });
    return initial;
  });

  // Filtering logic
  const filteredUpdates = updates.filter((update) => {
    if (
      selectedFilters['Project']?.size &&
      !selectedFilters['Project'].has(update.projects?.name)
    ) {
      return false;
    }
    if (
      selectedFilters['Impact Indicator']?.size &&
      !selectedFilters['Impact Indicator'].has(
        update.impact_indicators?.indicator_code,
      )
    ) {
      return false;
    }
    if (
      selectedFilters['Update Type']?.size &&
      !selectedFilters['Update Type'].has(update.type)
    ) {
      return false;
    }
    if (selectedFilters['Metadata']?.size) {
      for (const meta of Array.from(selectedFilters['Metadata'])) {
        if (meta === 'Has link' && !update.link) return false;
        if (meta === 'Verified' && !update.verified) return false;
        if (meta === 'Duplicate' && !update.duplicate) return false;
        if (meta === 'Valid' && !update.valid) return false;
        if (meta === 'Admin Reviewed' && !update.admin_reviewed) return false;
      }
    }
    return true;
  });

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Admin: manage updates</h2>
        <SetDateRange />
      </div>

      <div className='space-y-4'>
        <AdminUpdateFilters
          filterTypes={filterTypes}
          selected={selectedFilters}
          setSelected={setSelectedFilters}
        />
        {isLoading ? (
          <LoadingStateCard
            title='Loading updates'
            description="How's the weather?"
          />
        ) : error ? (
          <ErrorStateCard
            title='Error loading updates'
            errorMessage={error.message}
            description='Sometimes refreshing the page can resolve the error.'
          />
        ) : (
          <>
            <p className='px-4 text-sm'>
              Filters match {filteredUpdates.length} update
              {filteredUpdates.length === 1 ? '' : 's'}
            </p>
            <AdminUpdatesDataTable updates={filteredUpdates} />
          </>
        )}
      </div>
    </div>
  );
}
