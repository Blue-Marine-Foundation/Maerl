'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import * as d3 from 'd3';
import { GlobeIcon, MapIcon, XIcon } from 'lucide-react';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';
import 'mapbox-gl/dist/mapbox-gl.css';
import type {
  Map as MapboxMap,
  Popup as MapboxPopup,
  MapMouseEvent as MapboxMapMouseEvent,
} from 'mapbox-gl';
import seaRegionsGeoJson from './sea-regions';
import type { GeographyImpactRow } from './server-actions';
import type { MapBounds } from './country-iso-map';

const FILL_BASE = '#22c55e';
const FILL_HOVER = '#4ade80';
const FILL_OPACITY_BASE = 0.45;
const FILL_OPACITY_HOVER = 0.7;
const STROKE_COLOR = '#86efac';

/** Marine overlays — cyan so they read differently from terrestrial choropleth. */
const WATER_FILL_BASE = 'rgba(14, 165, 233, 0.28)';
const WATER_FILL_HOVER = 'rgba(56, 189, 248, 0.45)';
const WATER_STROKE = 'rgba(125, 211, 252, 0.75)';

const WATER_SOURCE_ID = 'water-region-overlays';
const WATER_FILL_LAYER_ID = 'water-overlay-fill';
const WATER_OUTLINE_LAYER_ID = 'water-overlay-outline';

type MapProjection = 'globe' | 'mercator';

function applyMapProjection(map: MapboxMap, projection: MapProjection) {
  map.setProjection(projection);
}

type Props = {
  rows: GeographyImpactRow[];
  globalActiveProjectCount: number;
  activeProjectsWithoutMappedGeography: number;
  defaultFocusBounds: MapBounds | null;
  defaultFocusLabel: string | null;
};

function storageKey(row: GeographyImpactRow): string {
  return row.geographyKind === 'country' ? `c:${row.geographyId}` : `w:${row.geographyId}`;
}

function layerKeyFromParsed(token: string | null): {
  iso: string | null;
  waterId: string | null;
} {
  if (!token) return { iso: null, waterId: null };
  if (token.startsWith('c:')) return { iso: token.slice(2), waterId: null };
  if (token.startsWith('w:')) return { iso: null, waterId: token.slice(2) };
  return { iso: null, waterId: null };
}

type GeoJsonPolygon = {
  type: 'Polygon';
  coordinates: [number, number][][];
};

type GeoJsonMultiPolygon = {
  type: 'MultiPolygon';
  coordinates: [number, number][][][];
};

type GeoJsonGeometry = GeoJsonPolygon | GeoJsonMultiPolygon;

type WaterRegionFeature = {
  type: 'Feature';
  properties: {
    gid?: string;
    id?: string;
    name?: string;
  };
  geometry: GeoJsonGeometry | null;
};

type WaterRegionFeatureCollection = {
  type: 'FeatureCollection';
  features: readonly WaterRegionFeature[];
};

function boundsToPolygon(bounds: MapBounds): GeoJsonPolygon {
  const [[west, south], [east, north]] = bounds;
  return {
    type: 'Polygon',
    coordinates: [
      [
        [west, south],
        [east, south],
        [east, north],
        [west, north],
        [west, south],
      ],
    ],
  };
}

const STATIC_WATER_GEOMETRIES = new Map<string, GeoJsonGeometry>(
  ((seaRegionsGeoJson as unknown as WaterRegionFeatureCollection).features ?? [])
    .filter((feature) => feature.geometry !== null)
    .map(
      (feature): [string, GeoJsonGeometry] => [
        feature.properties.gid ?? feature.properties.id ?? '',
        feature.geometry as unknown as GeoJsonGeometry,
      ],
    )
    .filter(([gid]) => gid.length > 0),
);

function waterGeometryForRow(row: GeographyImpactRow): GeoJsonGeometry | null {
  const staticGeometry = STATIC_WATER_GEOMETRIES.get(row.geographyId);
  if (staticGeometry) return staticGeometry;
  return row.waterBounds ? boundsToPolygon(row.waterBounds) : null;
}

