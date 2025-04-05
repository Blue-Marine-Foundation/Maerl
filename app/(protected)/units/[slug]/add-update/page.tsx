import FeatureCard from '@/components/ui/feature-card';
import AddGeneralUpdateForm from '@/components/updates/add-general-update-form';
import { createClient } from '@/utils/supabase/server';

type Params = Promise<{ slug: string }>;

export default async function AddUnitUpdatePage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*, outputs(*, output_measurables(*, impact_indicators(*)))')
    .eq('slug', slug)
    .single();

  if (error) {
    return (
      <FeatureCard title='Project not found'>
        Error! {error.message}
      </FeatureCard>
    );
  }

  return (
    <div className='flex flex-col gap-8'>
      <h2 className='text-lg font-semibold'>Add update</h2>
      <AddGeneralUpdateForm projectId={data.id} outputs={data.outputs} />
    </div>
  );
}
