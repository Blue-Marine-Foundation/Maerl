'use client';

import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Breadcrumbs from '@/_components/breadcrumbs';
import UpdateMedium from '@/_components/UpdateMedium';
import { Output, Measurable, Project } from '@/_lib/types';
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
    const { data: output, error } = await supabase
      .from('outputs')
      .select(
        '*, projects!inner(*), output_measurables!inner(*, impact_indicators (*))'
      )
      .eq('id', id)
      .single();

    if (output) {
      console.log(output);

      setOutput(output);
      setProject(output.projects);
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
        <Breadcrumbs currentPage={`Output ${code}`} />
      </div>

      <div className='p-6 mb-8 flex flex-col gap-4 bg-card-bg rounded-lg shadow'>
        <h2 className='text-xl font-semibold text-white'>
          {project && <span>{project.name} </span>}Output {code}
        </h2>
        {output && <p className='max-w-3xl'>{output.description}</p>}
      </div>
    </div>
  );
}
