'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import * as d3 from 'd3';
import { XIcon } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import type {
  Map as MapboxMap,
  Popup as MapboxPopup,
  MapMouseEvent as MapboxMapMouseEvent,
} from 'mapbox-gl';
import { TWILIGHT_BLUE } from '@/utils/brand-colors';
import type { GeographyImpactRow } from './server-actions';
import type { MapBounds } from './country-iso-map';

const BRAND_FILL = TWILIGHT_BLUE;
const MARKER_HALO = '#ffffff';
const POLYGON_FILL_OPACITY = 0.22;
const POLYGON_FILL_OPACITY_ACTIVE = 0.24;
const POLYGON_STROKE_OPACITY = 0.5;

const MARKER_SOURCE_ID = 'impact-location-markers';
const MARKER_HALO_LAYER_ID = 'impact-location-marker-halo';
const MARKER_CORE_LAYER_ID = 'impact-location-marker-core';
const MARKER_HIT_LAYER_ID = 'impact-location-marker-hit';

type Props = {
  rows: GeographyImpactRow[];
  globalActiveProjectCount: number;
  activeProjectsWithoutMappedGeography: number;
  defaultFocusBounds: MapBounds | null;
  defaultFocusLabel: string | null;
};

function storageKey(row: GeographyImpactRow): string {
  if (row.geographyKind === 'country') return `c:${row.geographyId}`;
  if (row.geographyKind === 'water') return `w:${row.geographyId}`;
  return `p:${row.geographyId}`;
}

function layerKeyFromParsed(token: string | null): {
  iso: string | null;
  markerKey: string | null;
} {
  if (!token) return { iso: null, markerKey: null };
  if (token.startsWith('c:')) {
    return { iso: token.slice(2), markerKey: null };
  }
  if (token.startsWith('w:') || token.startsWith('p:')) {
    return { iso: null, markerKey: token };
  }
  return { iso: null, markerKey: null };
}

function buildHoverHtml(row: GeographyImpactRow): string {
  const foreground = 'hsl(var(--card-foreground))';
  const muted = 'hsl(var(--muted-foreground))';
  const scope = {
    country: 'Country / territory.',
    water: 'Sea / ocean programme area.',
    point: 'Project location marker.',
  }[row.geographyKind];
  const projectsLine = `${row.activeProjects} active project${row.activeProjects === 1 ? '' : 's'}`;
  const stats = row.headlineStats.length > 0 ? row.headlineStats : null;
  const headlineHtml = stats
    ?.slice(0, 4)
    .map(
      (stat) =>
        `<div style="font-size:12px;line-height:1.35;color:${foreground}">${escapeHtml(renderHeadlineStat(stat))}</div>`,
    )
    .join('');
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
      ${headlineHtml || metricsHtml || `<p style="margin:0;font-size:12px;color:${muted};font-style:italic">No headline metrics yet</p>`}
    </div>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatHeadlineValue(value: number): string {
  return d3.format(',.0f')(value);
}

function renderHeadlineStat(
  stat: GeographyImpactRow['headlineStats'][number],
): string {
  const value = formatHeadlineValue(stat.value);
  if (/\bx\b/i.test(stat.template)) {
    return stat.template.replace(/\bx\b/i, value);
  }
  return `${value} ${stat.template}`;
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

function setMarkerFeatureState(
  map: MapboxMap,
  key: string,
  state: { hover?: boolean; selected?: boolean },
) {
  map.setFeatureState({ source: MARKER_SOURCE_ID, id: key }, state);
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
        'fill-color': BRAND_FILL,
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          POLYGON_FILL_OPACITY_ACTIVE,
          ['boolean', ['feature-state', 'selected'], false],
          POLYGON_FILL_OPACITY_ACTIVE,
          POLYGON_FILL_OPACITY,
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
        'line-color': BRAND_FILL,
        'line-width': 0.8,
        'line-opacity': POLYGON_STROKE_OPACITY,
      },
    },
    'country-label',
  );
}

