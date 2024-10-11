'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
}

export default function PrimaryNavigation() {
  const pathname = usePathname();

  const items = [
    {
      name: 'Overview',
      href: '/',
    },
    {
      name: 'Projects',
      href: '/projects',
    },
  ];

  return (
    <ul className='flex w-full gap-1 pt-1 text-sm'>
      {items.map((item: NavItem) => {
        return (
          <li
            key={item.name}
            className={
              pathname === item.href
                ? 'active group inline-block transition-all'
                : 'group inline-block transition-all first-of-type:-ml-4'
            }
          >
            <Link
              href={item.href}
              className='inline-block rounded-md border border-transparent px-4 py-2 transition-all duration-300 ease-in-out hover:border-foreground/20 group-[.active]:border-slate-800 group-[.active]:bg-sky-800/50'
            >
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
