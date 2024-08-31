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
    accessorKey: 'start_date',
    header: 'Started',
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
    accessorKey: 'pillars',
    header: 'Pillars',
  },
  {
    accessorKey: 'projectManager',
    header: 'PM',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'support',
    header: 'Support',
  },
  {
    accessorKey: 'units',
    header: 'Units',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'local_contacts',
    header: 'Local Contacts',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          {row.original.local_partners &&
            row.original.local_partners.map((partner) => {
              return (
                <p key={partner.organisation}>
                  {partner.organisation ? partner.organisation : partner.person}
                </p>
              )
            })}
        </div>
      )
    },
  },
  {
    accessorKey: 'highlights',
    header: 'Highlights',
  },
  {
    accessorKey: 'current_issues',
    header: 'Current Issues',
  },
  {
    accessorKey: 'proposed_solutions',
    header: 'Proposed Solutions',
  },
  {
    accessorKey: 'board_intervention_required',
    header: 'Board Intervention Required',
  },
  {
    id: 'edit',
    cell: ({ row }) => <EditProjectMetadata project={row.original.slug} />,
    enableHiding: false,
  },
]
