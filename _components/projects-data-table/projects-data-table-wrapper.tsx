'use client'

import { useQuery } from '@tanstack/react-query'
import { ProjectsDataTable } from './projects-data-table'
import { columns } from '@/components/projects-data-table/columns'
import fetchProjectList from './fetchProjectList'

export default function ProjectsDataTableWrapper() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjectList,
  })

  if (error) return <p>Error fetching projects</p>

  if (isLoading) return <p>Loading projects</p>

  if (!Array.isArray(data)) return <p>Unexpected data format</p>

  return <ProjectsDataTable columns={columns} data={data} />
}
