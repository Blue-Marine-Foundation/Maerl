import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Table } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { useState } from 'react';

type FilterProps<TData> = {
  table: Table<TData>;
  columnId: string;
  label?: string;
  type?: 'text' | 'list';
};

export default function ColumnFilter<TData>({
  table,
  columnId,
  label,
  type = 'list',
}: FilterProps<TData>) {
  const [searchTerm, setSearchTerm] = useState('');
  const column = table.getColumn(columnId);

  const uniqueValues = Array.from(
    new Set(
      table
        .getPreFilteredRowModel()
        .rows.map((row) => row.getValue(columnId))
        .filter(
          (value): value is string => value !== null && value !== undefined,
        ),
    ),
  ).sort();

  const filterValue = (column?.getFilterValue() as string[]) || uniqueValues;

  const filteredValues = uniqueValues.filter((value) =>
    value.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleAll = () => {
    if (filterValue.length === uniqueValues.length) {
      column?.setFilterValue([]);
    } else {
      column?.setFilterValue(uniqueValues);
    }
  };

  const toggleFilterValue = (status: string) => {
    const updatedFilterValue = filterValue.includes(status)
      ? filterValue.filter((value) => value !== status)
      : [...filterValue, status];

    column?.setFilterValue(
      updatedFilterValue.length === 0 ? undefined : updatedFilterValue,
    );
  };

  const defaultLabel = columnId
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (type === 'text') {
    return (
      <div className='flex items-center gap-2'>
        <input
          type='text'
          placeholder={`Search ${label?.toLowerCase() || columnId}...`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            table.getColumn(columnId)?.setFilterValue(e.target.value);
          }}
          className='w-full rounded-md border px-3 py-1'
        />
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger className='rounded-md border px-5 py-2 text-sm hover:bg-sky-500/20'>
        {label || defaultLabel}
      </PopoverTrigger>
      <PopoverContent className='w-[250px]'>
        <div className='relative mb-2 flex items-baseline justify-between gap-2'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <input
            type='text'
            placeholder='Search...'
            className='w-full rounded-md border bg-background py-2 pl-8 pr-2 text-sm'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className='max-h-[400px] overflow-y-auto text-sm'>
          {filteredValues.length > 0 && (
            <label className='mb-2 flex cursor-pointer items-center rounded p-1 hover:bg-sky-500/20'>
              <input
                type='checkbox'
                checked={filterValue.length === uniqueValues.length}
                onChange={toggleAll}
                className='rounded'
              />
              <span className='ml-2'>Select all</span>
            </label>
          )}

          {filteredValues.map((value: string) => (
            <label
              key={value}
              className='flex cursor-pointer items-center rounded p-1 hover:bg-sky-500/20'
            >
              <input
                type='checkbox'
                checked={filterValue.includes(value)}
                onChange={() => toggleFilterValue(value)}
                className='rounded'
              />
              <span className='ml-2 inline-block max-w-[190px] truncate'>
                {value}
              </span>
            </label>
          ))}
          {filteredValues.length === 0 && (
            <p className='p-2 text-sm text-gray-500'>No matching items</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
