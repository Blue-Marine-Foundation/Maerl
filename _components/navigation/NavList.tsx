'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
}

export default function NavList({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <ul className='text-sm flex items-center gap-1'>
      {items.map((item: NavItem) => {
        return (
          <li
            key={item.name}
            className={
              pathname === item.href
                ? 'inline-block transition-all group active first-of-type:ml-4'
                : 'inline-block transition-all group'
            }
          >
            <Link
              href={item.href}
              className='inline-block px-4 py-2 rounded-md border border-transparent transition-all ease-in-out duration-300 hover:border-foreground/20 group-[.active]:bg-[#222838] group-[.active]:border-slate-800 group-[.active]:shadow-md'
            >
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
