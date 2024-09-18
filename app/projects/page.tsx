import { createClient } from '@/_utils/supabase/server'
import { columns } from '@/components/projects-data-table/columns'
import { ProjectsDataTable } from '@/components/projects-data-table/projects-data-table'
import ErrorState from '@/_components/ErrorState'
// import BulkExportProjectData from '@/_components/bulk-upsert-project-data/bulk-upsert-project-data'

export default async function Projects() {
  const supabase = createClient()

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*, users(*)')
    .order('name')

  const parsedProjects = projects?.map(({ users, ...rest }) => {
    const project_manager = users ? `${users.first_name}` : null

    return {
      ...rest,
      project_manager,
    }
  })

  return (
    <div className="animate-in pt-6 pb-24">
      <div className="flex justify-between items-center gap-8">
        <h2 className="text-2xl font-bold mb-6">Projects</h2>
        {/* <BulkExportProjectData /> */}
      </div>

      {error ? (
        <ErrorState message={error.message} />
      ) : (
        parsedProjects && (
          <ProjectsDataTable columns={columns} data={parsedProjects} />
        )
      )}
    </div>
  )
}
