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
    <ul className='flex items-center gap-1 text-sm'>
      {items.map((item: NavItem) => {
        return (
          <li
            key={item.name}
            className={`${pathname === item.href && 'active'} group inline-block transition-all`}
          >
            <Link
              href={item.href}
              className='inline-block border-b-2 border-transparent p-2 transition-all duration-300 ease-in-out hover:bg-blue-500/10 group-[.active]:bg-blue-500/10'
            >
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
