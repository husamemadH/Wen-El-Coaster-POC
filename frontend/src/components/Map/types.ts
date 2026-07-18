import { Coaster, LatLng, Route } from '@/types';

export type MapProps = {
  center: LatLng;
  zoom?: number;
  route?: Route;
  otherRoutes?: Route[];
  coasters: Coaster[];
  userLocation?: LatLng | null;
  onMapTap?: (p: LatLng) => void;
  highlightedCoasterId?: string;
  selectedStopName?: string;
  onStopTap?: (stopName: string) => void;
};
