'use client';

import { createClient } from '@/_utils/supabase/client';
import { useState, useEffect } from 'react';

interface Group {
  name: string;
  group_logo: string;
}

export default function OrgPicker() {
  const supabase = createClient();

  const [userGroups, setUserGroups] = useState<Group[] | undefined>();

  async function fetchUsers() {
    const { data: groups, error } = await supabase.from('groups').select('*');

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching users:', error);
      return;
    }

    if (groups) {
      setUserGroups(groups);
    }
  }

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {userGroups &&
        userGroups.map(({ name, group_logo }) => (
          <div className='flex items-center justify-start gap-2' key={name}>
            <span className='pr-3 text-neutral-400'>//</span>
            <img
              className='inline-block'
              src={`/img/brandAssets/${group_logo}`}
              alt={`${name} logo`}
              width={20}
              height={20}
            />
            <h2 className='inline-block' key={name}>
              {name}
            </h2>
          </div>
        ))}
    </>
  );
}
