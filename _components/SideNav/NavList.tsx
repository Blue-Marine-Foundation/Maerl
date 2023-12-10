import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
}

export default function NavList({ data }: { data: NavItem[] }) {
  const pathname = usePathname();

  return (
    <ul className='text-sm'>
      {data.map((item) => {
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
