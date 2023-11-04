/* eslint-disable camelcase */

'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

interface Profile {
  display_name: string;
  platform: string;
  handle: string;
}

export default function GroupProfiles() {
  const supabase = createClient();

  const [groupProfiles, setGroupProfiles] = useState<Profile[] | undefined>();
  const [isError, setIsError] = useState(false);

  async function fetchUsers() {
    const { data: users, error } = await supabase.from('profiles').select('*');

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching profiles:', error);
      setIsError(true);
      return;
    }

    if (users) {
      setIsError(false);
      setGroupProfiles(users);
    }
  }

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='py-4 border border-zinc-500 rounded-md p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h4 className='text-lg font-bold'>Group profiles</h4>
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
      {!groupProfiles && <p>No profiles found, possible RLS failure</p>}
      {groupProfiles &&
        groupProfiles.map(({ display_name, handle, platform }) => (
          <p className='text-sm' key={`${display_name}_${platform}`}>
            @{handle} on {platform}
          </p>
        ))}
    </div>
  );
}