function buildHoverHtml(row: GeographyImpactRow): string {
  const foreground = 'hsl(var(--card-foreground))';
  const muted = 'hsl(var(--muted-foreground))';
  const scope =
    row.geographyKind === 'water'
      ? 'Sea / ocean programme area.'
      : 'Country / territory.';
  const projectsLine = `${row.activeProjects} active project${row.activeProjects === 1 ? '' : 's'}`;
  const metricsHtml = row.metrics
    .slice(0, 4)
    .map(
      (m) =>
        `<div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;color:${foreground}"><span style="color:${muted}">${m.indicator_label}</span><span style="font-variant-numeric:tabular-nums">${d3.format(',.0f')(m.total)} ${m.unit}</span></div>`,
    )
    .join('');

  return `
    <div style="font-family:system-ui,sans-serif;min-width:200px;max-width:280px">
      <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:${foreground}">${row.geographyLabel}</p>
      <p style="margin:0 0 6px;font-size:11px;line-height:1.35;color:${muted}">${scope}</p>
      <p style="margin:0 0 6px;font-size:12px;color:${muted}">${projectsLine}</p>
      ${metricsHtml || `<p style="margin:0;font-size:12px;color:${muted};font-style:italic">No headline metrics yet</p>`}
    </div>
  `;
}

const COUNTRY_FEATURE = {
  source: 'country-boundaries',
  sourceLayer: 'country_boundaries',
} as const;

function buildCountryFilter(activeIsoCodes: readonly string[]): unknown[] {
  if (activeIsoCodes.length === 0) {
    return ['literal', false] as unknown[];
  }
  return [
    'all',
    ['in', ['get', 'iso_3166_1_alpha_3'], ['literal', activeIsoCodes]],
    ['match', ['get', 'worldview'], ['all', 'US'], true, false],
  ];
}

function setCountryFeatureState(
  map: MapboxMap,
  iso: string,
  state: { hover?: boolean; selected?: boolean },
) {
  map.setFeatureState({ ...COUNTRY_FEATURE, id: iso }, state);
}

function setWaterFeatureState(
  map: MapboxMap,
  gid: string,
  state: { hover?: boolean; selected?: boolean },
) {
  map.setFeatureState({ source: WATER_SOURCE_ID, id: gid }, state);
}

function addCountryLayers(map: MapboxMap, activeIsoCodes: readonly string[]) {
  map.addSource('country-boundaries', {
    type: 'vector',
    url: 'mapbox://mapbox.country-boundaries-v1',
    promoteId: { country_boundaries: 'iso_3166_1_alpha_3' },
  });

  map.addLayer(
    {
      id: 'country-active-fill',
      type: 'fill',
      source: 'country-boundaries',
      'source-layer': 'country_boundaries',
      filter: buildCountryFilter(activeIsoCodes) as never,
      paint: {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          FILL_HOVER,
          ['boolean', ['feature-state', 'selected'], false],
          FILL_HOVER,
          FILL_BASE,
        ],
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          FILL_OPACITY_HOVER,
          ['boolean', ['feature-state', 'selected'], false],
          FILL_OPACITY_HOVER,
          FILL_OPACITY_BASE,
        ],
      },
    },
    'country-label',
  );

  map.addLayer(
    {
      id: 'country-active-outline',
      type: 'line',
      source: 'country-boundaries',
      'source-layer': 'country_boundaries',
      filter: buildCountryFilter(activeIsoCodes) as never,
      paint: {
        'line-color': STROKE_COLOR,
        'line-width': 0.8,
        'line-opacity': 0.6,
      },
    },
    'country-label',
  );
}

function addWaterLayers(map: MapboxMap) {
  map.addSource(WATER_SOURCE_ID, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
    promoteId: 'gid',
  });

  map.addLayer({
    id: WATER_FILL_LAYER_ID,
    type: 'fill',
    source: WATER_SOURCE_ID,
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        WATER_FILL_HOVER,
        ['boolean', ['feature-state', 'selected'], false],
        WATER_FILL_HOVER,
        WATER_FILL_BASE,
      ],
      'fill-outline-color': WATER_STROKE,
    },
  });

  map.addLayer({
    id: WATER_OUTLINE_LAYER_ID,
    type: 'line',
    source: WATER_SOURCE_ID,
    layout: {},
    paint: {
      'line-color': WATER_STROKE,
      'line-width': 1,
      'line-opacity': 0.9,
    },
  });
}

