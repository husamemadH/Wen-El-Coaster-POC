import { Coaster, RouteId } from '@/types';
import { ROUTES } from './routes';

/**
 * Seed coaster fleet — 1-3 per route, dropped somewhere along the polyline
 * with a plausible heading. In a real build, this comes from the backend
 * (driver-app pings or rider crowd-reports).
 */
const seed: Array<
  Omit<Coaster, 'position' | 'headingDeg' | 'updatedAt' | 'speedKmh'> & { pathIndex: number }
> = [
  { id: 'C-4471', routeId: 'uoj', plate: '54-27893', pathIndex: 1 },
  { id: 'C-1188', routeId: 'uoj', plate: '54-11832', pathIndex: 3 },
  { id: 'C-6604', routeId: 'uoj', plate: '54-66041', pathIndex: 5 },
  { id: 'C-2317', routeId: 'uoj', plate: '54-23171', pathIndex: 7 },
  { id: 'C-9022', routeId: 'sweileh', plate: '54-90221', pathIndex: 1 },
  { id: 'C-4038', routeId: 'sweileh', plate: '54-40381', pathIndex: 4 },
  { id: 'C-7145', routeId: 'sweileh', plate: '54-71458', pathIndex: 6 },
  { id: 'C-3341', routeId: 'baqaa', plate: '54-33417', pathIndex: 2 },
  { id: 'C-8829', routeId: 'baqaa', plate: '54-88291', pathIndex: 5 },
  { id: 'C-1075', routeId: 'baqaa', plate: '54-10758', pathIndex: 8 },
  { id: 'C-7712', routeId: 'jarash', plate: '54-77129', pathIndex: 3 },
  { id: 'C-2205', routeId: 'jarash', plate: '54-22054', pathIndex: 6 },
  { id: 'C-6690', routeId: 'jarash', plate: '54-66908', pathIndex: 9 },
  { id: 'C-5580', routeId: 'zarqa', plate: '54-55803', pathIndex: 2 },
  { id: 'C-8891', routeId: 'zarqa', plate: '54-88917', pathIndex: 5 },
  { id: 'C-3374', routeId: 'zarqa', plate: '54-33742', pathIndex: 8 },
];

const bearing = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const y = Math.sin(toRad(b.lng - a.lng)) * Math.cos(toRad(b.lat));
  const x =
    Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) -
    Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(toRad(b.lng - a.lng));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
};

export const initialCoasters = (): Coaster[] => {
  const now = Date.now();
  return seed.map((s) => {
    const route = ROUTES.find((r) => r.id === s.routeId)!;
    const a = route.path[s.pathIndex];
    const b = route.path[Math.min(s.pathIndex + 1, route.path.length - 1)];
    return {
      id: s.id,
      routeId: s.routeId as RouteId,
      plate: s.plate,
      position: { ...a },
      headingDeg: bearing(a, b),
      speedKmh: 25 + Math.random() * 15,
      updatedAt: now,
      source: 'driver_app',
    };
  });
};
