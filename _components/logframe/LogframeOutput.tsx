import { createClient } from '@/_utils/supabase/server'
import { Measurable, Output } from '@/_lib/types'
import Tooltip from '../Tooltip'
import Link from 'next/link'
import ErrorState from '../ErrorState'

export default async function LogframeOutput({
  outputAnchor,
  project_slug,
  output,
}: {
  outputAnchor: string
  project_slug: string
  output: Output
}) {
  const supabase = createClient()

  const { data: outputIndicators, error } = await supabase
    .from('output_measurables')
    .select(`*, impact_indicators(*)`)
    .eq('output_id', output.id)

  if (error) {
    console.log(error)

    return <ErrorState message={error.message} />
  }

  return (
    <div id={outputAnchor} className="scroll-m-8">
      <div className="mb-4 flex justify-start items-center gap-8">
        <h3 className="text-xl font-semibold">
          Output {output.code.slice(2, 6)}
        </h3>
        {output.funding_requests && output.funding_requests.length > 0 && (
          <span className="px-2 py-1.5 text-xs bg-purple-700 text-white rounded shadow">
            Funding required
          </span>
        )}
      </div>

      <p className="text-lg max-w-2xl text-white font-medium mb-6">
        {output.description}{' '}
      </p>
      <ul className="shadow-md">
        {outputIndicators &&
          outputIndicators.map((om: Measurable) => {
            return (
              <li
                key={om.id}
                className="text-sm border-b first-of-type:rounded-t-lg last-of-type:border-b-transparent last-of-type:rounded-b-lg bg-card-bg"
              >
                <Link
                  href={`/projects/${project_slug}/logframe/output?id=${output.id}&code=${output.code}`}
                  className="p-4 flex justify-start items-baseline gap-12"
                >
                  <div className="w-[150px] shrink-0">
                    <h4 className="mb-2 font-semibold ">
                      Output {om.code.slice(2, 6)}
                    </h4>

                    <p className="text-xs text-foreground/80">
                      {om.impact_indicators && om.impact_indicators.id < 900 ? (
                        <Tooltip
                          tooltipContent={om.impact_indicators.indicator_title}
                          tooltipDirection="right"
                          tooltipWidth={320}
                        >
                          Impact indicator {om.impact_indicators.indicator_code}
                        </Tooltip>
                      ) : (
                        'Progress'
                      )}
                    </p>
                  </div>

                  <div className="grow">
                    <p className="leading-relaxed max-w-lg">{om.description}</p>
                  </div>

                  <div className="w-[200px]">
                    {om.target &&
                      om.impact_indicators &&
                      om.impact_indicators.indicator_unit && (
                        <p className="mt-2">
                          <span className="text-base font-semibold">
                            {om.target}
                          </span>{' '}
                          <br />
                          <span className="text-xs text-foreground/80">
                            {om.impact_indicators.indicator_unit}
                          </span>
                        </p>
                      )}
                  </div>
                </Link>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
