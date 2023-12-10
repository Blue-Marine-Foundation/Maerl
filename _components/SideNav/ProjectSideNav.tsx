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
      name: 'Project Home',
      href: `/app/projects/${project.project}`,
    },
    {
      name: 'Logframe',
      href: `/app/projects/${project.project}/logframe`,
    },
    {
      name: 'Outputs',
      href: `/app/projects/${project.project}/outputs`,
    },
    {
      name: 'Updates',
      href: `/app/projects/${project.project}/updates`,
    },
  ];

  return (
    <ul className='text-sm pb-12'>
      {accountNav.map((item) => {
        return (
          <li
            key={item.name}
            className={pathname.endsWith(item.href) ? 'group active' : 'group'}
          >
            <Link
              href={item.href}
              className='inline-block w-full mb-2 px-4 py-2 rounded-md border border-transparent transition-all ease-in-out duration-300 hover:border-foreground/20 group-[.active]:bg-[#2B3246]'
            >
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
