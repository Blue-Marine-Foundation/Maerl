'use client';

import Breadcrumbs from '@/_components/breadcrumbs';
import { useSearchParams } from 'next/navigation';

export default function SearchBar() {
  const searchParams = useSearchParams();

  const id = searchParams.get('id');
  const code = searchParams.get('code');

  return (
    <div className='animate-in pb-24'>
      <Breadcrumbs />
      <h2 className='text-xl font-medium text-white'>Outcome {code}</h2>

      <h2>Logframe detail: Outcome</h2>
      <ul>
        <li>Database ID: {id}</li>
        <li>Outcome code: {code}</li>
      </ul>
    </div>
  );
}
