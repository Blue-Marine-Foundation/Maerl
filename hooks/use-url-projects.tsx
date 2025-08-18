'use client';

import { useSearchParams } from 'next/navigation';

export const useUrlProjects = (projects: string[]): string[] => {
  const searchParams = useSearchParams();
  const projectsParam = searchParams.get('projects');

  if (!projectsParam) {
    return projects;
  }

  return projectsParam.split('|').filter(Boolean);
};
