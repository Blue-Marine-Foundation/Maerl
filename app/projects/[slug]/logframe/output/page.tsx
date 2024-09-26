'use client'

import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import Breadcrumbs from '@/_components/breadcrumbs'
import { Output, Measurable, Project } from '@/_lib/types'
import sortOutputs from '@/lib/sortOutputs'
import Tooltip from '@/_components/Tooltip'
import Link from 'next/link'
import OutputUpdatesWrapper from '@/_components/OutputUpdatesWrapper'
import QuickUpdateModal from '@/_components/QuickUpdateForm/QuickUpdateModal'
import ErrorState from '@/_components/ErrorState'
import FundingRequestModal from '@/_components/FundingRequestForm/FundingRequestModal'
import * as d3 from 'd3'

export default function OutputPage() {
  const supabase = createClient()
  const searchParams = useSearchParams()

  const id = searchParams.get('id')
  const code = searchParams.get('code')

  const [project, setProject] = useState<Project>()
  const [output, setOutput] = useState<Output>()
  const [outputIndicators, setOutputIndicators] = useState<Measurable[]>()
  const [thisOutput, setThisOutput] = useState<number>(0)
  const [otherOutputs, setOtherOutputs] = useState<Output[]>([])
  const [previousOutput, setPreviousOutput] = useState<Output>()
  const [nextOutput, setNextOutput] = useState<Output>()
  const [fundingRequests, setFundingRequests] = useState<any[]>()

  const [user, setUser] = useState<any>()
  const [userError, setUserError] = useState<any>()
  const [outputError, setOutputError] = useState<any>()

  const fetchUser = async () => {
    const { data: user, error: userError } = await supabase.auth.getUser()

    if (userError) {
      setUser(null)
      setUserError(userError.message)
    }

    if (user) {
      setUserError(null)
      setUser(user.user!.id)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchOutput = async (id: string) => {
    const { data: output, error } = await supabase
      .from('outputs')
      .select(
        '*, projects(*, outputs(id, code)), output_measurables(*, impact_indicators (*)), funding_requests(*)'
      )
      .eq('id', id)
      .single()

    if (error) {
      console.log(error)
      setOutputError(error.message)
    }

    if (output) {
      setOutput(output)
      setProject(output.projects)
      setOutputIndicators(sortOutputs(output.output_measurables))
      setOtherOutputs(sortOutputs(output.projects.outputs))
      setFundingRequests(output.funding_requests)
    }
  }

  useEffect(() => {
    id && fetchOutput(id)
  }, [id])

  useEffect(() => {
    setThisOutput(
      otherOutputs.findIndex((item: Output) => item.code === output?.code)
    )
  }, [otherOutputs])

  useEffect(() => {
    if (output && thisOutput === 0) {
      setPreviousOutput(undefined)
      setNextOutput(otherOutputs[1])
    }

    if (output && thisOutput === otherOutputs.length - 1) {
      setPreviousOutput(otherOutputs.at(-2))
      setNextOutput(undefined)
    }

    if (output && thisOutput !== 0 && thisOutput !== otherOutputs.length - 1) {
      setPreviousOutput(otherOutputs[thisOutput - 1])
      setNextOutput(otherOutputs[thisOutput + 1])
    }
  }, [thisOutput])

  return (
    <div className="animate-in pb-24 flex flex-col gap-8">
      <div>
        <Breadcrumbs currentPage={`Output ${code}`} />
      </div>

      <div className="p-4 flex flex-col gap-4 bg-card-bg rounded-lg shadow">
        <div className="mb-4 flex justify-between items-center gap-4">
          <div className="mb-4 flex justify-start items-center gap-8">
            <h2 className="text-xl font-semibold text-white">
              Output {code?.split('.').pop()}
            </h2>
            {output &&
              output.funding_requests &&
              output.funding_requests.length > 0 && (
                <span className="px-2 py-1.5 text-xs bg-purple-700 text-white rounded shadow">
                  Funding required
                </span>
              )}
          </div>

          <div className="flex items-center gap-4 text-sm">
            {output && project && user && (
              <FundingRequestModal
                project={project}
                output={output}
                userId={user}
              />
            )}
            {previousOutput && (
              <Link
                href={`/projects/${project?.slug}/logframe/output?id=${previousOutput.id}&code=${previousOutput.code}`}
                className="px-4 py-1.5 rounded-md border bg-card-bg hover:bg-background/70 shadow-md transition-all"
              >
                &larr;&nbsp; Output {previousOutput.outputNumber}
              </Link>
            )}
            {nextOutput && (
              <Link
                href={`/projects/${project?.slug}/logframe/output?id=${nextOutput.id}&code=${nextOutput.code}`}
                className="px-4 py-1.5 rounded-md border bg-card-bg hover:bg-background/70 shadow-md transition-all"
              >
                Output {nextOutput.outputNumber} &nbsp;&rarr;
              </Link>
            )}
          </div>
        </div>

        {(outputError || userError) && (
          <div className="p-4 mb-8 flex flex-col gap-4 bg-card-bg rounded-lg shadow">
            <ErrorState
              message={`It's likely that this Output doesn't exist in the project
              logframe. Error message: ${outputError} ${userError}`}
            />
          </div>
        )}

        {!outputError && output && (
          <>
            <p className="font-medium max-w-3xl mb-2">{output.description}</p>

            <ul className="mb-4 bg-card-bg text-sm">
              {outputIndicators &&
                outputIndicators.map((indicator: Measurable) => {
                  return (
                    <li
                      key={indicator.id}
                      className="p-4 flex justify-between items-center gap-4 border border-b-0 first:rounded-t-md last:border-b last:rounded-b-md"
                    >
                      <div className="w-[150px] shrink-0">
                        <p className="mb-1.5 font-medium">
                          Output {indicator.code.slice(2, 6)}
                        </p>
                        <p className="text-xs text-foreground/80">
                          {indicator.impact_indicators.indicator_code &&
                          indicator.impact_indicators.id < 900 ? (
                            <Tooltip
                              tooltipContent={
                                indicator.impact_indicators.indicator_title
                              }
                              tooltipWidth={380}
                              tooltipDirection="left"
                            >
                              Impact indicator{' '}
                              {indicator.impact_indicators.indicator_code}
                            </Tooltip>
                          ) : (
                            'Progress'
                          )}
                        </p>
                      </div>
                      <div className="grow pr-2">
                        <p className="max-w-lg">
                          {indicator.description
                            ? indicator.description.trim()
                            : 'Indicator description tbc'}
                        </p>
                      </div>
                      <div className="w-[350px] shrink-0 text-xs flex flex-col gap-2">
                        {indicator.target &&
                          indicator.impact_indicators &&
                          indicator.impact_indicators.indicator_unit && (
                            <p>
                              <span className="mr-2 text-sm font-semibold">
                                {indicator.target}
                              </span>
                              <span>
                                {indicator.impact_indicators.indicator_unit}
                              </span>
                            </p>
                          )}
                      </div>

                      <div className="ml-4 shrink-0 w-[100px]">
                        <QuickUpdateModal
                          // @ts-ignore
                          project={project}
                          output={indicator}
                          userId={user}
                        />
                      </div>
                    </li>
                  )
                })}
            </ul>
          </>
        )}
      </div>

      {fundingRequests && fundingRequests.length > 0 && (
        <div className="">
          <h2 className="mb-4 px-4 text-xl font-medium">Funding requests</h2>
          <div className="grid grid-cols-3 gap-8">
            {fundingRequests.map((request) => {
              return (
                <div
                  key={request.id}
                  className="p-4 bg-card-bg shadow rounded-md"
                >
                  <div className="mb-4 text-sm text-foreground/80 flex justify-between items-center gap-4">
                    <p>{d3.timeFormat('%d %b %Y')(new Date(request.date))}</p>
                    <p>
                      <span className="pr-2 text-xs">{request.currency}</span>
                      {d3.format(',.0f')(request.amount)}
                    </p>
                  </div>
                  <p className="w-full max-w-lg text-sm">{request.detail}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!outputError && output && <OutputUpdatesWrapper output={output.id} />}
    </div>
  )
}
