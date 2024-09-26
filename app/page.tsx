import UpdateSmall from '@/_components/UpdateSmall'
import HomePageNewestProjects from '@/_components/homepage-newest-projects/homepage-newest-projects'
import HomepageOverview from '@/_components/homepage-overview/homepage-overview'
import HomepageUpdatePlotWrapper from '@/_components/homepage-update-plot/homepage-update-plot-wrapper'
import HomepageUpdates from '@/_components/homepage-updates/homepage-updates'

export const dynamic = 'force-dynamic'

export default async function Index() {
  const homepageCard =
    'bg-card-bg shadow-lg border border-foreground/5 rounded-lg'

  return (
    <div className="animate-in py-8 grid grid-cols-2 gap-4 lg:gap-8">
      <div className="flex flex-col gap-4 lg:gap-8">
        <div className="grid grid-cols-2 gap-4 lg:gap-8">
          <div className={`${homepageCard} p-3 flex flex-col gap-4`}>
            <p className="font-medium">Overview</p>
            <HomepageOverview />
          </div>
          <div className={`${homepageCard} p-3 flex flex-col gap-4`}>
            <p className="font-medium">Newest Projects</p>
            <HomePageNewestProjects />
          </div>
        </div>
        <div className={`${homepageCard} max-h-80 p-2`}>
          <p className="font-medium p-3">Weekly Update Volume</p>
          <HomepageUpdatePlotWrapper />
        </div>
      </div>

      <div className={`${homepageCard} basis-1/2`}>
        <p className="font-medium p-3">Latest Updates</p>
        <HomepageUpdates />
      </div>
    </div>
  )
}
