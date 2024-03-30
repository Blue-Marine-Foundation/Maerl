'use client';

import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Breadcrumbs from '@/_components/breadcrumbs';
import { Output, Measurable, Project, Update } from '@/_lib/types';
import sortOutputs from '@/lib/sortOutputs';
import Tooltip from '@/_components/Tooltip';
import Link from 'next/link';
import UpdateMediumNested from '@/_components/UpdateMediumNested';

export default function Output() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const id = searchParams.get('id');
  const code = searchParams.get('code');

  const [project, setProject] = useState<Project>();
  const [output, setOutput] = useState<Output>();
  const [outputIndicators, setOutputIndicators] = useState<Measurable[]>();
  const [thisOutput, setThisOutput] = useState<number>(0);
  const [otherOutputs, setOtherOutputs] = useState<Output[]>([]);
  const [previousOutput, setPreviousOutput] = useState<Output>();
  const [nextOutput, setNextOutput] = useState<Output>();
  const [updates, setUpdates] = useState<Update[]>([]);

  const fetchOutput = async (id: string) => {
    const { data: output, error } = await supabase
      .from('outputs')
      .select(
        '*, projects(*, outputs(id, code)), output_measurables(*, updates(*), impact_indicators (*))'
      )
      .eq('id', id)
      .single();

    if (output) {
      setOutput(output);
      setProject(output.projects);
      setOutputIndicators(sortOutputs(output.output_measurables));
      setOtherOutputs(sortOutputs(output.projects.outputs));

      const flatUpdates = output.output_measurables.flatMap(
        (om: { updates: any }) => {
          return om.updates;
        }
      );

      console.log(flatUpdates);

      setUpdates(flatUpdates);
    }

    if (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    id && fetchOutput(id);
  }, [id]);

  useEffect(() => {
    setThisOutput(
      otherOutputs.findIndex((item: Output) => item.code === output?.code)
    );
  }, [otherOutputs]);

  useEffect(() => {
    if (output && thisOutput === 0) {
      setPreviousOutput(undefined);
      setNextOutput(otherOutputs[1]);
    }

    if (output && thisOutput === otherOutputs.length - 1) {
      setPreviousOutput(otherOutputs.at(-2));
      setNextOutput(undefined);
    }

    if (output && thisOutput !== 0 && thisOutput !== otherOutputs.length - 1) {
      setPreviousOutput(otherOutputs[thisOutput - 1]);
      setNextOutput(otherOutputs[thisOutput + 1]);
    }
  }, [thisOutput]);

  return (
    <div className='animate-in pb-24'>
      <div className='mb-8'>
        <Breadcrumbs currentPage={`Output ${code}`} />
      </div>

      <div className='p-6 mb-8 flex flex-col gap-4 bg-card-bg rounded-lg shadow'>
        <div className='flex justify-between items-center gap-8'>
          <h2 className='text-xl font-semibold text-white'>
            {project && <span>{project.name} </span>}Output {code}
          </h2>
          <div className='flex items-center gap-4 text-sm'>
            {previousOutput && (
              <Link
                href={`/app/projects/${project?.slug}/logframe/output?id=${previousOutput.id}&code=${previousOutput.code}`}
                className='px-4 py-1.5 rounded-md border bg-card-bg hover:bg-background/70 shadow-md transition-all'
              >
                &larr;&nbsp; Output {previousOutput.outputNumber}
              </Link>
            )}
            {nextOutput && (
              <Link
                href={`/app/projects/${project?.slug}/logframe/output?id=${nextOutput.id}&code=${nextOutput.code}`}
                className='px-4 py-1.5 rounded-md border bg-card-bg hover:bg-background/70 shadow-md transition-all'
              >
                Output {nextOutput.outputNumber} &nbsp;&rarr;
              </Link>
            )}
          </div>
        </div>

        {output && <p className='max-w-3xl'>{output.description}</p>}

        <ul className='bg-card-bg text-sm'>
          {outputIndicators &&
            outputIndicators.map((indicator: Measurable) => {
              return (
                <li
                  key={indicator.id}
                  className='px-4 py-3 flex justify-between items-baseline gap-4 border border-b-0 first:rounded-t-md last:border-b last:rounded-b-md'
                >
                  <div className='shrink-0 w-[50px]'>
                    {indicator.code.trim()}
                  </div>
                  <div className='max-w-2xl'>
                    {indicator.description.trim()}
                  </div>
                  <div className='flex-grow'></div>
                  {indicator.impact_indicators.indicator_code ? (
                    <Tooltip
                      tooltipContent={
                        indicator.impact_indicators.indicator_title
                      }
                      tooltipWidth={380}
                      tooltipDirection='right'
                    >
                      Impact indicator{' '}
                      {indicator.impact_indicators.indicator_code}
                    </Tooltip>
                  ) : (
                    <span>Progress</span>
                  )}
                  {/* <div className='ml-4'>Add update</div> */}
                </li>
              );
            })}
        </ul>
      </div>

      {updates &&
        updates.map((update) => (
          <UpdateMediumNested
            key={update.id}
            update={update}
            project={project}
          />
        ))}
    </div>
  );
}
