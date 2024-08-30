'use client'

import * as Plot from '@observablehq/plot'
import ClientPlotFigure from '../PlotFigureClient'
import { Update } from '@/_lib/types'

export default async function HomepageUpdatePlot({
  updates,
}: {
  updates: Update[]
}) {
  return (
    <ClientPlotFigure
      options={{
        marginTop: 40,
        x: {
          grid: true,
          label: 'Updates per week',
          labelAnchor: 'center',
          labelOffset: 35,
          axis: 'top',
        },
        y: {
          line: true,
        },
        marks: [
          Plot.areaX(
            updates,
            Plot.binY(
              { x: 'count' },
              {
                y: (d) => new Date(d.date),
                interval: 'week',
                // @ts-expect-error
                fill: 'skyblue',
                fillOpacity: 0.5,
                curve: 'catmull-rom',
              }
            )
          ),
          Plot.lineX(
            updates,
            Plot.binY(
              { x: 'count' },
              {
                y: (d) => new Date(d.date),
                interval: 'week',
                // @ts-expect-error
                curve: 'catmull-rom',
              }
            )
          ),
        ],
      }}
    />
  )
}
