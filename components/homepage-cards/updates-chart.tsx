'use client';

import * as Plot from '@observablehq/plot';
import ClientPlotFigure from '../plots/PlotFigureClient';

export default function UpdatesChart({ updates }: { updates: any[] }) {
  return (
    <ClientPlotFigure
      options={{
        marginLeft: 34,
        height: 250,
        y: {
          grid: true,
          label: null,
          labelOffset: 20,
          axis: 'left',
        },
        x: {
          line: true,
        },
        style: {
          fontSize: '10px',
        },
        marks: [
          Plot.rectY(
            updates,
            Plot.binX(
              { y: 'count' },
              {
                x: (d) => new Date(d.created_at),
                interval: 'week',
                // @ts-expect-error
                fill: 'skyblue',
                fillOpacity: 0.5,
                stroke: 'skyblue',
                strokeWidth: 1,
                inset: 2,
              },
            ),
          ),
        ],
      }}
    />
  );
}
