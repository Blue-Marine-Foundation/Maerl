import FeatureCard from '@/components/ui/feature-card';
import AddUnitContributionForm from '@/components/units/add-unit-contribution-form';
import { createClient } from '@/utils/supabase/server';

export default async function AddOutput({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*, outputs(*, output_measurables(*))')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
    return <div>Error fetching projects</div>;
  }

  const activeUnit = data.find((project) => project.slug === slug);

  if (!activeUnit) {
    return <div>Unit not found</div>;
  }

  const projects = data.filter(
    (project) => project.project_type.toLowerCase() !== 'unit',
  );

  return (
    <FeatureCard>
      <h3 className='text-lg font-bold'>Add Output Contribution</h3>
      <div className='flex grow flex-col'>
        <AddUnitContributionForm activeUnit={activeUnit} projects={projects} />
      </div>
    </FeatureCard>
  );
}
