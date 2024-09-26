import { Table } from '@tanstack/react-table'

type FilterProps<TData> = {
  table: Table<TData>
}

const ProjectTypeFilter = <TData,>({ table }: FilterProps<TData>) => {
  const column = table.getColumn('project_type')

  const filterOptions = ['Project', 'Workstream']

  const filterValue = (column!.getFilterValue() as string[]) || filterOptions

  const toggleFilterValue = (value: string) => {
    const updatedFilterValue = filterValue.includes(value)
      ? filterValue.filter((item) => item !== value)
      : [...filterValue, value]

    column!.setFilterValue(
      updatedFilterValue.length === 0 ? undefined : updatedFilterValue
    )
  }

  return (
    <div className="flex gap-8 pl-3 text-sm">
      {filterOptions.map((option) => (
        <button
          key={option}
          onClick={() => toggleFilterValue(option)}
          className={`border-l-2 pl-2 ${option === 'Project' ? 'border-blue-500' : 'border-yellow-500'} ${
            filterValue.includes(option)
              ? 'text-foreground'
              : 'text-foreground/50 border-opacity-40'
          }`}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
  )
}

export default ProjectTypeFilter
