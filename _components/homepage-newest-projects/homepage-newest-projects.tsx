import { createClient } from "@/_utils/supabase/server";
import ErrorState from "@/_components/ErrorState";
import * as d3 from 'd3';

export default async function HomePageNewestProjects() {
  const supabase = createClient();

  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (projectsError) {
    console.log(`Failed to fetch projects: ${projectsError}`);
    return <ErrorState message={projectsError.message} />;
  }

  return (
    <div className="flex flex-col gap-2">
      {projects.map((project) => {
        return (
          <div key={project.id} className="flex justify-between place-items-baseline gap-2">
            <p className="text-base">
               {project.name}
            </p>
            <p className="text-sm text-foreground/80">{d3.timeFormat('%d %B')(new Date(project.created_at.slice(0, 10)))}</p>
          </div>
        );
      })}
    </div>
  );
}
