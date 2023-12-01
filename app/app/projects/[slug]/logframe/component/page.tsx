'use client';

import { useSearchParams } from 'next/navigation';

export default function SearchBar() {
  const searchParams = useSearchParams();

  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const code = searchParams.get('code');

  return (
    <div>
      <h2>Logframe detail</h2>
      <ul>
        <li>Component: {type}</li>
        <li>Database ID: {id}</li>
        <li>
          {type} code: {code}
        </li>
      </ul>
    </div>
  );
}
