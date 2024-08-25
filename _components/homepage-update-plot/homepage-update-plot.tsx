'use client';

import * as Plot from "@observablehq/plot";
import ClientPlotFigure from '../PlotFigureClient';
import { Update } from "@/_lib/types";

export default async function HomepageUpdatePlot({updates}: {updates: Update[]} ) {
  return (
    <ClientPlotFigure
      options={{
        x: {
          grid: true,
        },
        y: {
          line: true,
        },
        marks: [
          Plot.areaX(updates, Plot.binY({x: "count"}, {
            y: d => new Date(d.date),
            interval: 'month',
            fill: 'skyblue',
            fillOpacity: 0.5,
            curve: 'catmull-rom'
          })),
          Plot.lineX(updates, Plot.binY({x: "count"}, {
            y: d => new Date(d.date),
            interval: 'month',
            curve: 'catmull-rom'
          })),
        ]
      }}
    />
  )
}
