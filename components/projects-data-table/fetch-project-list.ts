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
    const pm = users ? `${users.first_name} ${users.last_name}` : null;

    return {
      ...rest,
      pm,
    };
  });

  return parsedProjects;
}
