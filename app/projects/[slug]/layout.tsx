import { createClient } from '@/_utils/supabase/server'
import { Params } from '@/lib/types'
import ProjectNav from '@/components/navigation/ProjectNav'
import Link from 'next/link'
import dayjs from 'dayjs'

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Params
}) {
  const supabase = createClient()

  const { data: project, error } = await supabase
    .from('projects')
    .select('*, outputs (*), updates (*)')
    .eq('slug', params.slug)
    .single()

  if (error) {
    return (
      <div className="pb-20 flex flex-col gap-4">
        <div className="flex justify-between items-center gap-12">
          <h2 className="text-2xl font-bold">{params.slug}</h2>
          <p className="px-2 py-1 text-sm bg-card-bg rounded-md">
            Error loading project metadata
          </p>
        </div>

        <hr className="mb-4" />
        {children}
      </div>
    )
  }

  const updates = project.updates
    ? project.updates.sort(
        // @ts-ignore
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    : null

  if (project) {
    return (
      <>
        <div className="flex justify-between items-center gap-4 py-4 border-b border-foreground/10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-medium">
              <Link href={`/projects/${params.slug}`}>{project.name}</Link>
            </h2>

            <ProjectNav slug={params.slug} />
          </div>

          <div className="flex items-center gap-4 text-sm">
            <p className="">
              Last updated{' '}
              {updates && updates.length > 0
                ? dayjs(updates[0].date).format("DD MMM 'YY")
                : 'never'}
            </p>
            <span
              style={{
                background: project.highlight_color,
              }}
              className="px-2 py-1 text-sm font-medium text-background rounded-md"
            >
              Project {project.id}
            </span>
          </div>
        </div>

        <div className="pt-6 pb-16">{children}</div>
      </>
    )
  }
}
