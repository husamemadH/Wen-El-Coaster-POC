import { Coaster, CoasterReport, Route, RouteId, RouteStop } from '@/types';
import { ROUTES } from '@/data/routes';
import { initialCoasters } from '@/data/mockCoasters';

/**
 * Frontend-facing API client. In this POC every method is served from local
 * mock data — but the shape mirrors the real REST endpoints defined in
 * backend/app/api/. Swapping to fetch(...) later should be a one-file change.
 */

const state = {
  coasters: initialCoasters(),
  customStops: {} as Record<RouteId, RouteStop[]>,
};

export const api = {
  async listRoutes(): Promise<Route[]> {
    return ROUTES;
  },

  async listCoasters(routeId?: string): Promise<Coaster[]> {
    return routeId ? state.coasters.filter((c) => c.routeId === routeId) : state.coasters;
  },

  async reportCoaster(report: CoasterReport): Promise<{ ok: true }> {
    // Optimistic local insert — a real backend would validate + dedupe.
    state.coasters.push({
      id: `R-${Math.floor(Math.random() * 9999)}`,
      routeId: report.routeId,
      position: report.point,
      headingDeg: 0,
      speedKmh: 0,
      updatedAt: report.reportedAt,
      source: 'rider_report',
    });
    return { ok: true };
  },

  async suggestStop(routeId: RouteId, stop: RouteStop): Promise<{ ok: true }> {
    // In production this hits POST /reports?type=stop and starts a moderation
    // flow; the frontend just marks it pending until the backend verifies.
    const list = state.customStops[routeId] ?? [];
    state.customStops[routeId] = [...list, { ...stop, pending: true }];
    return { ok: true };
  },

  async confirmStop(routeId: RouteId, stopName: string): Promise<{ ok: true }> {
    // POC shortcut: one confirmation flips it. A real backend would need N
    // distinct riders + trust scoring before promoting the stop.
    const list = state.customStops[routeId] ?? [];
    state.customStops[routeId] = list.map((s) =>
      s.name === stopName ? { ...s, pending: false } : s,
    );
    return { ok: true };
  },
};

export const _mockState = state;
