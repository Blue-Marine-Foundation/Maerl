'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MainNav() {
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
      name: 'Add Update',
      href: '/app/newupdate',
    },
    {
      name: 'Impact Indicators',
      href: '/app/impactindicators',
    },
  ];

  return (
    <ul className='text-sm pt-2 pb-4'>
      {accountNav.map((item) => {
        return (
          <li
            key={item.name}
            className={
              pathname === item.href
                ? 'inline-block mr-2 group active'
                : 'inline-block mr-2 group'
            }
          >
            <Link
              href={item.href}
              className='inline-block px-4 py-2 rounded-md border border-transparent transition-all ease-in-out duration-300 hover:border-foreground/20 group-[.active]:bg-gray-100 group-[.active]:border-gray-300 dark:group-[.active]:bg-[#222838] dark:group-[.active]:border-slate-800 dark:group-[.active]:shadow-md'
            >
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
