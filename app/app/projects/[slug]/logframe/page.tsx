import { createClient } from '@/_utils/supabase/server';
import { Params, Output, Measurable } from '@/lib/types';
import { ReactNode } from 'react';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className='mb-16 flex justify-start items-start gap-8'>
      <div className='basis-1/6'>
        <h3 className='text-xl font-medium text-foreground/80'>{title}</h3>
      </div>

      <div className='basis-5/6'>{children}</div>
    </div>
  );
}

export default async function Project({ params }: { params: Params }) {
  const supabaseClient = createClient();
  const { data: projects, error } = await supabaseClient
    .from('projects')
    .select(
      `*,impacts (*),outcomes (*),outcome_measurables (*), outputs (*, output_measurables (*)), updates (*)`
    )
    .eq('name', params.slug)
    .limit(1);

  if (!projects) {
    return <p>Error fetching logframe</p>;
  }

  const project = projects[0];

  return (
    <div className='animate-in'>
      <Section title='Impact'>
        <p className='text-2xl font-medium text-gray-100 max-w-xl'>
          {project.impacts[0] && project.impacts[0].title}
        </p>
      </Section>

      <Section title='Outcome'>
        <>
          <p className='text-xl mb-8 font-medium text-gray-100 max-w-2xl'>
            {project.outcomes[0] && project.outcomes[0].description}
          </p>
          <table className='table-auto text-sm'>
            <thead>
              <tr className='border-t'>
                <th colSpan={2} className='text-left p-2'>
                  Measured by
                </th>
                <th className='text-left p-2 pl-4'>Verified by</th>
              </tr>
            </thead>
            <tbody>
              {project.outcome_measurables.map((measurable: Measurable) => {
                return (
                  <tr key={measurable.code} className='border-t'>
                    <td className='p-2 align-top'>{measurable.code}</td>
                    <td className='p-2 align-top'>{measurable.description}</td>
                    <td className='p-2 pl-4 align-top'>
                      {measurable.verification}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      </Section>

      <Section title='Outputs'>
        {project.outputs.map((output: Output) => (
          <div key={output.code} className='mb-16'>
            <h4 className='text-lg mb-2 font-mono font-bold'>{output.code}</h4>
            <p className='text-xl max-w-2xl mb-8'>{output.description}</p>
            {output.output_measurables?.map((om) => {
              return (
                <div key={om.id} className='p-8 mb-8 rounded-md bg-card-bg'>
                  <div className='flex gap-4 mb-8 text-sm font-mono'>
                    <p className='px-2 py-1 rounded bg-pink-300 text-card-bg'>
                      {om.code}
                    </p>
                    <p className='px-2 py-1 rounded bg-purple-300 text-card-bg'>
                      {om.value} {om.unit}
                    </p>
                  </div>
                  <h4 className='text-lg mb-8'>{om.description}</h4>
                  <div className='flex gap-4 mb-4 text-sm'>
                    <div className='basis-1/5'>
                      <p className='text-foreground/80'>Verified by</p>
                    </div>
                    <div className='basis-4/5'>
                      <p>{om.verification}</p>
                    </div>
                  </div>
                  <div className='flex gap-4 text-sm'>
                    <div className='basis-1/5'>
                      <p className='text-foreground/80'>Assumption</p>
                    </div>
                    <div className='basis-4/5'>
                      <p>{om.assumptions}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </Section>
    </div>
  );
}
