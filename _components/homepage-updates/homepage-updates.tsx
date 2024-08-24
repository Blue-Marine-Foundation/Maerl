import { createClient } from "@/_utils/supabase/server";
import ErrorState from "@/_components/ErrorState";

export default async function HomepageUpdates() {
  const supabase = createClient();

  const { data: updates, error: updatesError } = await supabase
    .from("updates")
    .select("*, projects(*)")
    .eq("verified", true)
    .not("date", "is", null)
    .order("date", { ascending: false })
    .limit(15);

  if (updatesError) {
    console.log(`Failed to fetch projects: ${updatesError}`);
    return <ErrorState message={updatesError.message} />;
  }

  return (
    <div className="flex flex-col">
      {updates.map((update) => {
        return (
          <div
            key={update.id}
            className="flex flex-col gap-2 border-t first-of-type:border-0 hover:bg-foreground/10 transition-all py-3"
          >
            <p className="text-sm">
              <span className="font-medium">{update.projects.name}</span>{" "}
              <span className="text-foreground/70">&ndash; {update.date}</span>
            </p>
            <p className="text-sm text-foreground/90">{update.description}</p>
          </div>
        );
      })}
    </div>
  );
}
