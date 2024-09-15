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
        height: 250,
        y: {
          grid: true,
          label: 'Updates per week',
          labelOffset: 20,
          axis: 'left',
        },
        x: {
          line: true,
        },
        marks: [
          Plot.areaY(
            updates,
            Plot.binX(
              { y: 'count' },
              {
                x: (d) => new Date(d.date),
                interval: 'week',
                // @ts-expect-error
                fill: 'skyblue',
                fillOpacity: 0.5,
                curve: 'catmull-rom',
              }
            )
          ),
          Plot.lineY(
            updates,
            Plot.binX(
              { y: 'count' },
              {
                x: (d) => new Date(d.date),
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
