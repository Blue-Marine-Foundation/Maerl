import { Update } from '@/utils/types';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Update>[] = [
  {
    header: 'Project',
    accessorFn: (row) => row.projects?.name,
  },
];
