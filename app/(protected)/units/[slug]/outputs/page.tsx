import { extractOutputCodeNumber } from '@/components/logframe/extractOutputCodeNumber';
import ActionButton from '@/components/ui/action-button';
import FeatureCard from '@/components/ui/feature-card';
import UnitOutputsDataTable from '@/components/units/unit-outputs-data-table';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

function parseData(data: any[]) {
  return data.map((item) => ({
    id: item.id,
    unit: item.projects.name,
    projectName: item.output_measurables.projects.name,
    projectSlug: item.output_measurables.projects.slug,
    projectType: item.output_measurables.projects.project_type,
    outputId: item.output_measurables.outputs.id,
    outputNumber: extractOutputCodeNumber(item.output_measurables.outputs.code),
    outputStatus: item.output_measurables.outputs.status,
    outputMeasurableCode: item.output_measurables.code,
    outputMeasurableDescription: item.output_measurables.description,
    outputMeasurableTarget: item.output_measurables.target,
    outputMeasurableUnit: item.output_measurables.unit,
    outputMeasurableValue: item.output_measurables.value,
  }));
}

export default async function UnitOutputsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('unit_contributions')
    .select(
      '*, projects!inner(*), output_measurables(*, projects(name, slug, project_type), outputs(id, code, description, status))',
    )
    .eq('projects.slug', slug);

  if (error) {
    console.error('Error fetching unit outputs:', error);
    return <p>Error fetching unit outputs</p>;
  }

  const parsedData = parseData(data);

  const uniqueProjects = Array.from(
    new Set(parsedData.map((item) => item.projectName)),
  );

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between gap-2'>
        <h3 className='text-lg font-bold'>
          Contributing to {parsedData.length} output
          {parsedData.length === 1 ? '' : 's'} on {uniqueProjects.length}{' '}
          project
          {uniqueProjects.length === 1 ? '' : 's'}
        </h3>

        <Link href={`/units/${slug}/outputs/add`}>
          <ActionButton action='add' label='Add output' />
        </Link>
      </div>
      <FeatureCard>
        <UnitOutputsDataTable data={parsedData} />
      </FeatureCard>
    </div>
  );
}