type WaterRegionOverlayFeatureCollection = {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: { gid: string; name: string };
    geometry: GeoJsonGeometry;
  }>;
};

function buildWaterRegionsGeoJSON(
  rows: readonly GeographyImpactRow[],
): WaterRegionOverlayFeatureCollection {
  const features = rows
    .filter((r) => r.geographyKind === 'water')
    .map((r) => {
      const geometry = waterGeometryForRow(r);
      if (!geometry) return null;
      return {
        type: 'Feature' as const,
        properties: { gid: r.geographyId, name: r.geographyLabel },
        geometry,
      };
    })
    .filter((feature): feature is NonNullable<typeof feature> => feature !== null);

  return {
    type: 'FeatureCollection',
    features,
  };
}

function applyCountryFilters(
  map: MapboxMap,
  activeIsoCodes: readonly string[],
) {
  const filter = buildCountryFilter(activeIsoCodes);
  if (map.getLayer('country-active-fill')) {
    map.setFilter('country-active-fill', filter as never);
  }
  if (map.getLayer('country-active-outline')) {
    map.setFilter('country-active-outline', filter as never);
  }
}

type CountryInteract = {
  map: MapboxMap;
  popup: MapboxPopup;
  hoveredIsoRef: React.RefObject<string | null>;
  rowsByGeoKeyRef: React.RefObject<Map<string, GeographyImpactRow>>;
  hoveredWaterRef: React.RefObject<string | null>;
  onSelectCountry: (iso: string) => void;
  onSelectWater: (gid: string) => void;
};

type GeographyMouseEvent = MapboxMapMouseEvent;

function clearCountryHover(ci: CountryInteract) {
  const { map, hoveredIsoRef } = ci;
  if (hoveredIsoRef.current) {
    setCountryFeatureState(map, hoveredIsoRef.current, { hover: false });
    hoveredIsoRef.current = null;
  }
}

function clearWaterHover(ci: CountryInteract) {
  const { map, hoveredWaterRef } = ci;
  if (hoveredWaterRef.current) {
    setWaterFeatureState(map, hoveredWaterRef.current, { hover: false });
    hoveredWaterRef.current = null;
  }
}

function handleCountryMouseMove(ci: CountryInteract, e: GeographyMouseEvent) {
  const { map, popup, rowsByGeoKeyRef } = ci;
  const feature = e.features?.[0] as { id?: string | number } | undefined;
  const iso = (feature?.id as string | undefined) ?? null;
  if (!iso) return;
  map.getCanvas().style.cursor = 'pointer';
  clearWaterHover(ci);

  const previous = ci.hoveredIsoRef.current;
  if (previous && previous !== iso) {
    setCountryFeatureState(map, previous, { hover: false });
  }
  setCountryFeatureState(map, iso, { hover: true });
  ci.hoveredIsoRef.current = iso;

  const row = rowsByGeoKeyRef.current.get(`c:${iso}`);
  if (!row) return;
  popup.setLngLat(e.lngLat).setHTML(buildHoverHtml(row)).addTo(map);
}

function handleCountryMouseLeave(ci: CountryInteract) {
  ci.map.getCanvas().style.cursor = '';
  clearCountryHover(ci);
  ci.popup.remove();
}

function handleCountryClick(ci: CountryInteract, e: GeographyMouseEvent) {
  const feature = e.features?.[0] as { id?: string | number } | undefined;
  const iso = (feature?.id as string | undefined) ?? null;
  if (!iso) return;
  if (!ci.rowsByGeoKeyRef.current.has(`c:${iso}`)) return;
  ci.onSelectCountry(iso);
}

