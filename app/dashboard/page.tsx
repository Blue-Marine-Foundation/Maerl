'use client';

import { createClient } from '@/_utils/supabase/client';
import { useState, useEffect } from 'react';

interface User {
  display_name: string;
  first_name: string;
  last_name: string;
  role: string;
}

export default function Dashboard() {
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
    <>
      <h2 className='text-2xl font-bold mb-8'>
        {userProfile
          ? `Welcome back, ${userProfile[0].first_name} ${userProfile[0].last_name}!`
          : 'Welcome back!'}
      </h2>
      <div className='w-full p-8 border rounded-lg min-h-[300px] flex flex-col justify-center items-center bg-gray-100 text-gray-500 text-sm dark:bg-gray-800 dark:text-slate-300'>
        His whole life had been leading to this point, because that's famously
        how time works.
      </div>
    </>
  );
}
