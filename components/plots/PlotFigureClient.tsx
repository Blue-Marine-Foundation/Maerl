'use client';

import * as Plot from '@observablehq/plot';
import { useState, useEffect, useRef } from 'react';

interface ClientPlotFigureProps {
  options: Plot.PlotOptions;
}

export const defaultChartOptions = {
  fillOpacity: 0.4,
  strokeWidth: 2,
  strokeOpacity: 1,
  r: 5,
  curve: 'bump-x',
};

export default function ClientPlotFigure({ options }: ClientPlotFigureProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  useEffect(() => {
    if (options == null) return;
    const plot = Plot.plot({ ...options, width });
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.append(plot);
    }
    // Return required to replot when options change
    // eslint-disable-next-line consistent-return
    return () => plot.remove();
  }, [options, width]);

  return (
    <div className='w-full rounded-md bg-white/5 py-2' ref={containerRef} />
  );
}
