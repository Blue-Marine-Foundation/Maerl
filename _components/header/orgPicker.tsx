'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

interface Organisation {
  name: string;
  logo: string;
}

export default function OrgPicker() {
  const supabase = createClient();

  const [userOgranisations, setUserOrganisations] = useState<
    Organisation[] | undefined
  >();

  async function fetchOrganisations() {
    const { data: organisations, error } = await supabase
      .from('organisations')
      .select('*');

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching users:', error);
      return;
    }

    if (organisations) {
      setUserOrganisations(organisations);
    }
  }

  useEffect(() => {
    fetchOrganisations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {userOgranisations &&
        userOgranisations.map(({ name, logo }) => (
          <div className='flex items-center justify-start gap-2' key={name}>
            <span className='pr-3 text-neutral-400 dark:text-neutral-600'>
              //
            </span>
            <img
              className='inline-block rounded'
              src={`/img/organisationLogos/${logo}`}
              alt={`${name} logo`}
              width={22}
              height={22}
            />
            <h2 className='inline-block' key={name}>
              {name}
            </h2>
          </div>
        ))}
    </>
  );
}
