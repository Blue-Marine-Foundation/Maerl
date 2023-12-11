import { createClient } from '@/utils/supabase/server';

// interface User {
//   display_name: string;
//   first_name: string;
//   last_name: string;
//   role: string;
// }

export default async function Account() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className='mb-8'>Welcome back!</p>;
  }

  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id);

  return (
    <div className='bg-card-bg p-8 mb-16 rounded-md shadow'>
      <div className='mb-4 flex justify-start items-start gap-4'>
        <div className='w-[100px]'>
          <p className='text-foreground/70'>Name</p>
        </div>
        <div>
          <p>
            {userDetails
              ? `${userDetails[0].first_name} ${userDetails[0].last_name}`
              : ''}
          </p>
        </div>
      </div>
      <div className='mb-4 flex justify-start items-start gap-4'>
        <div className='w-[100px]'>
          <p className='text-foreground/70'>Role</p>
        </div>
        <div>
          <p>{userDetails ? `${userDetails[0].role}` : ''}</p>
        </div>
      </div>
    </div>
  );
}