function addImpactMarkerLayers(map: MapboxMap) {
  map.addSource(MARKER_SOURCE_ID, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
    promoteId: 'key',
  });

  map.addLayer({
    id: MARKER_HALO_LAYER_ID,
    type: 'circle',
    source: MARKER_SOURCE_ID,
    paint: {
      'circle-radius': 10,
      'circle-color': MARKER_HALO,
      'circle-opacity': 0.9,
    },
  });

  map.addLayer({
    id: MARKER_CORE_LAYER_ID,
    type: 'circle',
    source: MARKER_SOURCE_ID,
    paint: {
      'circle-radius': 7,
      'circle-color': BRAND_FILL,
      'circle-stroke-color': MARKER_HALO,
      'circle-stroke-width': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        2,
        ['boolean', ['feature-state', 'selected'], false],
        2,
        1,
      ],
      'circle-opacity': 0.96,
    },
  });

  map.addLayer({
    id: MARKER_HIT_LAYER_ID,
    type: 'circle',
    source: MARKER_SOURCE_ID,
    paint: {
      'circle-radius': 22,
      'circle-color': 'rgba(255, 255, 255, 0)',
      'circle-opacity': 0,
    },
  });
}

type ImpactMarkerFeatureCollection = {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: {
      key: string;
      name: string;
      kind: 'water' | 'point';
      activeProjects: number;
    };
    geometry: {
      type: 'Point';
      coordinates: [number, number];
    };
  }>;
};

function buildImpactMarkersGeoJSON(
  rows: readonly GeographyImpactRow[],
): ImpactMarkerFeatureCollection {
  const features = rows
    .filter(
      (r) =>
        (r.geographyKind === 'water' || r.geographyKind === 'point') &&
        r.markerCoordinates !== null,
    )
    .map((r) => {
      return {
        type: 'Feature' as const,
        properties: {
          key: storageKey(r),
          name: r.geographyLabel,
          kind: r.geographyKind as 'water' | 'point',
          activeProjects: r.activeProjects,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: r.markerCoordinates as [number, number],
        },
      };
    });

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
  hoveredMarkerRef: React.RefObject<string | null>;
  onSelectCountry: (iso: string) => void;
  onSelectMarker: (key: string) => void;
};

type GeographyMouseEvent = MapboxMapMouseEvent;

function clearCountryHover(ci: CountryInteract) {
  const { map, hoveredIsoRef } = ci;
  if (hoveredIsoRef.current) {
    setCountryFeatureState(map, hoveredIsoRef.current, { hover: false });
    hoveredIsoRef.current = null;
  }
}

function clearMarkerHover(ci: CountryInteract) {
  const { map, hoveredMarkerRef } = ci;
  if (hoveredMarkerRef.current) {
    setMarkerFeatureState(map, hoveredMarkerRef.current, { hover: false });
    hoveredMarkerRef.current = null;
  }
}

