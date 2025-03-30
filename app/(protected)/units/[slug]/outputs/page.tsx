import { extractOutputCodeNumber } from '@/components/logframe/extractOutputCodeNumber';
import FeatureCard from '@/components/ui/feature-card';
import UnitOutputsDataTable from '@/components/units/unit-outputs-data-table';
import { createClient } from '@/utils/supabase/server';

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

  return (
    <div className='flex flex-col gap-6'>
      <FeatureCard>
        <UnitOutputsDataTable data={parsedData} />
      </FeatureCard>
    </div>
  );
}
