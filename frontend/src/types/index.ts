export type LatLng = {
  lat: number;
  lng: number;
};

export type RouteId = 'uoj' | 'jarash' | 'sweileh' | 'baqaa' | 'zarqa';

export type RouteStop = {
  name: string;
  nameAr: string;
  point: LatLng;
  /** Crowdsourced stops start pending until the backend verifies them. */
  pending?: boolean;
};

export type Route = {
  id: RouteId;
  nameEn: string;
  nameAr: string;
  color: string;
  path: LatLng[];
  stops: RouteStop[];
};

export type TimeOfDay = 'morning_rush' | 'midday' | 'evening' | 'night';

export type SimConfig = {
  timeOfDay: TimeOfDay;
  rain: boolean;
};

export type CoasterSource = 'driver_app' | 'rider_report';

export type Coaster = {
  id: string;
  routeId: RouteId;
  position: LatLng;
  headingDeg: number;
  speedKmh: number;
  updatedAt: number;
  plate?: string;
  source: CoasterSource;
};

export type Eta = {
  coasterId: string;
  distanceMeters: number;
  seconds: number;
  confidence: 'low' | 'medium' | 'high';
};

export type OnRouteResult = {
  onRoute: boolean;
  distanceMeters: number;
  nearestPoint?: LatLng;
};

export type CoasterReport = {
  routeId: RouteId;
  point: LatLng;
  note?: string;
  reportedAt: number;
};
