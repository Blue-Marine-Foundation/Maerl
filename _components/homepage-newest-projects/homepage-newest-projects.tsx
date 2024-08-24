import { createClient } from "@/_utils/supabase/server";
import ErrorState from "@/_components/ErrorState";

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
    <div className="flex flex-col gap-4">
      {projects.map((project) => {
        return (
          <div key={project.id} className="flex flex-col gap-1">
            <p className="text-xs font-mono text-foreground/80">
              {project.created_at.slice(0, 10)}
            </p>
            <p>{project.name}</p>
          </div>
        );
      })}
    </div>
  );
}
