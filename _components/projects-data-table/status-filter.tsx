import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Table } from '@tanstack/react-table'

type FilterProps<TData> = {
  table: Table<TData>
}

const StatusFilter = <TData,>({ table }: FilterProps<TData>) => {
  const column = table.getColumn('project_status')

  const uniqueValues = ['Active', 'Complete', 'Pipeline']

  const filterValue = (column!.getFilterValue() as string[]) || uniqueValues

  const toggleFilterValue = (status: string) => {
    const updatedFilterValue = filterValue.includes(status)
      ? filterValue.filter((value) => value !== status)
      : [...filterValue, status]

    column!.setFilterValue(
      updatedFilterValue.length === uniqueValues.length
        ? undefined
        : updatedFilterValue
    )
  }

  return (
    <Popover>
      <PopoverTrigger className="border rounded-md px-3 py-1">
        Filter by status
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2">
        {uniqueValues.map((status) => (
          <label key={status}>
            <input
              type="checkbox"
              checked={filterValue.includes(status)}
              onChange={() => toggleFilterValue(status)}
            />
            <span className="ml-2">{status}</span>
          </label>
        ))}
      </PopoverContent>
    </Popover>
  )
}

export default StatusFilter
