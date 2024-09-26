import { createClient } from '@/_utils/supabase/server';
import IndicatorList from '@/_components/impactindicators/IndicatorList';
import ProgressList from '@/_components/impactindicators/ProgressList';
import ErrorState from '@/_components/ErrorState';

export default async function ImpactIndicatorPage() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('impact_indicators')
    .select('*, updates(*)')
    .eq('updates.valid', true)
    .eq('updates.duplicate', false);

  if (error) {
    console.log(error);
    return (
      <div className='animate-in pt-4 pb-24 max-w-7xl mx-auto'>
        <h2 className='text-2xl font-bold mb-6'>Impact Indicators </h2>

        <ErrorState message={error.message} />
      </div>
    );
  }

  const parsedIndicators = data.map((i) => {
    const countUpdates = i.updates.length;
    const impact = i.updates.reduce((acc: number, i: any) => {
      return acc + i.value;
    }, 0);

    return {
      ...i,
      countUpdates,
      impact,
    };
  });

  const impactIndicators = parsedIndicators.filter((i) => i.id < 900);
  const progressIndicators = parsedIndicators.filter((i) => i.id > 900);

  return (
    <div className='animate-in pt-4 pb-24 max-w-7xl mx-auto'>
      <h2 className='text-2xl font-bold mb-6'>Impact Indicators </h2>

      <div className='flex flex-col gap-6'>
        <IndicatorList data={impactIndicators} />

        <h3 className='text-2xl font-bold mt-6 mb-4'>Progress</h3>

        <ProgressList data={progressIndicators} />
      </div>
    </div>
  );
}
