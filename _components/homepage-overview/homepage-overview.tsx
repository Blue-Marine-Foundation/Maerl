import { createClient } from "@/_utils/supabase/server";
import UpdateLarge from "@/_components/UpdateLarge";
import ErrorState from "@/_components/ErrorState";

export default async function HomepageOverview() {
  const supabase = createClient();

  const { count: projects, error: projectsError } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  if (projectsError) {
    console.log(`Failed to fetch projects: ${projectsError}`);
    return <ErrorState message={projectsError.message} />;
  }

  const { count: updates, error: updatesError } = await supabase
    .from("updates")
    .select("*", { count: "exact", head: true });

  if (updatesError) {
    console.log(`Failed to fetch projects: ${updatesError}`);
    return <ErrorState message={updatesError.message} />;
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <p>Projects:</p>
      <p>{projects}</p>
      <p>Updates:</p>
      <p>{updates}</p>
    </div>
  );
}
