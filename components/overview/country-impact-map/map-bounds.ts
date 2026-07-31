export type MapBounds = [[number, number], [number, number]];

const FULL_LONGITUDE_SPAN = 360;
const LONGITUDE_EPSILON = 1e-9;

type LongitudeSegment = {
  start: number;
  end: number;
};

function positiveLongitude(longitude: number): number {
  return (
    ((longitude % FULL_LONGITUDE_SPAN) + FULL_LONGITUDE_SPAN) %
    FULL_LONGITUDE_SPAN
  );
}

export function normalizeLongitude(longitude: number): number {
  const normalized = positiveLongitude(longitude + 180) - 180;
  return Object.is(normalized, -0) ? 0 : normalized;
}

function longitudeSpan(bounds: MapBounds): number {
  const rawSpan = bounds[1][0] - bounds[0][0];
  if (Math.abs(rawSpan) >= FULL_LONGITUDE_SPAN - LONGITUDE_EPSILON) {
    return FULL_LONGITUDE_SPAN;
  }
  return positiveLongitude(rawSpan);
}

export function getMapBoundsFocus(bounds: MapBounds): {
  center: [number, number];
  span: number;
} {
  const lngSpan = longitudeSpan(bounds);
  const latSpan = Math.abs(bounds[1][1] - bounds[0][1]);

  return {
    center: [
      normalizeLongitude(bounds[0][0] + lngSpan / 2),
      (bounds[0][1] + bounds[1][1]) / 2,
    ],
    span: Math.max(lngSpan, latSpan),
  };
}

/**
 * Returns the shortest circular longitude interval containing every bound.
 * Bounds may use an east longitude above 180 degrees to represent a compact
 * antimeridian crossing, as the generated Natural Earth registry does.
 */
export function mergeMapBounds(bounds: MapBounds[]): MapBounds | null {
  if (bounds.length === 0) return null;

  let south = Number.POSITIVE_INFINITY;
  let north = Number.NEGATIVE_INFINITY;
  let coversEveryLongitude = false;
  const longitudeSegments: LongitudeSegment[] = [];

  for (const bound of bounds) {
    south = Math.min(south, bound[0][1], bound[1][1]);
    north = Math.max(north, bound[0][1], bound[1][1]);

    const span = longitudeSpan(bound);
    if (span >= FULL_LONGITUDE_SPAN - LONGITUDE_EPSILON) {
      coversEveryLongitude = true;
      continue;
    }

    const start = positiveLongitude(bound[0][0]);
    const end = start + span;
    if (end <= FULL_LONGITUDE_SPAN + LONGITUDE_EPSILON) {
      longitudeSegments.push({
        start,
        end: Math.min(end, FULL_LONGITUDE_SPAN),
      });
    } else {
      longitudeSegments.push({ start, end: FULL_LONGITUDE_SPAN });
      longitudeSegments.push({ start: 0, end: end - FULL_LONGITUDE_SPAN });
    }
  }

  if (coversEveryLongitude) {
    return [
      [-180, south],
      [180, north],
    ];
  }

  longitudeSegments.sort(
    (first, second) => first.start - second.start || first.end - second.end,
  );

  const mergedSegments: LongitudeSegment[] = [];
  for (const segment of longitudeSegments) {
    const previous = mergedSegments.at(-1);
    if (!previous || segment.start > previous.end + LONGITUDE_EPSILON) {
      mergedSegments.push({ ...segment });
    } else {
      previous.end = Math.max(previous.end, segment.end);
    }
  }

  let largestGap = -1;
  let coveringArcStart = mergedSegments[0].start;
  for (let index = 0; index < mergedSegments.length; index += 1) {
    const current = mergedSegments[index];
    const isLast = index === mergedSegments.length - 1;
    const next = mergedSegments[isLast ? 0 : index + 1];
    const nextStart = next.start + (isLast ? FULL_LONGITUDE_SPAN : 0);
    const gap = nextStart - current.end;

    if (gap > largestGap) {
      largestGap = gap;
      coveringArcStart = nextStart;
    }
  }

  const coveringSpan = FULL_LONGITUDE_SPAN - largestGap;
  if (coveringSpan >= FULL_LONGITUDE_SPAN - LONGITUDE_EPSILON) {
    return [
      [-180, south],
      [180, north],
    ];
  }

  let west = positiveLongitude(coveringArcStart);
  let east = west + coveringSpan;
  if (west > 180) {
    west -= FULL_LONGITUDE_SPAN;
    east -= FULL_LONGITUDE_SPAN;
  }

  return [
    [west, south],
    [east, north],
  ];
}
