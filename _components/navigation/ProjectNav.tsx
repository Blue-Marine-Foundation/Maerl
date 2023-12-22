import NavList from './NavList';

interface Project {
  project: string;
}

export default function ProjectSideNav(project: Project) {
  const projectNav = [
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

  return <NavList items={projectNav} />;
}
