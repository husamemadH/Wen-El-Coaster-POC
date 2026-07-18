import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { MapProps } from './types';
import { colors } from '@/theme/colors';

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

// Load Leaflet CSS once, before any map mounts. Metro's asset pipeline
// doesn't handle `import 'leaflet/dist/leaflet.css'` cleanly, so we inject
// the stylesheet manually.
const ensureCss = () => {
  if (typeof document === 'undefined') return;
  if (document.querySelector(`link[href="${LEAFLET_CSS}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = LEAFLET_CSS;
  document.head.appendChild(link);
};

const coasterIcon = (
  L: any,
  color: string,
  highlighted: boolean,
  source: 'driver_app' | 'rider_report',
) => {
  const size = highlighted ? 34 : 28;
  const isReport = source === 'rider_report';
  // Driver-app pings render solid + full-color. Rider reports render as a
  // hollow ghost with a dashed ring, so users can see at a glance which
  // positions are trustworthy vs. crowdsourced.
  const bg = isReport ? '#ffffff' : color;
  const border = isReport ? `2px dashed ${color}` : `3px solid #fff`;
  const iconColor = isReport ? color : '#fff';
  const opacity = isReport ? 0.9 : 1;
  return L.divIcon({
    className: 'coaster-marker',
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${bg};
      border:${border};
      box-shadow:0 4px 12px rgba(15,23,42,${isReport ? 0.15 : 0.35});
      opacity:${opacity};
      display:flex;align-items:center;justify-content:center;
      color:${iconColor};font-weight:700;font-size:14px;font-family:system-ui;
    ">🚐</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const userIcon = (L: any) =>
  L.divIcon({
    className: 'user-marker',
    html: `<div style="
      width:18px;height:18px;border-radius:50%;
      background:#1F6FEB;border:3px solid #fff;
      box-shadow:0 0 0 6px rgba(31,111,235,0.25);
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

const stopIcon = (L: any, color: string, selected: boolean, pending = false) => {
  const size = selected ? 22 : 16;
  const border = pending
    ? `${selected ? 4 : 3}px dashed ${color}`
    : `${selected ? 4 : 3}px solid ${color}`;
  const bg = pending ? '#FEF3C7' : '#fff';
  return L.divIcon({
    className: 'stop-marker',
    html: `<div title="${pending ? 'Pending stop — tap to select' : 'Tap to see next coaster'}" style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${bg};border:${border};
      box-shadow:0 2px 6px rgba(15,23,42,0.25);
      cursor:pointer;
      ${selected ? `outline:4px solid ${color}40;` : ''}
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const WebMap: React.FC<MapProps> = ({
  center,
  zoom = 13,
  route,
  otherRoutes,
  coasters,
  userLocation,
  onMapTap,
  highlightedCoasterId,
  selectedStopName,
  onStopTap,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const onMapTapRef = useRef(onMapTap);
  const onStopTapRef = useRef(onStopTap);
  const layersRef = useRef<{
    routeLine?: any;
    otherLines: any[];
    stops: any[];
    coasterMarkers: Map<string, any>;
    userMarker?: any;
  }>({ otherLines: [], stops: [], coasterMarkers: new Map() });

  // Keep the latest onMapTap reachable from the once-registered Leaflet
  // click handler, so toggling placing mode actually takes effect.
  useEffect(() => {
    onMapTapRef.current = onMapTap;
  }, [onMapTap]);
  useEffect(() => {
    onStopTapRef.current = onStopTap;
  }, [onStopTap]);

  // Init map once.
  useEffect(() => {
    ensureCss();
    let cancelled = false;
    (async () => {
      // L imported at top of file
      if (cancelled || !containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, {
        center: [center.lat, center.lng],
        zoom,
        zoomControl: false,
        attributionControl: false,
      });
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map);

      // Google-Maps-like styled basemap from CARTO (free, no key).
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 20,
          attribution: '&copy; OpenStreetMap &copy; CARTO',
        },
      ).addTo(map);

      map.on('click', (e: any) => {
        const fn = onMapTapRef.current;
        if (fn) fn({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      mapRef.current = map;
      // Force layout on mount — Leaflet needs a size hint after RN Web wraps it.
      setTimeout(() => map.invalidateSize(), 50);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layersRef.current = { otherLines: [], stops: [], coasterMarkers: new Map() };
    };
    // Only run once. Center/zoom updates are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recenter when the parent moves the camera.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView([center.lat, center.lng], zoom, { animate: true });
  }, [center.lat, center.lng, zoom]);

  // Draw / refresh route polylines + stops.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // L imported at top of file
      const map = mapRef.current;
      if (!map || cancelled) return;
      const layers = layersRef.current;

      layers.routeLine && map.removeLayer(layers.routeLine);
      layers.otherLines.forEach((l) => map.removeLayer(l));
      layers.otherLines = [];
      layers.stops.forEach((l) => map.removeLayer(l));
      layers.stops = [];

      if (otherRoutes) {
        for (const r of otherRoutes) {
          const line = L.polyline(
            r.path.map((p) => [p.lat, p.lng]),
            { color: r.color, weight: 3, opacity: 0.18, dashArray: '4 6' },
          ).addTo(map);
          layers.otherLines.push(line);
        }
      }

      if (route) {
        layers.routeLine = L.polyline(
          route.path.map((p) => [p.lat, p.lng]),
          { color: route.color, weight: 6, opacity: 0.85, lineJoin: 'round', lineCap: 'round' },
        ).addTo(map);

        for (const s of route.stops) {
          const selected = s.name === selectedStopName;
          const m = L.marker([s.point.lat, s.point.lng], {
            icon: stopIcon(L, route.color, selected, s.pending),
            zIndexOffset: selected ? 500 : 100,
          }).addTo(map);
          m.bindTooltip(s.pending ? `${s.name} (pending)` : s.name, {
            direction: 'top',
            offset: [0, -8],
          });
          m.on('click', (e: any) => {
            e.originalEvent?.stopPropagation?.();
            const fn = onStopTapRef.current;
            if (fn) fn(s.name);
          });
          layers.stops.push(m);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [route, otherRoutes, selectedStopName]);

  // Coasters — reuse markers keyed by id so they animate instead of flickering.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // L imported at top of file
      const map = mapRef.current;
      if (!map || cancelled) return;
      const layers = layersRef.current;
      const seen = new Set<string>();

      for (const c of coasters) {
        seen.add(c.id);
        const color = route?.color ?? colors.primary;
        const existing = layers.coasterMarkers.get(c.id);
        const highlighted = c.id === highlightedCoasterId;
        if (existing) {
          existing.setLatLng([c.position.lat, c.position.lng]);
          existing.setIcon(coasterIcon(L, color, highlighted, c.source));
        } else {
          const m = L.marker([c.position.lat, c.position.lng], {
            icon: coasterIcon(L, color, highlighted, c.source),
          }).addTo(map);
          const label =
            c.source === 'rider_report'
              ? `Coaster ${c.id} · rider-reported`
              : `Coaster ${c.id} · driver-app`;
          m.bindTooltip(label, { direction: 'top', offset: [0, -14] });
          layers.coasterMarkers.set(c.id, m);
        }
      }
      for (const [id, m] of Array.from(layers.coasterMarkers.entries())) {
        if (!seen.has(id)) {
          map.removeLayer(m);
          layers.coasterMarkers.delete(id);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [coasters, highlightedCoasterId, route]);

  // User pin.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // L imported at top of file
      const map = mapRef.current;
      if (!map || cancelled) return;
      const layers = layersRef.current;
      if (!userLocation) {
        layers.userMarker && map.removeLayer(layers.userMarker);
        layers.userMarker = undefined;
        return;
      }
      if (layers.userMarker) {
        layers.userMarker.setLatLng([userLocation.lat, userLocation.lng]);
      } else {
        layers.userMarker = L.marker([userLocation.lat, userLocation.lng], {
          icon: userIcon(L),
          zIndexOffset: 1000,
        }).addTo(map);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userLocation]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, background: '#e8ecf1' }}
    />
  );
};

export default WebMap;