function handleCountryMouseMove(ci: CountryInteract, e: GeographyMouseEvent) {
  const { map, popup, rowsByGeoKeyRef } = ci;
  const feature = e.features?.[0] as { id?: string | number } | undefined;
  const iso = (feature?.id as string | undefined) ?? null;
  if (!iso) return;
  map.getCanvas().style.cursor = 'pointer';
  clearMarkerHover(ci);

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

function handleMarkerMouseMove(ci: CountryInteract, e: GeographyMouseEvent) {
  const { map, popup, rowsByGeoKeyRef } = ci;
  const props = e.features?.[0]?.properties as { key?: string } | undefined;
  const key = String(props?.key ?? '');
  if (!key) return;
  map.getCanvas().style.cursor = 'pointer';
  clearCountryHover(ci);

  const previous = ci.hoveredMarkerRef.current;
  if (previous && previous !== key) {
    setMarkerFeatureState(map, previous, { hover: false });
  }
  setMarkerFeatureState(map, key, { hover: true });
  ci.hoveredMarkerRef.current = key;

  const row = rowsByGeoKeyRef.current.get(key);
  if (!row) return;
  popup.setLngLat(e.lngLat).setHTML(buildHoverHtml(row)).addTo(map);
}

function handleMarkerMouseLeave(ci: CountryInteract) {
  ci.map.getCanvas().style.cursor = '';
  clearMarkerHover(ci);
  ci.popup.remove();
}

function handleMarkerClick(ci: CountryInteract, e: GeographyMouseEvent) {
  const props = e.features?.[0]?.properties as { key?: string } | undefined;
  const key = String(props?.key ?? '');
  if (!key) return;
  if (!ci.rowsByGeoKeyRef.current.has(key)) return;
  ci.onSelectMarker(key);
}

function attachGeographyInteractions(ci: CountryInteract) {
  const { map } = ci;
  map.on('mousemove', 'country-active-fill', (e) =>
    handleCountryMouseMove(ci, e),
  );
  map.on('mouseleave', 'country-active-fill', () =>
    handleCountryMouseLeave(ci),
  );
  map.on('click', 'country-active-fill', (e) => handleCountryClick(ci, e));

  map.on('mousemove', MARKER_HIT_LAYER_ID, (e) => handleMarkerMouseMove(ci, e));
  map.on('mouseleave', MARKER_HIT_LAYER_ID, () => handleMarkerMouseLeave(ci));
  map.on('click', MARKER_HIT_LAYER_ID, (e) => handleMarkerClick(ci, e));
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
  if (prev.markerKey && next.markerKey !== prev.markerKey)
    setMarkerFeatureState(map, prev.markerKey, { selected: false });

  if (next.iso) setCountryFeatureState(map, next.iso, { selected: true });
  if (next.markerKey)
    setMarkerFeatureState(map, next.markerKey, { selected: true });
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
  const hoveredMarkerRef = useRef<string | null>(null);
  const rowsByGeoKeyRef = useRef<Map<string, GeographyImpactRow>>(new Map());
  const [selectedGeo, setSelectedGeo] = useState<string | null>(null);

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
    let resizeFrame: number | null = null;
    let resizeTimeout: ReturnType<typeof globalThis.setTimeout> | null = null;

    function resizeLiveMap(map: MapboxMap) {
      if (cancelled || mapRef.current !== map) return;
      resizeMapToContainer(map, defaultFocusBounds);
    }

    async function initMap() {
      const mapboxgl = (await import('mapbox-gl')).default;
      if (cancelled || !containerRef.current) return;

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
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
        if (cancelled || mapRef.current !== map) return;
        const m = map;

        addCountryLayers(m, activeIsoCodes);
        addImpactMarkerLayers(m);

        const markerData = buildImpactMarkersGeoJSON(rows);
        const markerSource = m.getSource(MARKER_SOURCE_ID);
        if (markerSource && 'setData' in markerSource) {
          markerSource.setData(markerData);
        }

        resizeMapToContainer(m, defaultFocusBounds);
        attachGeographyInteractions({
          map: m,
          popup,
          hoveredIsoRef,
          hoveredMarkerRef,
          rowsByGeoKeyRef,
          onSelectCountry: (iso) => setSelectedGeo(`c:${iso}`),
          onSelectMarker: setSelectedGeo,
        });
        resizeFrame = requestAnimationFrame(() => {
          resizeFrame = null;
          resizeLiveMap(m);
        });
        resizeTimeout = globalThis.setTimeout(() => {
          resizeTimeout = null;
          resizeLiveMap(m);
        }, 250);
      });
    }

    void initMap();

    return () => {
      cancelled = true;
      if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
      if (resizeTimeout !== null) globalThis.clearTimeout(resizeTimeout);
      hoveredIsoRef.current = null;
      hoveredMarkerRef.current = null;
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
    if (!map || !map.getLayer('country-active-fill')) return;
    const apply = () => applyCountryFilters(map, activeIsoCodes);
    if (map.isStyleLoaded()) apply();
    else map.once('idle', apply);
  }, [activeIsoCodes]);

  useEffect(() => {
    const map = mapRef.current;
    const src = map?.getSource(MARKER_SOURCE_ID);
    if (!map || !src || !('setData' in src)) return;
    src.setData(buildImpactMarkersGeoJSON(rows));
  }, [rows]);

  const previouslySelectedRef = useRef<string | null>(null);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () =>
      applyGeoHighlight(map, previouslySelectedRef.current, selectedGeo);
    if (
      map.isStyleLoaded() &&
      map.getSource('country-boundaries') &&
      map.getSource(MARKER_SOURCE_ID)
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
  const scopeHint = {
    country: 'Country / territory from Mapbox boundaries.',
    water: 'Marine programme marker.',
    point: 'Project location marker.',
  }[row.geographyKind];

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

      {row.headlineStats.length > 0 ? (
        <ul className='flex flex-col gap-1.5'>
          {row.headlineStats.map((stat) => (
            <li
              key={`${stat.template}-${stat.indicatorCodes.join('+')}`}
              className='text-xs leading-snug text-foreground'
            >
              {renderHeadlineStat(stat)}
            </li>
          ))}
        </ul>
      ) : row.metrics.length > 0 ? (
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
      ) : null}

      <div className='flex flex-col gap-1.5 overflow-y-auto'>
        <p className='text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
          Projects
        </p>
        <ul className='flex flex-col gap-1'>
          {row.projects.map((p) => {
            const projectBase =
              p.project_type === 'Unit' ? 'units' : 'projects';
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
