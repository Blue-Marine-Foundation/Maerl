import { createClient } from '@/utils/supabase/client';

export default async function fetchProjectList() {
  const supabase = createClient();

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*, users(*)')
    .order('name');

  if (error) {
    return error;
  }

  const parsedProjects = projects?.map(({ users, ...rest }) => {
    const project_manager = users ? `${users.first_name}` : null;

    return {
      ...rest,
      project_manager,
    };
  });

  return parsedProjects;
}
