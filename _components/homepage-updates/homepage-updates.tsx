import { createClient } from '@/_utils/supabase/server'
import ErrorState from '@/_components/ErrorState'
import * as d3 from 'd3'

export default async function HomepageUpdates() {
  const supabase = createClient()

  const { data: updates, error: updatesError } = await supabase
    .from('updates')
    .select('*, projects(*), users(*)')
    .eq('verified', true)
    .not('date', 'is', null)
    .order('date', { ascending: false })
    .limit(15)

  if (updatesError) {
    console.log(`Failed to fetch projects: ${updatesError}`)
    return <ErrorState message={updatesError.message} />
  }

  return (
    <div className="flex flex-col">
      {updates.map((update) => {
        return (
          <div
            key={update.id}
            className="flex flex-col gap-2 border-t hover:bg-foreground/10 transition-all px-3 py-4"
          >
            <div className="text-sm flex justify-between gap-4">
              <p className="text-base text-white">{update.projects.name}</p>{' '}
              <p className="text-foreground/70">
                {d3.timeFormat('%d %B')(new Date(update.date))} by{' '}
                {update.users.first_name}
              </p>
            </div>
            <p className="text-white/90 text-sm leading-7">
              {update.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}
