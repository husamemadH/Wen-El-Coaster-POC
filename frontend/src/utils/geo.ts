import { LatLng, OnRouteResult } from '@/types';

const R = 6371000; // Earth radius, meters
const toRad = (d: number) => (d * Math.PI) / 180;

export const haversine = (a: LatLng, b: LatLng): number => {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

/**
 * Distance from a point to a segment on a flat plane — fine at city scale.
 * Returns { dist, projection } in the same latlng space.
 */
const pointToSegment = (
  p: LatLng,
  a: LatLng,
  b: LatLng,
): { distMeters: number; projection: LatLng } => {
  const ax = a.lng;
  const ay = a.lat;
  const bx = b.lng;
  const by = b.lat;
  const px = p.lng;
  const py = p.lat;
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  let t = len2 === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const projection: LatLng = { lng: ax + t * dx, lat: ay + t * dy };
  return { distMeters: haversine(p, projection), projection };
};

export const nearestOnPath = (point: LatLng, path: LatLng[]): OnRouteResult => {
  let best = { distMeters: Infinity, projection: path[0] };
  for (let i = 0; i < path.length - 1; i++) {
    const r = pointToSegment(point, path[i], path[i + 1]);
    if (r.distMeters < best.distMeters) best = r;
  }
  return {
    onRoute: best.distMeters <= 250, // 250m tolerance for "on track"
    distanceMeters: best.distMeters,
    nearestPoint: best.projection,
  };
};

/**
 * Signed progress along the path in meters from index 0.
 * Used to decide which coaster is "behind" the rider vs. already passed.
 */
export const progressAlongPath = (point: LatLng, path: LatLng[]): number => {
  let bestDist = Infinity;
  let bestIdx = 0;
  let bestProj: LatLng = path[0];
  for (let i = 0; i < path.length - 1; i++) {
    const r = pointToSegment(point, path[i], path[i + 1]);
    if (r.distMeters < bestDist) {
      bestDist = r.distMeters;
      bestIdx = i;
      bestProj = r.projection;
    }
  }
  let total = 0;
  for (let i = 0; i < bestIdx; i++) total += haversine(path[i], path[i + 1]);
  total += haversine(path[bestIdx], bestProj);
  return total;
};

export const pathLengthMeters = (path: LatLng[]): number => {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) total += haversine(path[i], path[i + 1]);
  return total;
};
