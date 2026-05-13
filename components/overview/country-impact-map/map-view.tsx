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
import type { CountryImpactRow } from './server-actions';
import type { MapBounds } from './country-iso-map';

// Fill colors. The basemap (dark-v11) provides the muted grey for inactive
// countries, so we only fill where Maerl works. Hover gets a brighter tone
// driven entirely by feature-state to avoid React re-renders on every move.
const FILL_BASE = '#22c55e';
const FILL_HOVER = '#4ade80';
const FILL_OPACITY_BASE = 0.45;
const FILL_OPACITY_HOVER = 0.7;
const STROKE_COLOR = '#86efac';

type Props = {
  rows: CountryImpactRow[];
  activeProjectsWithoutCountry: number;
  defaultFocusBounds: MapBounds | null;
  defaultFocusLabel: string | null;
};

function buildHoverHtml(row: CountryImpactRow): string {
  const projectsLine = `${row.activeProjects} active project${row.activeProjects === 1 ? '' : 's'}`;
  const metricsHtml = row.metrics
    .slice(0, 4)
    .map(
      (m) =>
        `<div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;color:#333"><span style="color:#666">${m.indicator_label}</span><span style="font-variant-numeric:tabular-nums">${d3.format(',.0f')(m.total)} ${m.unit}</span></div>`,
    )
    .join('');

  return `
    <div style="font-family:system-ui,sans-serif;min-width:200px;max-width:260px">
      <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#1a1a2e">${row.countryDisplay}</p>
      <p style="margin:0 0 6px;font-size:12px;color:#555">${projectsLine}</p>
      ${metricsHtml || '<p style="margin:0;font-size:12px;color:#888;font-style:italic">No headline metrics yet</p>'}
    </div>
  `;
}

const COUNTRY_FEATURE = {
  source: 'country-boundaries',
  sourceLayer: 'country_boundaries',
} as const;

