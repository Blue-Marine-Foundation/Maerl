'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { extractDateParams } from '@/utils/date-utils';

interface NavItem {
  name: string;
  href: string;
}

export default function PrimaryNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Only preserve date params
  const dateParams = extractDateParams(searchParams);
  const hasDateParams = dateParams.toString().length > 0;

  const items = [
    {
      name: 'Overview',
      href: '/',
    },
    {
      name: 'Projects',
      href: '/projects',
    },
    {
      name: 'Impact Indicators',
      href: '/impactindicators',
    },
    {
      name: 'Updates',
      href: '/updates',
    },
  ];

  return (
    <ul className='flex w-full gap-1 text-sm'>
      {items.map((item: NavItem) => {
        return (
          <li
            key={item.name}
            className={` ${pathname === item.href && 'active'} group inline-block leading-4 transition-all`}
          >
            <Link
              href={`${item.href}${hasDateParams ? `?${dateParams.toString()}` : ''}`}
              className='inline-block rounded-md border border-transparent px-4 py-2 text-foreground/80 transition-all ease-in-out hover:border-foreground/20 group-[.active]:border-slate-800 group-[.active]:bg-sky-800/50 group-[.active]:text-foreground'
            >
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
