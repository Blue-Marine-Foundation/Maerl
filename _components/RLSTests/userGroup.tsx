/* eslint-disable camelcase */

'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

interface Group {
  name: string;
  group_logo: string;
}

export default function UserGroup() {
  const supabase = createClient();

  const [userGroups, setUserGroups] = useState<Group[] | undefined>();
  const [isError, setIsError] = useState(false);

  async function fetchUsers() {
    const { data: groups, error } = await supabase.from('groups').select('*');

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching users:', error);
      setIsError(true);
      return;
    }

    if (groups) {
      setIsError(false);
      setUserGroups(groups);
    }
  }

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='py-4 border border-zinc-500 rounded-md p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h4 className='text-lg font-bold'>User groups</h4>
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
      {!userGroups && (
        <p>No groups found, possible RLS failure. Check console.</p>
      )}
      {userGroups && userGroups.map(({ name }) => <p key={name}>{name}</p>)}
    </div>
  );
}
