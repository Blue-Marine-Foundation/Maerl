import { PRODUCTION_URL } from '@/_lib/constants';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className='max-w-6xl mx-auto'>
      <h2 className='text-2xl font-bold mb-8'>Dashboard</h2>

      <Link
        href={`${PRODUCTION_URL}/dashboard/projects`}
        className='p-8 border rounded-lg flex justify-between items-center bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-slate-100'
      >
        <h3 className='text-lg font-bold mb-2'>Projects &rarr;</h3>
      </Link>
    </div>
  );
}
