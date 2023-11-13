'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidenav() {
  const pathname = usePathname();

  const accountNav = [
    {
      name: 'Overview',
      href: '/app',
    },
    {
      name: 'Projects',
      href: '/app/projects',
    },
    {
      name: 'Updates',
      href: '/app/updates',
    },
    {
      name: 'Impact Indicators',
      href: '/app/impactindicators',
    },
    {
      name: 'User Profile',
      href: '/app/account',
    },
    {
      name: 'Password Reset',
      href: '/app/account/passwordreset',
    },
  ];

  return (
    <ul className='text-sm border-r border-foreground/10 py-12 pr-12'>
      {accountNav.map((item) => {
        return (
          <li
            key={item.name}
            className={pathname === item.href ? 'group active' : 'group'}
          >
            <Link
              href={item.href}
              className='inline-block w-[200px] mb-2 px-4 py-2 rounded-md border border-transparent transition-all ease-in-out duration-300 hover:border-foreground/20 group-[.active]:bg-gray-100 group-[.active]:border-gray-300 dark:group-[.active]:bg-slate-800 dark:group-[.active]:border-slate-800'
            >
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
