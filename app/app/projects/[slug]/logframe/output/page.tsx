'use client';

import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Breadcrumbs from '@/_components/breadcrumbs';
import UpdateMedium from '@/_components/UpdateMedium';
import { Output, Measurable, Project } from '@/_lib/types';
import sortOutputs from '@/lib/sortOutputs';

import Link from 'next/link';

export default function Output() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const id = searchParams.get('id');
  const code = searchParams.get('code');

  const [project, setProject] = useState<Project>();
  const [output, setOutput] = useState<Output>();
  const [thisOutput, setThisOutput] = useState<number>(0);
  const [otherOutputs, setOtherOutputs] = useState<Output[]>([]);
  const [previousOutput, setPreviousOutput] = useState<Output>();
  const [nextOutput, setNextOutput] = useState<Output>();
  const [updates, setUpdates] = useState<any[]>([]);

  const fetchOutput = async (id: string) => {
    const { data: output, error } = await supabase
      .from('outputs')
      .select(
        '*, projects!inner(*, outputs(id, code)), output_measurables!inner(*, impact_indicators (*))'
      )
      .eq('id', id)
      .single();

    if (output) {
      setOutput(output);
      setProject(output.projects);

      setOtherOutputs(sortOutputs(output.projects.outputs));
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
      otherOutputs.findIndex((item: Output) => item.code === output.code)
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
          <div className='flex items-center'>
            {previousOutput && (
              <Link
                href={`/app/projects/${project?.slug}/logframe/output?id=${previousOutput.id}&code=${previousOutput.code}`}
                className='px-4 py-2 border rounded-l-md'
              >
                &larr; Output {previousOutput.outputNumber}
              </Link>
            )}
            {nextOutput && (
              <Link
                href={`/app/projects/${project?.slug}/logframe/output?id=${nextOutput.id}&code=${nextOutput.code}`}
                className='px-4 py-2 border rounded-r-md'
              >
                Output {nextOutput.outputNumber} &rarr;
              </Link>
            )}
          </div>
        </div>

        {output && <p className='max-w-3xl'>{output.description}</p>}
      </div>

      <div>
        <ul className='list-disc pl-8'>
          {output &&
            output.output_measurables.map((om: Measurable) => {
              return (
                <li key={om.id} className='mb-2'>
                  {om.description.trim()}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
