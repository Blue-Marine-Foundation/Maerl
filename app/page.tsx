import Link from 'next/link';

const ListItem = ({ href, text }: { href: string; text: string }) => (
  <li className='flex min-h-64 items-center justify-center rounded-md bg-card p-8'>
    <Link href={href} className='text-blue-300 hover:underline'>
      {text}
    </Link>
  </li>
);

export default async function Index() {
  const items = [
    { href: 'https://nextjs.org', text: 'NextJS' },
    { href: 'https://supabase.com', text: 'Supabase Auth' },
    { href: 'https://tailwindcss.com', text: 'Tailwind CSS' },
  ];

  return (
    <div className={`max-w-app mx-auto flex w-full flex-col gap-8 py-8`}>
      <p>An opinionated starter template for NextJS projects using Supabase.</p>
      <ul className='grid grid-cols-3 gap-4'>
        {items.map((item, index) => (
          <ListItem key={index} href={item.href} text={item.text} />
        ))}
      </ul>
    </div>
  );
}