function handleWaterMouseMove(ci: CountryInteract, e: GeographyMouseEvent) {
  const { map, popup, rowsByGeoKeyRef } = ci;
  const props = e.features?.[0]?.properties as { gid?: string } | undefined;
  const gid = String(props?.gid ?? '');
  if (!gid) return;
  map.getCanvas().style.cursor = 'pointer';
  clearCountryHover(ci);

  const previous = ci.hoveredWaterRef.current;
  if (previous && previous !== gid) {
    setWaterFeatureState(map, previous, { hover: false });
  }
  setWaterFeatureState(map, gid, { hover: true });
  ci.hoveredWaterRef.current = gid;

  const row = rowsByGeoKeyRef.current.get(`w:${gid}`);
  if (!row) return;
  popup.setLngLat(e.lngLat).setHTML(buildHoverHtml(row)).addTo(map);
}

function handleWaterMouseLeave(ci: CountryInteract) {
  ci.map.getCanvas().style.cursor = '';
  clearWaterHover(ci);
  ci.popup.remove();
}

function handleWaterClick(ci: CountryInteract, e: GeographyMouseEvent) {
  const props = e.features?.[0]?.properties as { gid?: string } | undefined;
  const gid = String(props?.gid ?? '');
  if (!gid) return;
  if (!ci.rowsByGeoKeyRef.current.has(`w:${gid}`)) return;
  ci.onSelectWater(gid);
}

function attachGeographyInteractions(ci: CountryInteract) {
  const { map } = ci;
  map.on('mousemove', 'country-active-fill', (e) =>
    handleCountryMouseMove(ci, e),
  );
  map.on('mouseleave', 'country-active-fill', () =>
    handleCountryMouseLeave(ci),
  );
  map.on('click', 'country-active-fill', (e) =>
    handleCountryClick(ci, e),
  );

  map.on('mousemove', WATER_FILL_LAYER_ID, (e) =>
    handleWaterMouseMove(ci, e),
  );
  map.on('mouseleave', WATER_FILL_LAYER_ID, () =>
    handleWaterMouseLeave(ci),
  );
  map.on('click', WATER_FILL_LAYER_ID, (e) => handleWaterClick(ci, e));
}

function applyGeoHighlight(
  map: MapboxMap,
  prevToken: string | null,
  nextToken: string | null,
) {
  const prev = layerKeyFromParsed(prevToken);
  const next = layerKeyFromParsed(nextToken);

  if (prev.iso && next.iso !== prev.iso)
    setCountryFeatureState(map, prev.iso, { selected: false });
  if (prev.waterId && next.waterId !== prev.waterId)
    setWaterFeatureState(map, prev.waterId, { selected: false });

  if (next.iso) setCountryFeatureState(map, next.iso, { selected: true });
  if (next.waterId) setWaterFeatureState(map, next.waterId, { selected: true });
}

function applyDefaultFocus(map: MapboxMap, bounds: MapBounds | null) {
  if (!bounds) return;
  const west = bounds[0][0];
  const south = bounds[0][1];
  const east = bounds[1][0];
  const north = bounds[1][1];
  const lngSpan = Math.abs(east - west);
  const latSpan = Math.abs(north - south);
  const span = Math.max(lngSpan, latSpan);
  const center: [number, number] = [(west + east) / 2, (south + north) / 2];

  let zoom = 2.4;
  if (span < 18) zoom = 2.7;
  if (span > 55) zoom = 1.6;

  map.jumpTo({
    center,
    zoom,
  });
}

function resizeMapToContainer(map: MapboxMap, bounds: MapBounds | null) {
  map.resize();
  applyDefaultFocus(map, bounds);
}

