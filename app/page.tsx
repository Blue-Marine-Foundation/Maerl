import UpdateSmall from "@/_components/UpdateSmall";
import HomePageNewestProjects from "@/_components/homepage-newest-projects/homepage-newest-projects";
import HomepageOverview from "@/_components/homepage-overview/homepage-overview";
import HomepageUpdates from "@/_components/homepage-updates/homepage-updates";

export const dynamic = "force-dynamic";

export default async function Index() {
  return (
    <div className="animate-in py-8 flex justify-between items-start gap-4 lg:gap-8">
      <div className="flex-1 flex flex-col gap-8">
        <div className="bg-card-bg border border-foreground/5 rounded-lg p-3 flex flex-col gap-4">
          <p className="text-sm font-medium">Overview</p>
          <HomepageOverview />
        </div>
        <div className="bg-card-bg border border-foreground/5 rounded-lg p-3 flex flex-col gap-4">
          <p className="text-sm font-medium">Newest Projects</p>
          <HomePageNewestProjects />
        </div>
      </div>

      <div className="basis-1/2 bg-card-bg border border-foreground/20 rounded-lg p-3 flex flex-col gap-4">
        <p className="text-sm font-medium">Latest Updates</p>
        <HomepageUpdates />
      </div>
      <div className="basis-1/4 bg-card-bg border border-foreground/5 rounded-lg p-3 flex flex-col gap-4">
        <p className="text-sm font-medium">Updates over time</p>
      </div>
    </div>
  );
}
