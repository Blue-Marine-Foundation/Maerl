export const OVERVIEW_ELIGIBLE_PROJECT_TYPES = [
  'Project',
  'Unit led project',
] as const;

type ProjectType = string | null | undefined;

export function isOverviewEligibleProjectType(
  projectType: ProjectType,
): boolean {
  return (
    projectType !== null &&
    projectType !== undefined &&
    (OVERVIEW_ELIGIBLE_PROJECT_TYPES as readonly string[]).includes(projectType)
  );
}

export function isUnitRouteProject(projectType: ProjectType): boolean {
  return projectType === 'Unit';
}

export function projectRouteBase(
  projectType: ProjectType,
): 'units' | 'projects' {
  return isUnitRouteProject(projectType) ? 'units' : 'projects';
}

export function overviewProjectHref(project: {
  slug: string;
  project_type: ProjectType;
}): string {
  return `/${projectRouteBase(project.project_type)}/${project.slug}`;
}
