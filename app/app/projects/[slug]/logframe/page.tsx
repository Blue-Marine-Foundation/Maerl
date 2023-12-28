import LogframeFeatureCard from '@/_components/LogframeFeatureCard';
import { createClient } from '@/_utils/supabase/server';
import { Params, Output, Measurable } from '@/lib/types';
import { ReactNode } from 'react';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className='mb-10 flex justify-start items-start gap-8'>
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
    .eq('slug', params.slug)
    .limit(1);

  if (!projects) {
    return <p>Error fetching logframe</p>;
  }

  const project = projects[0];

  return (
    <div className='animate-in pt-8'>
      <Section title='Impact'>
        <p className='text-3xl font-medium max-w-2xl'>
          {project.impacts[0] && project.impacts[0].title}
        </p>
      </Section>

      <Section title='Outcome'>
        <>
          <p className='text-xl mb-8 font-medium text-gray-100 max-w-2xl'>
            {project.outcomes[0] && project.outcomes[0].description}
          </p>
          {project.outcome_measurables.map((measurable: Measurable) => {
            return (
              <LogframeFeatureCard
                key={measurable.code}
                project={project.slug}
                type='Outcomes'
                id={measurable.id}
                code={measurable.code}
                verification={measurable.verification}
              >
                <h4 className='text-base'>{measurable.description}</h4>
              </LogframeFeatureCard>
            );
          })}
        </>
      </Section>

      <Section title='Outputs'>
        {project.outputs.map((output: Output) => (
          <div key={output.code} className='mb-16'>
            <h4 className='text-lg mb-2 font-mono font-bold'>
              Output {output.code}
            </h4>
            <p className='text-xl max-w-2xl mb-8'>{output.description}</p>
            {output.output_measurables?.map((om) => {
              return (
                <LogframeFeatureCard
                  key={om.code}
                  project={project.slug}
                  id={om.id}
                  type='Outputs'
                  code={om.code}
                  target={`${om.value} ${om.unit}`}
                  verification={om.verification}
                  assumption={om.assumptions}
                >
                  <h4>{om.description}</h4>
                </LogframeFeatureCard>
              );
            })}
          </div>
        ))}
      </Section>
    </div>
  );
}
