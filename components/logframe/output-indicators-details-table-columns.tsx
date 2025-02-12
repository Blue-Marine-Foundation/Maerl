import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import { Menu, MenuItems, MenuButton, MenuItem } from '@headlessui/react';
import { OutputMeasurable } from '@/utils/types';
import { ColumnDef } from '@tanstack/react-table';

export const createColumns = (
  toggleRow: (rowId: string) => void,
  expandedRows: Record<string, boolean>,
  handleEditMeasurable: (measurable: OutputMeasurable) => void,
): ColumnDef<OutputMeasurable, any>[] => [
  {
    accessorKey: 'description',
    header: 'Measurable Indicator',
    cell: ({ row }) => (
      <div className='flex flex-row items-start gap-4'>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleRow(row.id);
          }}
          className='mt-1.5'
        >
          {expandedRows[row.id] ? (
            <ChevronDown className='h-4 w-4' />
          ) : (
            <ChevronUp className='h-4 w-4' />
          )}
        </button>
        <div className='mt-1'>
          <Badge className='bg-slate-800 py-1.5 font-medium'>
            {row.original.code}
          </Badge>
        </div>
        <p className='text-sm'>{row.getValue('description')}</p>
      </div>
    ),
    size: 400,
  },
  {
    accessorKey: 'verification',
    header: 'Verification',
    size: 300,
  },
  {
    accessorKey: 'assumptions',
    header: 'Assumptions',
    size: 300,
  },
  {
    accessorKey: 'target',
    header: 'Target',
    size: 50,
  },
  {
    accessorKey: 'impact_indicator_id',
    header: 'Impact Indicator',
    cell: ({ row }) => (
      <p
        title={row.original.impact_indicators?.indicator_title}
        className='hover:cursor-help'
      >
        {row.original.impact_indicators?.indicator_code}
      </p>
    ),
    size: 50,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Menu as='div' className='relative'>
        <MenuButton
          className='flex items-center justify-center rounded-md p-2 hover:bg-slate-800/50'
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className='h-4 w-4' />
        </MenuButton>
        <MenuItems
          className='absolute z-[9999] mt-2 w-36 origin-top-right rounded-md bg-slate-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
          onClick={(e) => e.stopPropagation()}
          anchor='bottom end'
        >
          <MenuItem>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-slate-800' : ''
                } flex w-full items-center px-4 py-2 text-sm text-slate-300`}
                onClick={() => {
                  /* TODO: Implement add update */
                }}
              >
                Add Update
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-slate-800' : ''
                } flex w-full items-center px-4 py-2 text-sm text-slate-300`}
                onClick={() => {
                  /* TODO: Implement add activity */
                }}
              >
                Add Activity
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-slate-800' : ''
                } flex w-full items-center px-4 py-2 text-sm text-slate-300`}
                onClick={() => handleEditMeasurable(row.original)}
              >
                Edit Measurable
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Menu>
    ),
    size: 50,
  },
];
