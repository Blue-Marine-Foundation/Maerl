import { createClient } from '@/_utils/supabase/server';
import UpdateForm from '../../../_components/updateform/updateform';
import ErrorState from '@/_components/ErrorState';

export default async function NewUpdate() {
  const supabase = createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();

  const userid = user?.user?.id ? user.user.id : null;

  const { data: projects, error } = await supabase
    .from('projects')
    .select(`*, outputs (*, output_measurables (*, impact_indicators (*)))`);

  if (error || userError) {
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
    <div className='animate-in pt-4 pb-12'>
      <h2 className='text-2xl font-bold mb-6'>New Update</h2>
      {projects && <UpdateForm data={projects} user={userid} />}
    </div>
  );
}