export default function MapView({
  rows,
  globalActiveProjectCount,
  activeProjectsWithoutMappedGeography,
  defaultFocusBounds,
  defaultFocusLabel,
}: Readonly<Props>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const popupRef = useRef<MapboxPopup | null>(null);
  const hoveredIsoRef = useRef<string | null>(null);
  const hoveredWaterRef = useRef<string | null>(null);
  const rowsByGeoKeyRef = useRef<Map<string, GeographyImpactRow>>(new Map());
  const [selectedGeo, setSelectedGeo] = useState<string | null>(null);
  const [projection, setProjection] = useState<MapProjection>('globe');

  const rowsByGeoKey = useMemo(() => {
    const m = new Map<string, GeographyImpactRow>();
    for (const r of rows) {
      m.set(storageKey(r), r);
    }
    return m;
  }, [rows]);

  useEffect(() => {
    rowsByGeoKeyRef.current = rowsByGeoKey;
  }, [rowsByGeoKey]);

  useEffect(() => {
    if (selectedGeo && !rowsByGeoKey.has(selectedGeo)) {
      setSelectedGeo(null);
    }
  }, [selectedGeo, rowsByGeoKey]);

  const activeIsoCodes = useMemo(
    () =>
      rows
        .filter((r) => r.geographyKind === 'country')
        .map((r) => r.geographyId),
    [rows],
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    async function initMap() {
      const mapboxgl = (await import('mapbox-gl')).default;
      if (cancelled || !containerRef.current) return;

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [10, 20],
        zoom: 1.2,
        cooperativeGestures: true,
        attributionControl: false,
        projection: 'globe',
      });
      map.addControl(
        new mapboxgl.AttributionControl({ compact: true }),
        'bottom-left',
      );
      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'top-left',
      );

      mapRef.current = map;

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 8,
        className: 'maerl-country-map-popup',
      });
      popupRef.current = popup;

      map.on('load', () => {
        if (!mapRef.current) return;
        const m = mapRef.current;

        addCountryLayers(m, activeIsoCodes);
        addWaterLayers(m);

        const waterData = buildWaterRegionsGeoJSON(rows);
        const src = m.getSource(WATER_SOURCE_ID);
        if (src && 'setData' in src) src.setData(waterData);

        resizeMapToContainer(m, defaultFocusBounds);
        attachGeographyInteractions({
          map: m,
          popup,
          hoveredIsoRef,
          hoveredWaterRef,
          rowsByGeoKeyRef,
          onSelectCountry: (iso) => setSelectedGeo(`c:${iso}`),
          onSelectWater: (gid) => setSelectedGeo(`w:${gid}`),
        });
        requestAnimationFrame(() => resizeMapToContainer(m, defaultFocusBounds));
        globalThis.setTimeout(
          () => resizeMapToContainer(m, defaultFocusBounds),
          250,
        );
      });
    }

    void initMap();

    return () => {
      cancelled = true;
      hoveredIsoRef.current = null;
      hoveredWaterRef.current = null;
      popupRef.current?.remove();
      popupRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    let frame: number | null = null;
    const observer = new ResizeObserver(() => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (mapRef.current) {
          resizeMapToContainer(mapRef.current, defaultFocusBounds);
        }
      });
    });

    observer.observe(container);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [defaultFocusBounds]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const apply = () => applyMapProjection(map, projection);

    if (map.isStyleLoaded()) apply();
    else map.once('load', apply);
  }, [projection]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer('country-active-fill')) return;
    const apply = () => applyCountryFilters(map, activeIsoCodes);
    if (map.isStyleLoaded()) apply();
    else map.once('idle', apply);
  }, [activeIsoCodes]);

  useEffect(() => {
    const map = mapRef.current;
    const src = map?.getSource(WATER_SOURCE_ID);
    if (!map || !src || !('setData' in src)) return;
    src.setData(buildWaterRegionsGeoJSON(rows));
  }, [rows]);

  const previouslySelectedRef = useRef<string | null>(null);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () =>
      applyGeoHighlight(
        map,
        previouslySelectedRef.current,
        selectedGeo,
      );
    if (
      map.isStyleLoaded() &&
      map.getSource('country-boundaries') &&
      map.getSource(WATER_SOURCE_ID)
    ) {
      apply();
    } else {
      map.once('idle', apply);
    }
    previouslySelectedRef.current = selectedGeo;
  }, [selectedGeo]);

  const selectedRow = useMemo(() => {
    if (!selectedGeo) return null;
    return rowsByGeoKey.get(selectedGeo) ?? null;
  }, [selectedGeo, rowsByGeoKey]);

  const footerChips =
    defaultFocusLabel ||
    globalActiveProjectCount > 0 ||
    activeProjectsWithoutMappedGeography > 0;

  return (
    <div className='relative h-full w-full'>
      <div
        ref={containerRef}
        className='h-full w-full overflow-hidden rounded-lg'
      />

      <div className='absolute right-3 top-3 z-20'>
        <ToggleGroup
          type='single'
          value={projection}
          onValueChange={(value) => {
            if (value === 'globe' || value === 'mercator') {
              setProjection(value);
            }
          }}
          className='rounded-md border border-border/60 bg-background/90 p-0.5 shadow-sm backdrop-blur-md'
        >
          <ToggleGroupItem
            value='globe'
            size='sm'
            aria-label='Globe projection'
            className='h-7 gap-1 px-2 text-xs data-[state=on]:bg-muted'
          >
            <GlobeIcon className='h-3.5 w-3.5' />
            Globe
          </ToggleGroupItem>
          <ToggleGroupItem
            value='mercator'
            size='sm'
            aria-label='Flat map projection'
            className='h-7 gap-1 px-2 text-xs data-[state=on]:bg-muted'
          >
            <MapIcon className='h-3.5 w-3.5' />
            Flat
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {selectedRow && (
        <GeographyDetailPanel
          row={selectedRow}
          onClose={() => setSelectedGeo(null)}
        />
      )}

      {footerChips && (
        <div className='absolute bottom-2 right-2 flex max-w-[calc(100%-1rem)] flex-col items-end gap-1 text-[11px] text-muted-foreground'>
          {defaultFocusLabel && (
            <p className='rounded-md bg-background/80 px-2 py-1 backdrop-blur-sm'>
              Focus: {defaultFocusLabel}
            </p>
          )}
          {globalActiveProjectCount > 0 && (
            <p className='rounded-md bg-background/80 px-2 py-1 backdrop-blur-sm'>
              {globalActiveProjectCount} Global programme
              {globalActiveProjectCount === 1 ? '' : 's'} · not plotted on map
              (by design).
            </p>
          )}
          {activeProjectsWithoutMappedGeography > 0 && (
            <p className='rounded-md bg-background/80 px-2 py-1 backdrop-blur-sm'>
              + {activeProjectsWithoutMappedGeography} active project
              {activeProjectsWithoutMappedGeography === 1 ? '' : 's'} without a
              map label (missing or unsupported region text).
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function GeographyDetailPanel({
  row,
  onClose,
}: Readonly<{ row: GeographyImpactRow; onClose: () => void }>) {
  const scopeHint =
    row.geographyKind === 'water'
      ? 'Marine programme geography.'
      : 'Country / territory from Mapbox boundaries.';

  return (
    <aside className='absolute right-3 top-12 flex max-h-[calc(100%-3.5rem)] w-[300px] max-w-[calc(100%-1.5rem)] flex-col gap-3 overflow-hidden rounded-lg border border-border/60 bg-background/95 p-4 shadow-lg backdrop-blur-md'>
      <header className='flex items-start justify-between gap-2'>
        <div className='flex flex-col gap-0.5'>
          <p className='text-base font-semibold'>{row.geographyLabel}</p>
          <p className='text-xs text-muted-foreground'>{scopeHint}</p>
          <p className='text-xs text-muted-foreground'>
            {row.activeProjects} active project
            {row.activeProjects === 1 ? '' : 's'}
          </p>
        </div>
        <button
          type='button'
          onClick={onClose}
          aria-label='Close geography details'
          className='rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
        >
          <XIcon className='h-4 w-4' />
        </button>
      </header>

      {row.metrics.length > 0 && (
        <ul className='flex flex-col gap-1.5'>
          {row.metrics.map((m) => (
            <li
              key={m.indicator_code}
              className='flex items-baseline justify-between gap-3 text-xs'
            >
              <span className='text-muted-foreground'>{m.indicator_label}</span>
              <span className='tabular-nums'>
                {d3.format(',.0f')(m.total)} {m.unit}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className='flex flex-col gap-1.5 overflow-y-auto'>
        <p className='text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
          Projects
        </p>
        <ul className='flex flex-col gap-1'>
          {row.projects.map((p) => {
            const projectBase = p.project_type === 'Unit' ? 'units' : 'projects';
            return (
              <li key={p.id}>
                <Link
                  href={`/${projectBase}/${p.slug}`}
                  className='block rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-muted hover:text-foreground'
                >
                  {p.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
