# Wen El Coaster — POC

Proof-of-concept for the coaster tracker app described in [`POC.md`](./POC.md).

- **`frontend/`** — Expo (React Native) app that runs in the browser via
  `react-native-web`. Fully working: map, live coaster simulation, on-track
  detection, ETA banner, route picker, and a rider-report flow.
- **`backend/`** — Intentional **file-structure-only skeleton**. Every file has
  a docstring describing what it would do; nothing is implemented. It's here so
  reviewers can see the shape of the production system.

## Run the frontend (web)

```bash
cd frontend
npm install
npm run web
```

Open the printed URL (usually http://localhost:8081). If the browser prompts
for location, allow it — otherwise the app falls back to a default point in
Amman.

### What to try

1. Pick a track on the first screen (e.g. **University of Jordan**).
2. The map centers on you (or the Amman fallback) and shows only that track's
   coasters. Other tracks are drawn as faint dashed lines so you can see the
   "single-track" rule in action.
3. If you're within ~250m of the highlighted polyline, the top banner shows
   the nearest coaster's ETA. Otherwise it tells you how far off-track you
   are.
4. Tap **Report coaster** (bottom-right) to drop a manual pin — mirrors the
   crowdsourced-report path from `POC.md`.

## Map choice

Basemap: [CARTO Voyager](https://carto.com/basemaps/) raster tiles via
Leaflet. Free, no API key, and stylistically close to Google Maps. Swappable
for Google Maps JS API by editing `frontend/src/components/Map/Map.web.tsx`.

## Project layout

```
Wen-El-Coaster-POC/
├── POC.md                 Original product brief
├── frontend/              React Native (Expo) — runs on web
│   ├── App.tsx
│   ├── src/
│   │   ├── screens/       RouteSelect, Home, Report
│   │   ├── components/    Map (web + native), ETABanner, RouteChips, ReportFab
│   │   ├── hooks/         useUserLocation, useCoasters, useOnRoute
│   │   ├── services/      api (mock), eta, location
│   │   ├── data/          Seed routes + coasters (Amman)
│   │   ├── utils/         geo (haversine, on-path)
│   │   ├── types/
│   │   └── theme/
│   └── ...
└── backend/               Skeleton only — see backend/README.md
```
