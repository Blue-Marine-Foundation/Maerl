import { Table } from '@tanstack/react-table';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type FilterProps<TData> = {
  table: Table<TData>;
};

function formatColumnLabel(columnId: string) {
  if (columnId === 'pillars') return 'Strategic Goals';

  return columnId
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const ColumnVisibilityToggle = <TData,>({ table }: FilterProps<TData>) => {
  return (
    <Popover>
      <PopoverTrigger className='rounded-md border px-3 py-1'>
        Show/hide columns
      </PopoverTrigger>
      <PopoverContent className='flex flex-col gap-2'>
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <label key={column.id}>
                <input
                  type='checkbox'
                  className='capitalize'
                  checked={column.getIsVisible()}
                  onChange={(e) => column.toggleVisibility(e.target.checked)}
                />
                <span className='ml-2'>{formatColumnLabel(column.id)}</span>
              </label>
            );
          })}
      </PopoverContent>
    </Popover>
  );
};

export default ColumnVisibilityToggle;
