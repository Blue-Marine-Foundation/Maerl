'use client';

import * as Plot from "@observablehq/plot";
import ClientPlotFigure from '../PlotFigureClient';
import { Update } from "@/_lib/types";

export default async function HomepageUpdatePlot({updates}: {updates: Update[]} ) {
  return (
    <ClientPlotFigure
      options={{
        height: 300,
        y: {
          grid: true
        },
        marks: [
          Plot.areaY(updates, Plot.binX({y: "count"}, {
            x: d => new Date(d.date),
            interval: 'month',
            fill: 'skyblue',
            fillOpacity: 0.5,
            curve: 'catmull-rom'
          })),
          Plot.lineY(updates, Plot.binX({y: "count"}, {
            x: d => new Date(d.date),
            interval: 'month',
            curve: 'catmull-rom'
          })),
          Plot.ruleY([0])
        ]
      }}
    />
  )
}
