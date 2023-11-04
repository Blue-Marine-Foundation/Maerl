/* eslint-disable camelcase */

'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

interface ProfileData {
  created_at: string;
  date: string;
  display_name: string;
  follower_count: number;
  handle: string;
  id: number;
  platform: string;
  profile_id: number;
}

export default function ProfileData() {
  const supabase = createClient();

  const [profileData, setProfileData] = useState<ProfileData[] | undefined>();
  const [isError, setIsError] = useState(false);

  async function fetchUsers() {
    const { data: data, error } = await supabase
      .from('profile_data')
      .select(
        `
        *,
        profiles (id, platform, display_name, handle)
    `
      )
      .limit(5);

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching profiles:', error);
      setIsError(true);
      return;
    }

    if (data) {
      const flattenedData = data.map((item) => {
        const { profiles, ...rest } = item;
        const { ...profileRest } = profiles;
        return {
          ...rest,
          ...profileRest,
        };
      });
      setIsError(false);
      setProfileData(flattenedData);
    }
  }

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='py-4 border border-zinc-500 rounded-md p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h4 className='text-lg font-bold'>Profile Data</h4>
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

      {!profileData && <p>No profiles found, possible RLS failure</p>}
      {profileData && (
        <table className='w-full'>
          <thead>
            <tr>
              <td></td>
              <td></td>
              <td className='text-xs text-right font-bold'>Followers</td>
            </tr>
          </thead>
          <tbody>
            {profileData.map(
              ({ display_name, date, follower_count, platform }) => (
                <tr className='text-sm' key={`${platform}_${date}`}>
                  <td className='text-xs font-mono'>{date}</td>
                  <td>
                    {display_name} {platform}
                  </td>
                  <td className='text-right'>
                    {follower_count.toLocaleString('en-GB')}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
