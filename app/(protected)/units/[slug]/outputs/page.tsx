'use server';

import { extractOutputCodeNumber } from '@/components/logframe/extractOutputCodeNumber';
import { isUnplannedOutput } from '@/components/logframe/isUnplannedOutput';
import Link from 'next/link';
// import { createClient } from '@/utils/supabase/server';

// Mock data structure anticipating possible database updates needed
// where we can fetch unit outputs
const mockUnitData = {
  id: 1,
  name: 'Mock Education Unit',
  unit_outputs: [
    {
      outputs: {
        id: 107,
        code: 'U1.1',
        description: 'Output description',
        projects: {
          id: 1,
          slug: 'yavin4',
          name: 'Yavin4',
        },
        output_measurables: [
          {
            id: 1,
            description: 'Number of training sessions conducted',
            target: 12,
            unit: 'sessions',
            value: 10,
          },
          {
            id: 2,
            description: 'Number of participants trained',
            target: 100,
            unit: 'people',
            value: 55,
          },
        ],
      },
    },
    {
      outputs: {
        id: 19,
        code: 'O2.3',
        description: 'Second test output from different project',
        projects: {
          id: 2,
          slug: 'yavin4',
          name: 'Yavin4',
        },
        output_measurables: [
          {
            id: 3,
            description: 'Number of resources distributed',
            target: 1000,
            unit: 'units',
          },
        ],
      },
    },
    {
      outputs: {
        id: 3,
        code: 'O3.1',
        description: 'Third test output with no measurables',
        projects: {
          id: 1,
          slug: 'project-alpha',
          name: 'Project Alpha',
        },
        output_measurables: [],
      },
    },
  ],
};

// TODO: Update this to fetch the unit outputs from the database-might look like this:
async function fetchUnitOutputs(unitSlug: string) {
  // Comment out the actual Supabase query for now
  // const supabase = await createClient();
  // const { data, error } = await supabase
  //   .from('units')
  //   .select(`
  //     id,
  //     name,
  //     unit_outputs!inner(
  //       outputs(
  //         *,
  //         projects(id, slug, name),
  //         output_measurables(*)
  //       )
  //     )
  //   `)
  //   .eq('slug', unitSlug)
  //   .single();

  // if (error) throw error;
  // return data;

  // Return mock data instead
  return mockUnitData;
}

export default async function UnitOutputsPage({
  params,
}: {
  params: { slug: string };
}) {
  const unitData = await fetchUnitOutputs(params.slug);
  const outputs = unitData?.unit_outputs?.map((uo) => uo.outputs) || [];

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>{unitData.name} Outputs</h1>

      {outputs.map((output) => (
        <div key={output.id} className='rounded-lg border p-4'>
          <div className='flex items-start justify-between'>
            <div>
              <h2 className='font-semibold'>
                {`${output.projects.name} ${
                  //@ts-expect-error this output type error should be resolved when we wire up the db updates
                  isUnplannedOutput(output)
                    ? `Unplanned Output  ${extractOutputCodeNumber(output.code)}`
                    : `Output ${extractOutputCodeNumber(output.code)}`
                }: ${output.description}`}
              </h2>
              <p className='text-sm text-gray-600'>
                Project: {output.projects.name}
              </p>
            </div>
            <Link
              href={`/projects/${output.projects.slug}/logframe#output-${output.id}`}
              className='text-sm text-blue-600 hover:underline'
            >
              View in Project Logframe
            </Link>
          </div>

          {output.output_measurables?.length > 0 && (
            <div className='mt-4'>
              <h3 className='mb-2 font-medium'>Output Indicators:</h3>
              <ul className='list-disc pl-5'>
                {output.output_measurables.map((measurable) => (
                  <li key={measurable.id}>
                    {measurable.description}
                    {measurable.target && (
                      <span className='text-gray-600'>
                        {' '}
                        (Target: {measurable.target})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
