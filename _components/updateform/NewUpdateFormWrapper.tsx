import { createClient } from '@/_utils/supabase/server';
import NewUpdateForm from '@/_components/updateform/NewUpdateForm';
import ErrorState from '@/_components/ErrorState';

export default async function NewUpdateWrapper() {
  const supabase = createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();

  const userid = user?.user?.id ? user.user.id : null;

  const { data: projects, error } = await supabase
    .from('projects')
    .select(`*, outputs (*, output_measurables (*, impact_indicators (*)))`);

  const { data: impactIndicators, error: impactIndicatorsError } =
    await supabase.from('impact_indicators').select('*');

  if (error || userError || impactIndicatorsError) {
    return (
      <div className='animate-in'>
        <div className='pt-4 pb-12'>
          <h2 className='text-2xl font-bold mb-6'>New Update</h2>
          {error && <ErrorState message={error.message} />}
          {userError && <ErrorState message={userError.message} />}
        </div>
      </div>
    );
  }

  return (
    <NewUpdateForm
      data={projects}
      impactIndicators={impactIndicators}
      user={userid}
    />
  );
}
