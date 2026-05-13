'use client';

import { useId, useMemo } from 'react';
import * as d3 from 'd3';

export type SparklinePoint = { year: number; value: number };

type Props = Readonly<{
  /** Annual data points; missing years are linearly interpolated by year. */
  points: SparklinePoint[];
  /** When true, plot the running cumulative total instead of the per-year value. */
  cumulative?: boolean;
  width?: number;
  height?: number;
  className?: string;
  ariaLabel?: string;
}>;

export default function Sparkline({
  points,
  cumulative = true,
  width = 160,
  height = 40,
  className,
  ariaLabel,
}: Props) {
  const gradientId = useId();

  const series = useMemo<SparklinePoint[]>(() => {
    if (points.length === 0) return [];

    const sorted = [...points].sort((a, b) => a.year - b.year);

    if (!cumulative) return sorted;

    let running = 0;
    return sorted.map((p) => {
      running += p.value;
      return { year: p.year, value: running };
    });
  }, [points, cumulative]);

  if (series.length === 0) {
    return (
      <div
        className={className}
        style={{ width, height }}
        aria-hidden='true'
      />
    );
  }

  const padX = 2;
  const padY = 4;
  const xExtent = d3.extent(series, (d) => d.year) as [number, number];
  // d3.extent returns identical min/max when there is only one point; nudge
  // so the scale has a non-zero range and the dot still renders.
  const xDomain: [number, number] =
    xExtent[0] === xExtent[1]
      ? [xExtent[0] - 1, xExtent[1] + 1]
      : xExtent;
  const yMax = d3.max(series, (d) => d.value) ?? 0;

  const x = d3
    .scaleLinear()
    .domain(xDomain)
    .range([padX, width - padX]);
  const y = d3
    .scaleLinear()
    .domain([0, yMax === 0 ? 1 : yMax])
    .range([height - padY, padY]);

  const linePath = d3
    .line<SparklinePoint>()
    .x((d) => x(d.year))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)(series);

  const areaPath = d3
    .area<SparklinePoint>()
    .x((d) => x(d.year))
    .y0(height - padY)
    .y1((d) => y(d.value))
    .curve(d3.curveMonotoneX)(series);

  const last = series.at(-1);
  const titleText = ariaLabel ?? 'trend over time';

  return (
    <svg
      aria-label={titleText}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
    >
      <title>{titleText}</title>

      <defs>
        <linearGradient id={gradientId} x1='0' x2='0' y1='0' y2='1'>
          <stop offset='0%' stopColor='currentColor' stopOpacity='0.25' />
          <stop offset='100%' stopColor='currentColor' stopOpacity='0' />
        </linearGradient>
      </defs>
      {areaPath && <path d={areaPath} fill={`url(#${gradientId})`} />}
      {linePath && (
        <path
          d={linePath}
          fill='none'
          stroke='currentColor'
          strokeWidth={1.5}
          strokeLinejoin='round'
          strokeLinecap='round'
        />
      )}
      {last && (
        <circle
          cx={x(last.year)}
          cy={y(last.value)}
          r={2}
          fill='currentColor'
        />
      )}
    </svg>
  );
}
