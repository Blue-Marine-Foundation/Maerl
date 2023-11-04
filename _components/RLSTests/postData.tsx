/* eslint-disable camelcase */

'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

interface Post {
  created_at: string;
  content_type: string;
  date: string;
  display_name: string;
  handle: string;
  id: number;
  impressions: string;
  link: string;
  platform: string;
  post_timestamp: string;
  profile_id: number;
}

export default function PostData() {
  const supabase = createClient();

  const [postData, setPostData] = useState<Post[] | undefined>();
  const [isError, setIsError] = useState(false);

  async function fetchUsers() {
    const { data: data, error } = await supabase
      .from('post_data')
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
      setPostData(flattenedData);
    }
  }

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='py-4 border border-zinc-500 rounded-md p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h4 className='text-lg font-bold'>Post Data</h4>
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

      {!postData && <p>No posts found, possible RLS failure</p>}
      {postData && (
        <table className='w-full'>
          <tbody>
            {postData.map(
              ({
                display_name,
                link,
                content_type,
                post_timestamp,
                platform,
              }) => (
                <tr className='text-xs' key={post_timestamp}>
                  <td className='pb-1 font-mono'>
                    {post_timestamp.slice(0, 10)}
                  </td>
                  <td className='pb-1'>
                    {display_name} posted a{' '}
                    <a className='underline' href={link} target='_blank'>
                      {content_type} on {platform}
                    </a>
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
