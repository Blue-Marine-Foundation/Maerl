'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

interface User {
  display_name: string;
  first_name: string;
  last_name: string;
  role: string;
}

export default function Account() {
  const supabase = createClient();

  const [userProfile, setUserProfile] = useState<User[] | undefined>();
  const [isError, setIsError] = useState(false);

  async function fetchUsers() {
    const { data: users, error } = await supabase.from('users').select('*');

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching users:', error);
      setIsError(true);
      return;
    }

    if (users) {
      setIsError(false);
      setUserProfile(users);
    }
  }

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='w-full px-8 pt-8 pb-16 border rounded-md'>
      {userProfile &&
        userProfile.map(({ display_name, first_name, last_name, role }) => (
          <div key={display_name} className='mb-4'>
            <h2 className='text-2xl font-bold mb-8'>
              {first_name} {last_name}
            </h2>

            <dl className='w-[400px] mb-2 flex justify-start items-center gap-2'>
              <dt className='font-medium w-[100px]'>Username:</dt>
              <dd>@{display_name}</dd>
            </dl>
            <dl className='w-[400px] flex justify-start items-center gap-2'>
              <dt className='font-medium w-[100px]'>Role:</dt>
              <dd>{role}</dd>
            </dl>
          </div>
        ))}
    </div>
  );
}
