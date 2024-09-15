import { createClient } from '@/_utils/supabase/server'
import ErrorState from '@/_components/ErrorState'
import dayjs from 'dayjs'
import HomepageUpdatePlot from './homepage-update-plot'

export default async function HomepageUpdatePlotWrapper() {
  const supabase = createClient()

  const dateCutoff = dayjs().startOf('year').toDate().toISOString()

  const { data: updates, error: updatesError } = await supabase
    .from('updates')
    .select('*')
    .eq('verified', true)
    .not('date', 'is', null)
    .gte('date', dateCutoff.slice(0, 10))
    .order('date', { ascending: false })

  if (updatesError) {
    console.log(`Failed to fetch projects: ${updatesError}`)
    return <ErrorState message={updatesError.message} />
  }

  return <HomepageUpdatePlot updates={updates} />
}
