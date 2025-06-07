'use client';

import { useState } from 'react';
import AdminUpdateFilters, {
  FilterType,
} from '@/components/admin/admin-update-filters';
import SetDateRange from '@/components/date-filtering/set-date-range';
import { useUpdates } from '@/hooks/use-updates';
import AdminUpdatesDataTable from '@/components/admin/admin-updates-data-table';
import {
  LoadingStateCard,
  ErrorStateCard,
} from '@/components/base-states/base-states';
import CopyToCsvButton from '@/components/data-tables/export-data';

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
  const filterTypes: FilterType[] = [
    {
      label: 'Project',
      options: projectOptions,
      type: 'checkbox',
    },
    {
      label: 'Impact Indicator',
      options: indicatorOptions,
      type: 'checkbox',
    },
    {
      label: 'Update Type',
      options: ['Progress', 'Impact'],
      type: 'checkbox',
    },
    {
      label: 'Metadata',
      options: ['Has link', 'Verified', 'Duplicate', 'Valid', 'Admin Reviewed'],
      type: 'toggle',
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

  // State for metadata toggles
  const [metadataToggles, setMetadataToggles] = useState(() => {
    const initial: Record<string, 'yes' | 'no' | 'either'> = {};
    filterTypes
      .find((f) => f.label === 'Metadata')
      ?.options.forEach((option) => {
        initial[option] = option === 'Admin Reviewed' ? 'no' : 'either';
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

    // Metadata toggle filtering
    for (const [field, value] of Object.entries(metadataToggles)) {
      if (value === 'either') continue;

      const updateValue =
        field === 'Has link'
          ? !!update.link
          : field === 'Verified'
            ? update.verified
            : field === 'Duplicate'
              ? update.duplicate
              : field === 'Valid'
                ? update.valid
                : field === 'Admin Reviewed'
                  ? update.admin_reviewed
                  : null;

      if (updateValue === null) continue;

      if (value === 'yes' && !updateValue) return false;
      if (value === 'no' && updateValue) return false;
    }

    return true;
  });

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Admin: manage updates</h2>
        <SetDateRange />
      </div>

      <div className='flex items-center justify-between rounded-md border bg-card'>
        <AdminUpdateFilters
          filterTypes={filterTypes}
          selected={selectedFilters}
          setSelected={setSelectedFilters}
          metadataToggles={metadataToggles}
          setMetadataToggles={setMetadataToggles}
        />
        <div className='flex items-center gap-4 px-4'>
          <p className='text-sm font-medium'>
            {filteredUpdates.length} update
            {filteredUpdates.length === 1 ? '' : 's'}
          </p>
          <CopyToCsvButton data={filteredUpdates} />
        </div>
      </div>

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
        <AdminUpdatesDataTable updates={filteredUpdates} />
      )}
    </div>
  );
}
