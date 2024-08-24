import { createClient } from "@/_utils/supabase/server";
import * as d3 from 'd3';
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

  const { data: latest, error: latestError } = await supabase
    .from('updates')
    .select('*')
    .eq('verified', true)
    .not('date', 'is', null)
    .order('date', { ascending: false })
    .limit(1)

  if (latestError) {
    console.log(`Failed to fetch projects: ${latestError}`);
    return <ErrorState message={latestError.message} />;
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <p className="text-foreground/80">Projects:</p>
      <p>{projects}</p>
      <p className="text-foreground/80">Updates:</p>
      <p>{d3.format(',')(updates || 0)}</p>
      <p className="text-foreground/80">Last updated:</p>
      <p>{d3.timeFormat('%d %B')(new Date(latest[0].date))}</p>
    </div>
  );
}
