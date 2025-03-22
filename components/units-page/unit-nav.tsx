'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { PlusCircleIcon } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
}

export default function UnitNavigation({ slug }: { slug: string }) {
  const pathname = usePathname();

  const items = [
    {
      name: 'Unit Home',
      href: `/units/${slug}`,
    },
    {
      name: 'Outputs',
      href: `/units/${slug}/outputs`,
    },
    {
      name: 'Updates',
      href: `/units/${slug}/updates`,
    },
  ];

  return (
    <nav className='flex grow items-center justify-between'>
      <ul className='flex gap-1 text-sm'>
        {items.map((item: NavItem) => {
          return (
            <li
              key={item.name}
              className={` ${pathname === item.href && 'active'} group inline-block leading-4 transition-all`}
            >
              <Link
                href={item.href}
                className='inline-block rounded-md border border-transparent px-4 py-2 text-foreground/80 transition-all ease-in-out hover:border-foreground/20 group-[.active]:border-slate-800 group-[.active]:bg-sky-800/50 group-[.active]:text-foreground'
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        href={`/projects/${slug}/add-update`}
        className='flex items-center gap-2 rounded-md border bg-purple-500/30 px-3 py-1.5 text-sm text-foreground/80 transition-all hover:border-foreground/50 hover:text-foreground'
      >
        <PlusCircleIcon className='h-4 w-4' /> Add update
      </Link>
    </nav>
  );
}
