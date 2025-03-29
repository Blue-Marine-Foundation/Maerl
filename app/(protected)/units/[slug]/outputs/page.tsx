/**
 * NOTE: This page is a proof of concept with mock data
 * and needs to be revisited after db updates done
 * */

import { extractOutputCodeNumber } from '@/components/logframe/extractOutputCodeNumber';
import UnitOutputsDataTable from '@/components/units/unit-outputs-data-table';
// import { createClient } from '@/utils/supabase/server';

// Mock data structure anticipating possible database updates needed
// where we can fetch unit outputs
const mockUnitData = {
  id: 1,
  name: 'Education Unit',
  unit_outputs: [
    {
      outputs: {
        id: 18,
        code: 'U2.2',
        description:
          'The menu uses only local, organic, delicious, and fresh ingredients.',
        projects: {
          id: 1,
          slug: 'yavin4',
          name: 'Yavin4',
        },
        output_measurables: [
          {
            id: 1,
            description: '76% of dishes use 80% local ingredients',
            target: 12,
            unit: 'sessions',
            value: 10,
          },
          {
            id: 2,
            description: 'Other ingredients used',
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
        code: 'O3.3',
        description: 'The canteen staff are recruited from the local area',
        projects: {
          id: 2,
          slug: 'yavin4',
          name: 'Yavin4',
        },
        output_measurables: [
          {
            id: 3,
            description: 'Number of staff interviewed',
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
        description: 'Description here',
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

// TODO: after db updates done,revisit whether we need to flatten the
// Modify the return structure to flatten the data for the table
function flattenOutputsData(outputs: any[]) {
  return outputs.flatMap((output) =>
    output.output_measurables.length > 0
      ? output.output_measurables.map((measurable: any) => ({
          id: `${output.id}-${measurable.id}`,
          project: output.projects.name,
          projectSlug: output.projects.slug,
          outputId: output.id,
          outputCode: extractOutputCodeNumber(output.code),
          outputDescription: output.description,
          indicator: measurable.description,
          target: measurable.target,
          unit: measurable.unit,
        }))
      : [
          {
            id: `${output.id}-0`,
            project: output.projects.name,
            projectSlug: output.projects.slug,
            outputId: output.id,
            outputCode: extractOutputCodeNumber(output.code),
            outputDescription: output.description,
            indicator: 'No indicators defined',
            target: null,
            unit: null,
          },
        ],
  );
}

export default async function UnitOutputsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const unitData = await fetchUnitOutputs(slug);
  const outputs = unitData?.unit_outputs?.map((uo) => uo.outputs) || [];
  const flattenedData = flattenOutputsData(outputs);

  return (
    <div className='flex flex-col gap-6'>
      <UnitOutputsDataTable data={flattenedData} />
    </div>
  );
}
