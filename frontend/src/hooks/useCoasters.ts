import { useEffect, useRef, useState } from 'react';
import { Coaster, RouteId } from '@/types';
import { api, _mockState } from '@/services/api';
import { routeById } from '@/data/routes';
import { haversine } from '@/utils/geo';

/**
 * Simulates coasters advancing along their polyline every tick, so the demo
 * has motion without a backend. Delete this file once the real API streams
 * coaster positions.
 */
const TICK_MS = 1200;
const METERS_PER_TICK = 90;

const step = () => {
  for (const c of _mockState.coasters) {
    const route = routeById(c.routeId);
    if (!route) continue;
    let remaining = METERS_PER_TICK;
    let pos = c.position;
    let idx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < route.path.length - 1; i++) {
      const d = haversine(pos, route.path[i]);
      if (d < bestDist) {
        bestDist = d;
        idx = i;
      }
    }
    while (remaining > 0 && idx < route.path.length - 1) {
      const next = route.path[idx + 1];
      const segRemaining = haversine(pos, next);
      if (segRemaining > remaining) {
        const t = remaining / segRemaining;
        pos = {
          lat: pos.lat + (next.lat - pos.lat) * t,
          lng: pos.lng + (next.lng - pos.lng) * t,
        };
        remaining = 0;
      } else {
        pos = next;
        remaining -= segRemaining;
        idx++;
      }
    }
    // Loop back to start once it hits the end, so demo never runs empty.
    if (idx >= route.path.length - 1 && remaining > 0) {
      pos = route.path[0];
    }
    c.position = pos;
    c.updatedAt = Date.now();
  }
};

export const useCoasters = (routeId?: RouteId) => {
  const [coasters, setCoasters] = useState<Coaster[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      const list = await api.listCoasters(routeId);
      if (mounted) setCoasters(list.map((c) => ({ ...c })));
    };
    refresh();
    timer.current = setInterval(() => {
      step();
      refresh();
    }, TICK_MS);
    return () => {
      mounted = false;
      if (timer.current) clearInterval(timer.current);
    };
  }, [routeId]);

  return coasters;
};
