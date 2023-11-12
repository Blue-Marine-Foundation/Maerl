import { supabase } from '@/_utils/supabase/servicerole';

export default async function Updates() {
  const { data: updates, error } = await supabase
    .from('updates')
    .select('*, projects (*)');

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return updates.map((update) => {
    return (
      <p key={update.id} className='mb-4'>
        {update.description}
      </p>
    );
  });
}
