'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProjectsDataTableWrapper from './projects-data-table-wrapper'

export default function ProjectsQueryWrapper() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ProjectsDataTableWrapper />
    </QueryClientProvider>
  )
}
