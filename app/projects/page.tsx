import { createClient } from '@/_utils/supabase/server'
import { columns } from '@/components/projects-data-table/columns'
import { ProjectsDataTable } from '@/components/projects-data-table/projects-data-table'
import ErrorState from '@/_components/ErrorState'

export default async function Projects() {
  const supabase = createClient()

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*, users(*)')
    .order('name')

  const parsedProjects = projects?.map(
    ({ users, unit_requirements, ...rest }) => {
      const projectManager = users
        ? `${users.first_name} ${users.last_name}`
        : null

      return {
        ...rest,
        projectManager,
        units: unit_requirements,
      }
    }
  )

  return (
    <div className="animate-in pt-6 pb-24">
      <h2 className="text-2xl font-bold mb-6">Projects</h2>

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
