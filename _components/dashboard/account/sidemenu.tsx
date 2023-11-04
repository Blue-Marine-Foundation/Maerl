'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideMenu() {
  const pathname = usePathname();

  const accountNav = [
    {
      name: 'User Profile',
      href: '/dashboard/account',
    },
    {
      name: 'Password Reset',
      href: '/dashboard/account/passwordreset',
    },
  ];

  return (
    <ul className='text-sm'>
      {accountNav.map((item) => {
        return (
          <li
            key={item.name}
            className={pathname === item.href ? 'group active' : 'group'}
          >
            <Link
              href={item.href}
              className='inline-block w-[200px] mb-2 px-4 py-2 rounded-md border border-transparent transition-all ease-in-out duration-300 hover:border-foreground/30 group-[.active]:bg-gray-100 group-[.active]:border-gray-300 dark:group-[.active]:bg-slate-700 dark:group-[.active]:border-slate-500'
            >
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
