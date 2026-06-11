'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { extractDateParams } from '@/utils/date-utils';
import { useUser } from '@/components/user/user-provider';

interface NavItem {
  name: string;
  href: string;
}

export default function PrimaryNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hasManagerAccess, isSuperAdmin } = useUser();

  // Only preserve date params
  const dateParams = extractDateParams(searchParams);
  const hasDateParams = dateParams.toString().length > 0;

  const items = [
    ...(hasManagerAccess
      ? [
          {
            name: 'Overview',
            href: '/',
          },
        ]
      : []),
    {
      name: 'Projects',
      href: '/projects',
    },
    ...(hasManagerAccess
      ? [
          {
            name: 'Impact',
            href: '/impactindicators',
          },
          {
            name: 'Updates',
            href: '/updates',
          },
        ]
      : []),
    ...(isSuperAdmin
      ? [
          {
            name: 'Admin',
            href: '/admin',
          },
        ]
      : []),
  ];

  return (
    <ul className='flex w-full gap-1 text-sm'>
      {items.map((item: NavItem) => {
        const href = hasDateParams
          ? `${item.href}?${dateParams.toString()}`
          : item.href;

        return (
          <li
            key={item.name}
            className={` ${pathname === item.href && 'active'} group inline-block leading-4 transition-all`}
          >
            <Link
              href={href}
              className='inline-block rounded-md border border-transparent px-4 py-2 text-foreground/80 transition-all ease-in-out hover:border-foreground/20 group-[.active]:border-brand-twilight/30 group-[.active]:bg-brand-twilight/10 group-[.active]:text-brand-marine'
            >
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
