'use client';

import { createClient } from '@/_utils/supabase/client';
import { useState, useEffect } from 'react';

export default function Page() {
  const supabase = createClient();

  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .is('output_measurable_id', null);

    if (error) {
      console.log(error);
    }

    if (data) {
      console.log(data);
      setData(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='pt-8 pb-24'>
      <p>The number of posts: {data && data.length}</p>
    </div>
  );
}
