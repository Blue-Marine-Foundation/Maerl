'use client';

import { useSearchParams } from 'next/navigation';

export const useUrlProjects = (): string[] => {
  const searchParams = useSearchParams();
  const projectsParam = searchParams.get('projects');

  if (!projectsParam) {
    return [];
  }

  return projectsParam.split(',').filter(Boolean);
};
