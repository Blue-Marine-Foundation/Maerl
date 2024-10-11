import Link from 'next/link';

export default async function Index() {
  return (
    <div className={`max-w-app mx-auto flex w-full flex-col gap-8 py-12`}>
      <p>An opinionated starter template for NextJS projects using Supabase.</p>
      <ul>
        <li>
          Uses{' '}
          <Link
            href='https://nextjs.org'
            className='text-blue-500 hover:underline'
          >
            NextJS
          </Link>{' '}
          (obviously)
        </li>
        <li>
          Uses{' '}
          <Link
            href='https://supabase.com'
            className='text-blue-500 hover:underline'
          >
            Supabase Auth
          </Link>
        </li>
        <li>
          Uses{' '}
          <Link
            href='https://tailwindcss.com'
            className='text-blue-500 hover:underline'
          >
            Tailwind CSS
          </Link>
        </li>
      </ul>
    </div>
  );
}
