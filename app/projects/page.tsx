import ProjectsQueryWrapper from '@/_components/projects-data-table/projects-data-table-query-provider'
// import BulkExportProjectData from '@/_components/bulk-upsert-project-data/bulk-upsert-project-data'

export default async function Projects() {
  return (
    <div className="animate-in pt-6 pb-24">
      <div className="flex justify-between items-center gap-8">
        <h2 className="text-2xl font-bold mb-6">Projects</h2>
        {/* <BulkExportProjectData /> */}
      </div>

      <ProjectsQueryWrapper />
    </div>
  )
}
