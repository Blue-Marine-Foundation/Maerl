'use client';

import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import LogframeFeatureCard from '@/_components/logframe/LogframeFeatureCard';
import Update from '@/_components/UpdateMedium';
import { Measurable } from '@/_lib/types';

export default function Output() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const id = searchParams.get('id');
  const code = searchParams.get('code');

  const [project, setProject] = useState('');
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

    if (updates) {
      setProject(updates[0].projects.name);
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
    <div className='pt-1.5'>
      <div className='mb-16'>
        <h2 className='mb-8 text-lg font-medium'>
          {project} {code} Output Detail
        </h2>
        {output && (
          <LogframeFeatureCard
            key={output.code}
            project={project}
            id={output.id}
            type='Outputs'
            code={output.code}
            target={`${output.value} ${output.unit}`}
            verification={output.verification}
            assumption={output.assumptions}
          >
            <h4 className='text-white text-lg mb-8'>{output.description}</h4>
          </LogframeFeatureCard>
        )}
      </div>

      <div>
        <h2 className='mb-8 text-lg font-medium'>Relevant Updates</h2>
        {updates.map((update) => {
          return <Update key={update.id} update={update} />;
        })}
      </div>
    </div>
  );
}
