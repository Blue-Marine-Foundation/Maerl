import { createClient } from '@/_utils/supabase/server'
import { Params, Output } from '@/lib/types'
import LogframeImpactSection from '@/_components/logframe/LogframeImpactSection'
import LogframeOutcomeSection from '@/_components/logframe/LogframeOutcomeSection'
import LogframeOutput from '@/_components/logframe/LogframeOutput'
import Link from 'next/link'

export default async function Logframe({ params }: { params: Params }) {
  const supabaseClient = createClient()
  const { data: project, error } = await supabaseClient
    .from('projects')
    .select(`*, outputs (*, funding_requests(*))`)
    .eq('slug', params.slug)
    .single()

  if (error) {
    return (
      <div className="animate-in pb-24">
        <h2 className="text-xl font-medium mb-4 text-white">Logframe</h2>
        <p>Error fetching logframe: {error.message}</p>
      </div>
    )
  }

  const sections = [
    {
      name: 'Impact',
      slug: 'impact',
    },
    {
      name: 'Outcome',
      slug: 'outcome',
    },
  ]

  const outputs = project.outputs
    .sort((a: Output, b: Output) => {
      const aNumber = parseInt(a.code.split('.').pop() || '0')
      const bNumber = parseInt(b.code.split('.').pop() || '0')

      return aNumber - bNumber
    })
    .sort((a: Output, b: Output) => a.code.localeCompare(b.code))

  const outputLinks = outputs.map((output: Output) => {
    return {
      name: `Output ${output.code}`,
      slug: `output${output.code.replace('.', '')}`,
    }
  })

  const sidenav = [...sections, ...outputLinks]

  if (project.stub) {
    return (
      <div className="flex flex-col items-stretch gap-4">
        <div className="mb-4 bg-card-bg p-16 flex flex-col items-center gap-8 rounded-lg">
          <p>No project logframe uploaded yet</p>
          <p>
            <Link
              href={`/projects/${project.slug}/updates`}
              className="underline"
            >
              View project updates
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-in pb-24">
      <h2 className="text-xl font-medium mb-8 text-white">Logframe</h2>

      <div className="relative flex justify-between items-start gap-8">
        <ul className="basis-1/6 shrink-0 sticky top-8">
          {sidenav.map((item) => {
            return (
              <li key={item.name} className="mb-4">
                <a href={`#${item.slug}`} className="underline scroll-smooth">
                  {item.name}
                </a>
              </li>
            )
          })}
        </ul>
        <div className="grow flex flex-col justify-between gap-12">
          <LogframeImpactSection project_slug={params.slug} />
          <LogframeOutcomeSection project_slug={params.slug} />

          {project.outputs.map((output: Output) => {
            return (
              <LogframeOutput
                key={output.code}
                outputAnchor={`output${output.code.replace('.', '')}`}
                project_slug={params.slug}
                output={output}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
