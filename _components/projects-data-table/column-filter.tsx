import { Table } from '@tanstack/react-table'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type FilterProps<TData> = {
  table: Table<TData>
}

const ColumnFilter = <TData,>({ table }: FilterProps<TData>) => {
  return (
    <Popover>
      <PopoverTrigger className="border rounded-md px-3 py-1">
        Show/hide columns
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <label key={column.id}>
                <input
                  type="checkbox"
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onChange={(e) => column.toggleVisibility(e.target.checked)}
                />
                <span className="ml-2">
                  {column.id
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </span>
              </label>
            )
          })}
      </PopoverContent>
    </Popover>
  )
}

export default ColumnFilter
