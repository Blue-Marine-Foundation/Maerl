/* eslint-disable camelcase */

'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

interface User {
  display_name: string;
  first_name: string;
  last_name: string;
  role: string;
}

export default function UserProfile() {
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
    <div className='py-4 border border-zinc-500 rounded-md p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h4 className='text-lg font-bold'>User profile</h4>
        {isError ? (
          <span className='bg-red-300 dark:bg-red-400 text-foreground dark:text-background'>
            RLS fail
          </span>
        ) : (
          <span className='bg-green-300 dark:bg-green-400 text-foreground dark:text-background py-1 px-2 rounded-md'>
            RLS pass
          </span>
        )}
      </div>
      <hr className='mb-4' />
      {!userProfile && <p>No users found, possible RLS failure</p>}
      {userProfile &&
        userProfile.map(({ display_name, first_name, last_name, role }) => (
          <p key={display_name}>
            <strong>
              {first_name} {last_name}
            </strong>
            <br />
            <span className='text-sm'>
              @{display_name}
              <br /> {role}
            </span>
          </p>
        ))}
    </div>
  );
}
