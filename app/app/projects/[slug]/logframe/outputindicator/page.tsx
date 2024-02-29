'use client';

import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Breadcrumbs from '@/_components/breadcrumbs';
import UpdateMedium from '@/_components/UpdateMedium';
import { Measurable, Project } from '@/_lib/types';
import Link from 'next/link';

export default function Output() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const id = searchParams.get('id');
  const code = searchParams.get('code');

  const [project, setProject] = useState<Project>();
  const [output, setOutput] = useState<Measurable>();
  const [updates, setUpdates] = useState<any[]>([]);

  const fetchOutput = async (id: string) => {
    const { data: updates, error } = await supabase
      .from('updates')
      .select(
        '*, projects!inner(*), output_measurables!inner(*, impact_indicators (*))'
      )
      .order('date', { ascending: false })
      .eq('output_measurables.id', id);

    if (updates && updates.length > 0) {
      setProject(updates[0].projects);
      console.log(updates[0].output_measurables);
      setOutput(updates[0].output_measurables);
      setUpdates(updates);
    }

    if (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    id && fetchOutput(id);
  }, []);

  return (
    <div className='animate-in pb-24'>
      <div className='mb-8'>
        <Breadcrumbs currentPage={`Output Indicator ${code}`} />
      </div>

      <div className='p-8 mb-8 bg-card-bg rounded-lg shadow'>
        <h2 className='mb-4 text-2xl font-semibold text-white'>
          {project && <span>{project.name} </span>}Output {code}
        </h2>

        {output && (
          <div className=''>
            <p className='mb-8 max-w-2xl text-lg'>{output.description}</p>

            <div className='text-sm'>
              <dl className='mb-4 flex justify-start items-baseline gap-4'>
                <dt className='mb-2 text-foreground/80 w-[150px]'>Impact</dt>
                <dd>
                  {output.value}{' '}
                  {output.verification && <span>/ {output.target}</span>}{' '}
                  {output.unit}{' '}
                </dd>
              </dl>

              <dl className='mb-4 flex justify-start items-baseline gap-4'>
                <dt className='mb-2 text-foreground/80 w-[150px]'>
                  Impact Indicator
                </dt>
                <dd>
                  {output.impact_indicators ? (
                    <span>
                      {output.impact_indicators.indicator_code} &mdash;{' '}
                      {output.impact_indicators.indicator_title}{' '}
                    </span>
                  ) : (
                    'Progress'
                  )}
                </dd>
              </dl>

              <dl className='mb-4 flex justify-start items-baseline gap-4'>
                <dt className='mb-2 text-foreground/80 w-[150px]'>
                  Verified by
                </dt>
                <dd>
                  {output.verification && <span>{output.verification}</span>}
                </dd>
              </dl>

              <dl className='mb-4 flex justify-start items-baseline gap-4'>
                <dt className='mb-2 text-foreground/80 w-[150px]'>
                  Assumptions
                </dt>
                <dd>
                  {output.assumptions && <span>{output.assumptions}</span>}
                </dd>
              </dl>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className='mb-4 flex justify-between items-center gap-8'>
          <h2 className='text-lg font-medium'>Relevant Updates</h2>
          <Link
            href={`/app/newupdate?project=${project && project.id}&output=${
              output && output.id
            }`}
            className='px-4 py-2 flex justify-between items-center gap-2 text-sm rounded-md bg-btn-background hover:bg-btn-background-hover transition-all duration-500'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
              className=''
            >
              <path d='M5 12h14' />
              <path d='M12 5v14' />
            </svg>{' '}
            <span>Add Update</span>
          </Link>
        </div>
        {updates.map((update) => {
          return <UpdateMedium key={update.id} update={update} />;
        })}
      </div>
    </div>
  );
}
