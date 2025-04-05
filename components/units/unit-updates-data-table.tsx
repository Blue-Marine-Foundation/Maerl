'use client';

import { columns } from '../updates/updates-table-columns';
import { DataTable } from '../data-tables/data-table';
import { Update } from '@/utils/types';

const filterableColumns = [
  { id: 'impact_indicator', label: 'Impact Indicator' },
  { id: 'type', label: 'Update Type' },
];

export default function UnitUpdatesDataTable({ data }: { data: Update[] }) {
  return (
    <DataTable<Update>
      data={data}
      columns={columns}
      filterableColumns={filterableColumns}
      enableDateFilter
      enableExport
    />
  );
}
