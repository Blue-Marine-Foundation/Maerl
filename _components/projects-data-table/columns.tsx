'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { ProjectMetadata } from '@/_lib/types'
import EditProjectMetadata from './edit-project-metadata'

export const columns: ColumnDef<ProjectMetadata>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: 'regional_strategy',
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Region
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      )
    },
  },
  {
    accessorKey: 'projectManager',
    header: 'PM',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'unitRequirements',
    header: 'Units',
    filterFn: 'includesString',
  },
  {
    id: 'edit',
    cell: ({ row }) => (
      <EditProjectMetadata project={row.original.slug.slice(0, 3)} />
    ),
    enableHiding: false,
  },
]
