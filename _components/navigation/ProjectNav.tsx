'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface Project {
  slug: string;
}

export default function ProjectSideNav(project: Project) {
  const pathname = usePathname();

  const items = [
    // {
    //   name: 'Theory of Change',
    //   href: `/app/projects/${project.slug}/toc`,
    // },
    {
      name: 'Logframe',
      href: `/app/projects/${project.slug}/logframe`,
    },
    {
      name: 'Updates',
      href: `/app/projects/${project.slug}/updates`,
    },
  ];

  return (
    <ul className='text-sm flex items-center gap-1'>
      {items.map((item) => {
        return (
          <li
            key={item.name}
            className={
              pathname === item.href
                ? 'inline-block transition-all group active'
                : 'inline-block transition-all group'
            }
          >
            <Link
              href={item.href}
              className='inline-block px-4 py-2 rounded-md border border-transparent transition-all ease-in-out duration-300 hover:border-foreground/20 group-[.active]:bg-[#222838] group-[.active]:border-foreground/30'
            >
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
