import { Coaster, Eta, LatLng, Route, SimConfig, TimeOfDay } from '@/types';
import { haversine, progressAlongPath } from '@/utils/geo';
import { Lang, translations } from '@/i18n/translations';

const WALK_SPEED_MPS = 1.39; // ~5 km/h — average adult walking pace

export const DEFAULT_SIM: SimConfig = { timeOfDay: 'midday', rain: false };

// Baseline multipliers to fake the effect of the ML features from POC.md
// (time_of_day_bucket, rainy). Replaced by the real model in production.
const TIME_MULT: Record<TimeOfDay, number> = {
  morning_rush: 1.6,
  midday: 1.0,
  evening: 1.4,
  night: 0.85,
};
const RAIN_MULT = 1.3;

export const simMultiplier = (sim: SimConfig): number =>
  TIME_MULT[sim.timeOfDay] * (sim.rain ? RAIN_MULT : 1);

export type Walk = { distanceMeters: number; seconds: number };

export const computeWalk = (from: LatLng, to: LatLng): Walk => {
  const distanceMeters = haversine(from, to);
  return {
    distanceMeters,
    seconds: Math.round(distanceMeters / WALK_SPEED_MPS),
  };
};

export const formatDistance = (m: number, lang: Lang = 'en'): string => {
  const u = translations[lang].units;
  return m < 1000 ? `${Math.round(m)} ${u.m}` : `${(m / 1000).toFixed(1)} ${u.km}`;
};

/**
 * MVP ETA — remaining distance along the route divided by a stop-aware
 * average speed. In production, the ML model in backend/app/ml/ replaces
 * the constants here.
 */
const AVG_SPEED_MPS = 6.5; // ~23 km/h, factoring in unofficial stops

export const computeEta = (
  coaster: Coaster,
  route: Route,
  userPoint: { lat: number; lng: number },
  sim: SimConfig = DEFAULT_SIM,
): Eta | null => {
  const coasterProgress = progressAlongPath(coaster.position, route.path);
  const userProgress = progressAlongPath(userPoint, route.path);
  const distanceMeters = userProgress - coasterProgress;
  if (distanceMeters <= 0) return null; // coaster already passed
  const straight = haversine(coaster.position, userPoint);
  const distanceConf: Eta['confidence'] =
    distanceMeters < 1500 ? 'high' : distanceMeters < 4000 ? 'medium' : 'low';
  // Rider-reported positions are inherently less trustworthy than a
  // driver-app GPS ping, so cap their confidence one notch lower.
  const confidence: Eta['confidence'] =
    coaster.source === 'rider_report'
      ? distanceConf === 'high'
        ? 'medium'
        : 'low'
      : distanceConf;
  const baseSeconds = distanceMeters / AVG_SPEED_MPS;
  return {
    coasterId: coaster.id,
    distanceMeters: Math.max(distanceMeters, straight),
    seconds: Math.round(baseSeconds * simMultiplier(sim)),
    confidence,
  };
};

export const formatEta = (seconds: number, lang: Lang = 'en'): string => {
  const u = translations[lang].units;
  if (seconds < 60) return u.lessThanMin;
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} ${u.minShort}`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return `${h}${u.hourShort} ${r}${u.minInHourShort}`;
};
