'use client';

import { createClient } from '@/_utils/supabase/client';
import { useState, useEffect } from 'react';

interface Indicator {
  id: number;
  created_at: string;
  updated_at: string | null;
  indicator_code: string;
  indicator_title: string;
  indicator_unit: string | null;
}

export default function Dashboard() {
  const supabase = createClient();

  const [indicatorList, setIndicatorList] = useState<Indicator[]>([]);
  const [filteredIndicators, setFilteredIndicators] = useState<Indicator[]>([]);

  const [isError, setIsError] = useState(false);

  async function fetchIndicators() {
    const { data: indicators, error } = await supabase
      .from('impact_indicators')
      .select('*');

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching users:', error);
      setIsError(true);
      return;
    }

    if (indicators) {
      setIsError(false);
      setIndicatorList(indicators);
      setFilteredIndicators(indicators);
    }
  }

  useEffect(() => {
    fetchIndicators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const filteredIndicators = indicatorList?.filter((i) =>
      i.indicator_code.startsWith(value)
    );

    setFilteredIndicators(filteredIndicators);
  };

  return (
    <>
      <div className='w-full'>
        <div className='mb-8 flex justify-start items-center gap-4'>
          <label htmlFor='filter'>Search by indicator code:</label>
          <input
            type='text'
            onChange={onInputChange}
            placeholder='e.g. 1.3.2'
            className='block appearance-none w-[300px] px-4 py-2 bg-[#313B4F] border border-foreground/10 hover:border-btn-background rounded shadow leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <table>
          <thead>
            <tr>
              <th className='pr-4 text-right'>Code</th>
              <th className='text-left'>Title</th>
              <th className='text-left'>Unit</th>
            </tr>
          </thead>
          <tbody>
            {filteredIndicators &&
              filteredIndicators.map((indicator) => {
                return (
                  <tr key={indicator.id}>
                    <td className='pr-4 pb-4 text-right'>
                      {indicator.indicator_code}
                    </td>
                    <td className='pr-8 pb-4'>{indicator.indicator_title}</td>
                    <td className='pb-4'>{indicator.indicator_unit}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}
