import React, { useEffect, useMemo } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Table } from '@tanstack/react-table';

type ListFilterProps<TData> = {
  table: Table<TData>;
  columnId: string;
};

function ListColumnFilter<TData>({ table, columnId }: ListFilterProps<TData>) {
  const column = table.getColumn(columnId);

  const uniqueValues = useMemo(() => {
    const allValues = table.getPreFilteredRowModel().rows.flatMap((row) => {
      const value = row.getValue(columnId) as string | null;
      if (value === null || value === '') {
        return ['None'];
      }
      return value.split(',').map((item) => item.trim());
    });
    return Array.from(new Set(allValues)).sort((a, b) => {
      if (a === 'None') return -1;
      if (b === 'None') return 1;
      return a.localeCompare(b);
    });
  }, [table, columnId]);

  const [filterValue, setFilterValue] = React.useState<string[]>(uniqueValues);

  useEffect(() => {
    column?.setFilterValue(filterValue.length === 0 ? null : filterValue);
  }, [column, filterValue]);

  const toggleFilterValue = (value: string) => {
    setFilterValue((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const toggleAll = () => {
    setFilterValue(
      filterValue.length === uniqueValues.length ? [] : uniqueValues,
    );
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
      <PopoverContent className='flex max-h-60 flex-col gap-2 overflow-y-auto'>
        <label>
          <input type='checkbox' checked={isAllSelected} onChange={toggleAll} />
          <span className='ml-2'>All</span>
        </label>
        {uniqueValues.map((value: string) => (
          <label key={value}>
            <input
              type='checkbox'
              checked={filterValue.includes(value)}
              onChange={() => toggleFilterValue(value)}
            />
            <span className='ml-2'>{value}</span>
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export default ListColumnFilter;
