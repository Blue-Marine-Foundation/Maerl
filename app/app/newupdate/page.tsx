import { createClient } from '@/_utils/supabase/server';
import UpdateForm from '../../../_components/updateform/updateform';

export default async function NewUpdate() {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`*, outputs (*, output_measurables (*, impact_indicators (*)))`);

  const { data: user, error: userError } = await supabase.auth.getUser();

  const userid = user?.user?.id ? user.user.id : 'Unknown';

  if (!projects || !user) {
    return (
      <div>
        <div className='pt-4 pb-12'>
          <h2 className='text-2xl font-bold mb-6'>New Update</h2>
          <p className='mb-6'>Error connecting to database</p>
          {error && <p className='mb-6'>{error.message}</p>}
          {userError && <p className='mb-6'>{userError.message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className='animate-in pt-4 pb-12'>
      <h2 className='text-2xl font-bold mb-6'>New Update</h2>
      {projects && user && <UpdateForm data={projects} user={userid} />}
    </div>
  );
}
