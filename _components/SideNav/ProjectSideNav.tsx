'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Project {
  project: string;
}

export default function ProjectSideNav(project: Project) {
  const pathname = usePathname();

  const accountNav = [
    {
      name: 'Updates',
      href: `/app/projects/${project.project}/updates`,
    },
    {
      name: 'Outputs',
      href: `/app/projects/${project.project}/outputs`,
    },
    {
      name: 'Logframe',
      href: `/app/projects/${project.project}/logframe`,
    },
  ];

  return (
    <ul className='text-sm pb-12 pr-8'>
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
