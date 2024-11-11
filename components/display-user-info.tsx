'use client';

import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export default function DisplayUserInfo() {
  const [authUser, setAuthUser] = useState<User | null>(null);

  const fetchUser = async () => {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) setAuthUser(user);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className='flex flex-col items-start gap-2'>
      <h2 className='text-lg font-bold'>Your user details</h2>
      {authUser ? (
        <pre className='max-h-32 overflow-auto rounded border p-3 font-mono text-xs'>
          {JSON.stringify(authUser, null, 2)}
        </pre>
      ) : (
        <p>Searching for a user...</p>
      )}
    </div>
  );
}