function buildCountryFilter(activeIsoCodes: readonly string[]): unknown[] {
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

function addCountryLayers(map: MapboxMap, activeIsoCodes: readonly string[]) {
  // Promote the alpha-3 ISO code as the feature id so feature-state
  // hover/selection works across tile boundaries.
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

type InteractionHandles = {
  map: MapboxMap;
  popup: MapboxPopup;
  hoveredIsoRef: React.RefObject<string | null>;
  rowsByIsoRef: React.RefObject<Map<string, CountryImpactRow>>;
  onSelect: (iso: string) => void;
};

type CountryMouseEvent = MapboxMapMouseEvent & {
  features?: Array<{ id?: string | number }>;
};

function handleCountryMouseMove(
  handles: InteractionHandles,
  e: CountryMouseEvent,
) {
  const { map, popup, hoveredIsoRef, rowsByIsoRef } = handles;
  const feature = e.features?.[0];
  const iso = (feature?.id as string | undefined) ?? null;
  if (!iso) return;
  map.getCanvas().style.cursor = 'pointer';

  const previous = hoveredIsoRef.current;
  if (previous && previous !== iso) {
    setCountryFeatureState(map, previous, { hover: false });
  }
  if (iso !== previous) {
    setCountryFeatureState(map, iso, { hover: true });
  }
  hoveredIsoRef.current = iso;

  const row = rowsByIsoRef.current.get(iso);
  if (!row) return;
  popup.setLngLat(e.lngLat).setHTML(buildHoverHtml(row)).addTo(map);
}

function handleCountryMouseLeave(handles: InteractionHandles) {
  const { map, popup, hoveredIsoRef } = handles;
  map.getCanvas().style.cursor = '';
  if (hoveredIsoRef.current) {
    setCountryFeatureState(map, hoveredIsoRef.current, { hover: false });
    hoveredIsoRef.current = null;
  }
  popup.remove();
}

function handleCountryClick(
  handles: InteractionHandles,
  e: CountryMouseEvent,
) {
  const feature = e.features?.[0];
  const iso = (feature?.id as string | undefined) ?? null;
  if (!iso) return;
  if (!handles.rowsByIsoRef.current.has(iso)) return;
  handles.onSelect(iso);
}

function attachCountryInteractions(handles: InteractionHandles) {
  const { map } = handles;
  map.on('mousemove', 'country-active-fill', (e) =>
    handleCountryMouseMove(handles, e),
  );
  map.on('mouseleave', 'country-active-fill', () =>
    handleCountryMouseLeave(handles),
  );
  map.on('click', 'country-active-fill', (e) =>
    handleCountryClick(handles, e),
  );
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

function applySelection(
  map: MapboxMap,
  previous: string | null,
  next: string | null,
) {
  if (previous && previous !== next) {
    setCountryFeatureState(map, previous, { selected: false });
  }
  if (next && next !== previous) {
    setCountryFeatureState(map, next, { selected: true });
  }
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

  // A tight fitBounds on globe projection can expose a large black "space"
  // area below high-latitude regions (e.g. UK & Channel Islands). Use a soft
  // regional camera instead: still focuses the user's region, but keeps enough
  // earth in view that the map reads as a globe rather than a clipped panel.
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

function resizeCurrentMap(
  mapRef: React.RefObject<MapboxMap | null>,
  bounds: MapBounds | null,
) {
  if (!mapRef.current) return;
  resizeMapToContainer(mapRef.current, bounds);
}

function scheduleInitialResize(
  mapRef: React.RefObject<MapboxMap | null>,
  bounds: MapBounds | null,
) {
  requestAnimationFrame(() => resizeCurrentMap(mapRef, bounds));
  globalThis.setTimeout(() => resizeCurrentMap(mapRef, bounds), 250);
}

export default function MapView({
  rows,
  activeProjectsWithoutCountry,
  defaultFocusBounds,
  defaultFocusLabel,
}: Readonly<Props>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('mapbox-gl').Map | null>(null);
  const popupRef = useRef<import('mapbox-gl').Popup | null>(null);
  const hoveredIsoRef = useRef<string | null>(null);
  // Mapbox's click handler is registered once; reading from a ref keeps
  // it in sync with the latest row data without re-subscribing.
  const rowsByIsoRef = useRef<Map<string, CountryImpactRow>>(new Map());
  const [selectedIso, setSelectedIso] = useState<string | null>(null);

  const rowsByIso = useMemo(() => {
    const m = new Map<string, CountryImpactRow>();
    for (const r of rows) m.set(r.iso3, r);
    return m;
  }, [rows]);

  // Keep the ref in sync for the long-lived map handlers.
  useEffect(() => {
    rowsByIsoRef.current = rowsByIso;
  }, [rowsByIso]);

  const activeIsoCodes = useMemo(() => rows.map((r) => r.iso3), [rows]);

  // Initialise the map once. Subsequent data changes are pushed to the
  // existing instance via setFilter in the activeIsoCodes effect.
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
        // Cooperative gestures: trackpad pinch + Cmd/Ctrl-scroll zoom the
        // map; plain mouse-wheel scroll passes through to the page so the
        // map doesn't hijack vertical navigation. Two-finger touch is
        // required to pan on mobile.
        cooperativeGestures: true,
        attributionControl: false,
        projection: 'globe',
      });
      map.addControl(
        new mapboxgl.AttributionControl({ compact: true }),
        'bottom-left',
      );
      // Keep the zoom controls clear of the country detail panel, which
      // anchors to top-right when a country is selected.
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
        addCountryLayers(mapRef.current, activeIsoCodes);
        resizeMapToContainer(mapRef.current, defaultFocusBounds);
        attachCountryInteractions({
          map: mapRef.current,
          popup,
          hoveredIsoRef,
          rowsByIsoRef,
          onSelect: setSelectedIso,
        });
        scheduleInitialResize(mapRef, defaultFocusBounds);
      });
    }

    void initMap();

    return () => {
      cancelled = true;
      popupRef.current?.remove();
      popupRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      hoveredIsoRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mapbox reads its container dimensions at init time. The overview layout
  // can shift shortly after first paint as async cards resolve, so keep the
  // canvas in sync with the actual rendered container.
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

  // Sync filter expressions when the active ISO list changes (e.g. when the
  // user's RLS scope or the underlying data shifts after first paint).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => applyCountryFilters(map, activeIsoCodes);
    if (map.isStyleLoaded() && map.getLayer('country-active-fill')) {
      apply();
    } else {
      map.once('idle', apply);
    }
  }, [activeIsoCodes]);

  // Push selection into feature-state so the chosen country stays
  // highlighted even after the cursor leaves the map. Tracks the previous
  // selection across renders so we can clear it.
  const previouslySelectedRef = useRef<string | null>(null);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () =>
      applySelection(map, previouslySelectedRef.current, selectedIso);
    if (map.isStyleLoaded() && map.getSource('country-boundaries')) {
      apply();
    } else {
      map.once('idle', apply);
    }
    previouslySelectedRef.current = selectedIso;
  }, [selectedIso]);

  const selectedRow = selectedIso ? rowsByIso.get(selectedIso) ?? null : null;

  return (
    <div className='relative h-full w-full'>
      <div
        ref={containerRef}
        className='h-full w-full overflow-hidden rounded-lg'
      />

      {selectedRow && (
        <CountryPanel
          row={selectedRow}
          onClose={() => setSelectedIso(null)}
        />
      )}

      {(defaultFocusLabel || activeProjectsWithoutCountry > 0) && (
        <div className='absolute bottom-2 right-2 flex max-w-[calc(100%-1rem)] flex-col items-end gap-1 text-[11px] text-muted-foreground'>
          {defaultFocusLabel && (
            <p className='rounded-md bg-background/80 px-2 py-1 backdrop-blur-sm'>
              Focus: {defaultFocusLabel}
            </p>
          )}
          {activeProjectsWithoutCountry > 0 && (
            <p className='rounded-md bg-background/80 px-2 py-1 backdrop-blur-sm'>
              + {activeProjectsWithoutCountry} active project
              {activeProjectsWithoutCountry === 1 ? '' : 's'} without region or
              country data
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function CountryPanel({
  row,
  onClose,
}: Readonly<{ row: CountryImpactRow; onClose: () => void }>) {
  return (
    <aside className='absolute right-3 top-3 flex max-h-[calc(100%-1.5rem)] w-[280px] max-w-[calc(100%-1.5rem)] flex-col gap-3 overflow-hidden rounded-lg border border-border/60 bg-background/95 p-4 shadow-lg backdrop-blur-md'>
      <header className='flex items-start justify-between gap-2'>
        <div className='flex flex-col gap-0.5'>
          <p className='text-base font-semibold'>{row.countryDisplay}</p>
          <p className='text-xs text-muted-foreground'>
            {row.activeProjects} active project
            {row.activeProjects === 1 ? '' : 's'}
          </p>
        </div>
        <button
          type='button'
          onClick={onClose}
          aria-label='Close country details'
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
