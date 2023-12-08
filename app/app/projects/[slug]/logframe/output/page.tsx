'use client';

import { useSearchParams } from 'next/navigation';

export default function SearchBar() {
  const searchParams = useSearchParams();

  const id = searchParams.get('id');
  const code = searchParams.get('code');

  return (
    <div>
      <h2>Output</h2>
      <ul>
        <li>Database ID: {id}</li>
        <li>Output code: {code}</li>
      </ul>
    </div>
  );
}
