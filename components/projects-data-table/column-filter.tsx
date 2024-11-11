import React, { useEffect } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Table } from '@tanstack/react-table';

type FilterProps<TData> = {
  table: Table<TData>;
  columnId: string;
};

function ColumnFilter<TData>({ table, columnId }: FilterProps<TData>) {
  const column = table.getColumn(columnId);

  const uniqueValues = React.useMemo(() => {
    return Array.from(
      new Set(
        table.getPreFilteredRowModel().rows.map((row) => {
          const value = row.getValue(columnId);
          return value === '' || value === null ? 'none' : value;
        }) as string[],
      ),
    ).sort((a, b) =>
      a === 'none' ? -1 : b === 'none' ? 1 : a.localeCompare(b),
    );
  }, [table, columnId]);

  const [filterValue, setFilterValue] = React.useState<string[]>(uniqueValues);

  useEffect(() => {
    column?.setFilterValue(filterValue);
  }, [column, filterValue]);

  const toggleFilterValue = (status: string) => {
    if (status === 'all') {
      setFilterValue(
        filterValue.length === uniqueValues.length ? [] : uniqueValues,
      );
    } else {
      setFilterValue((prev) =>
        prev.includes(status)
          ? prev.filter((value) => value !== status)
          : [...prev, status],
      );
    }
  };

  const isAllSelected = filterValue.length === uniqueValues.length;

  return (
    <Popover>
      <PopoverTrigger className='rounded-md border px-3 py-1'>
        {columnId
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')}
      </PopoverTrigger>
      <PopoverContent className='flex flex-col gap-2'>
        <label>
          <input
            type='checkbox'
            checked={isAllSelected}
            onChange={() => toggleFilterValue('all')}
          />
          <span className='ml-2'>All</span>
        </label>
        {uniqueValues.map((columnName: string) => {
          return (
            <label key={columnName}>
              <input
                type='checkbox'
                checked={filterValue.includes(columnName)}
                onChange={() => toggleFilterValue(columnName)}
              />
              <span className='ml-2'>{columnName}</span>
            </label>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export default ColumnFilter;
