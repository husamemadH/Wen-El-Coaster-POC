


# Wen El Coaster — وين الكوستر؟

**A live tracker for Jordan's informal coaster minibuses.** Riders standing on a
specific track can see whether a coaster is coming and roughly how long it will
take — with an ML-based ETA that accounts for the constant informal stops that
make simple `distance ÷ speed` predictions useless.

> Built for **AI Expo Jordan 2026** — IEEE CIS, University of Jordan.

---

## Demo

**Video walkthrough:**

https://github.com/user-attachments/assets/0b7cec66-0625-4146-941b-d5a3a749d2a0

**Live demo:** <https://coaster.archbyhusam.click>

---

## The Problem

Coasters (**باصات الكوستر**) are Jordan's de-facto public transit — informal
minibuses that each run a fixed route all day (University of Jordan, Sweileh,
Baqaa, Jarash, Zarqa, and dozens more feeding into central Amman).

Despite carrying a huge share of daily trips, coasters have **zero digital
infrastructure**:

- No official schedule.
- No live tracking.
- No way for a rider to know if one is coming or how far away it is.
- Frequent unofficial stops make arrival times genuinely hard to guess even
  when the vehicle is visible.

Existing map apps (Google Maps, Moovit) don't model informal transit at all in
Amman. Rider WhatsApp groups and word-of-mouth are the current "system."

## The Solution

A minimal, single-purpose app: **pick your coaster route and see if one is
coming and roughly when.** Nothing else.

Design rules that shape the product:

- **Route-scoped view.** You only see coasters on the route you've selected
  from the dropdown. Other routes are drawn as faint dashed lines for context,
  but they never clutter the ETA banner.
- **Nearest coaster only** (for now). A short "next in 4 min, then 11 min"
  queue is planned once we have data density to make it meaningful.
- **Bilingual, mobile-first.** Arabic and English side-by-side; the target
  user is on a phone at a curb.

## How the AI Fits In

The interesting part isn't "put a bus on a map" — it's predicting arrival time
for vehicles that stop unpredictably.

**Model:** a gradient-boosted regressor (LightGBM) that predicts
`traversal_time_seconds` **per route segment**, then sums predictions across the
segments between the coaster and the rider.

The route is chopped into fixed segments (~500 m, or between known landmarks).
For each segment we predict travel time from:

| Feature | Why it matters |
|---|---|
| `segment_id` | Some parts of the route are structurally slower (traffic circles, market street). |
| `time_of_day_bucket` | Best proxy for congestion without paying for a live traffic API. |
| `day_type` (weekday / weekend) | Amman traffic pattern shifts on Thursday and Friday. |
| `near_stop_zone` (0/1) | Segments near known informal stopping spots take longer on average. |

Why gradient boosting rather than deep learning: dataset is small (tens of
trips per route), features are tabular, and interpretability matters when we
need to debug bad predictions. A tree ensemble is the right tool for the job
and can ship after a single afternoon of training.

## Data

**Source:** GPS traces collected by riding coasters with a phone GPS logger,
sampling `(timestamp, lat, lng, speed)` every 5–10 s.

**Bootstrapping target (bootcamp scope):**

- Start with **one route** (University of Jordan — highest ridership, easiest
  to validate by riding it ourselves).
- Collect **15–20 full trips**, spread across morning rush / midday / evening
  and both weekdays and weekends.
- Label segments by projecting each trace onto the pre-drawn route polyline
  and taking the time delta between consecutive segment boundaries.

**Preprocessing:** map-match each raw fix to the nearest point on the route
polyline; drop fixes outside a ~50 m buffer as GPS noise; split into segments;
compute per-segment traversal time as the label.

**Split:** trip-level 80/10/10 (train/val/test) — splitting by fix would leak
because consecutive fixes are highly correlated within a trip.

Long-term data plan (post-POC): a small pool of committed drivers running a
background tracking app for clean training data, plus rider self-reports for
coverage and freshness.

## System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│  Rider phone (Expo / React Native, also runs in the browser)   │
│  ─────────────────────────────────────────────────────────     │
│  • Geolocation → on-route check (buffer around polyline)       │
│  • Map (Leaflet on web, react-native-maps on native)           │
│  • Route picker, ETA banner, Report FAB                        │
└──────────────────────────────┬─────────────────────────────────┘
                               │  HTTPS / JSON
                               ▼
┌────────────────────────────────────────────────────────────────┐
│  FastAPI service  (skeleton in this POC)                       │
│  ─────────────────────────────────────────────────────────     │
│  /routes    static route polylines + stops                     │
│  /coasters  live positions on a given route                    │
│  /eta       segment-sum prediction for a (coaster, rider) pair │
│  /reports   crowdsourced rider sightings                       │
└─────────┬──────────────────────────────────────────┬───────────┘
          │                                          │
          ▼                                          ▼
┌────────────────────────┐              ┌───────────────────────────┐
│  PostgreSQL + PostGIS  │              │  ETA model (LightGBM)     │
│  routes, stops,        │              │  loaded once at startup;  │
│  live positions,       │              │  predicts per-segment     │
│  historical GPS traces │              │  traversal time.          │
└────────────────────────┘              └───────────────────────────┘
```

Two independent input streams feed live positions in production:

1. **Driver app** — background GPS pings from a small pool of committed drivers.
2. **Rider reports** — "I see a coaster here" taps from the app (already wired
   in the frontend as a Report FAB).

## Tech Stack

**Frontend** — Expo (React Native) + `react-native-web` for a single codebase
that runs on iOS, Android, and the browser. Leaflet + CARTO Voyager tiles on
web (no API key required); `react-native-maps` on native. TypeScript throughout.

**Backend** _(intended stack; skeleton only in this POC)_ — FastAPI, SQLAlchemy
+ GeoAlchemy2, PostgreSQL 16 with PostGIS 3, Pydantic for validation.

**ML** — scikit-learn / LightGBM for the segment-ETA model, joblib for
serialisation, Shapely for geospatial preprocessing.

**Deployment target** — containerised backend behind a reverse proxy, Postgres
managed instance, static web build on any CDN. `deploy.sh` sketches the
intended flow.

## Getting Started

```bash
git clone https://github.com/husamemadH/Wen-El-Coaster-POC.git
cd Wen-El-Coaster-POC/frontend
npm install
npm run web            # or: npm run ios / npm run android
```

**Try this flow:**

1. Pick a track on the first screen (e.g. **University of Jordan**).
2. The map centres on you (or the Amman fallback) and shows only that track's
   coasters. Other tracks appear as faint dashed lines.
3. If you're within ~250 m of the highlighted polyline, the top banner shows
   the nearest coaster's ETA. Otherwise it tells you how far off-track you
   are.
4. Tap **Report coaster** (bottom-right) to drop a manual pin — this is the
   crowdsourced-report path from the roadmap.

## Project Status

**Stage: Working Demo (frontend) + Prototype spec (backend / ML).**

| Piece | State |
|---|---|
| Route selection, map, on-track detection | ✅ Working |
| Nearest-coaster + rule-based ETA (distance ÷ avg speed) | ✅ Working |
| Rider report flow (manual pin) | ✅ Working |
| Bilingual UI (Arabic + English) | ✅ Working |
| Simulated live coasters (5 routes) | ✅ Working |
| FastAPI backend | 🟡 File-structure skeleton; every file has a docstring describing intended behaviour |
| PostGIS schema | 🟡 SQL sketched in `backend/app/db/schema.sql` |
| LightGBM ETA model | 🔴 Not trained — awaiting the first tranche of GPS traces |
| Driver-side tracking app | 🔴 Deferred; see Roadmap |

**Known limitations of the current POC:**

- Coaster positions in the demo are simulated (interpolated along the
  polyline), not live vehicles.
- Route polylines are hand-drawn approximations, not survey-grade.
- ETA in the demo is a straight-line placeholder — the real ML model needs
  the data-collection phase below to exist.

## Roadmap

1. **Collect the first 20 UoJ trips** — hand-carried GPS logger, spread across
   time-of-day buckets.
2. **Train v1 of the segment ETA model** and swap it in behind `/eta`.
3. **Stand up the FastAPI + PostGIS backend** on a small managed VM.
4. **Recruit 2–3 driver participants** for continuous position pings on one
   route.
5. **Public beta on the UoJ route** to measure real ETA error against ground
   truth.
6. **Expand route-by-route** once the pipeline is validated.

## Expected Impact

**Who benefits:** every daily coaster rider in Amman — students, workers,
people without a car. This is transit infrastructure for the majority of
Amman's population that has been ignored by every mapping product.

**Measurable improvement:** replacing "stand at the curb and hope" with a
concrete ETA that's meaningfully better than random. Target for v1: median
absolute ETA error under 3 minutes on the UoJ route.

**Opportunity beyond the expo:** the same route + ETA plumbing generalises
across every informal transit system in the region (service taxis, tuk-tuks,
Cairo microbuses). The scarce ingredient is on-the-ground data collection, not
technology.

## Repo Layout

```
Wen-El-Coaster-POC/
├── POC.md                  Original product brief.
├── README.md               This file.
├── frontend/               Expo (React Native) app — runs on web via
│   ├── App.tsx             react-native-web. Fully working demo.
│   └── src/
│       ├── screens/        RouteSelect, Home, Report
│       ├── components/     Map (web + native), ETABanner, RouteDropdown, etc.
│       ├── hooks/          useUserLocation, useCoasters, useCustomStops
│       ├── services/       api (mock), eta, location
│       ├── data/           Seed routes + simulated coasters (Amman)
│       ├── i18n/           Arabic + English translations
│       ├── utils/          geo (haversine, on-path)
│       └── theme/
├── backend/                FastAPI + PostGIS + LightGBM.
│   ├── app/                Skeleton only — every file has a docstring
│   │   ├── api/            describing intended behaviour so reviewers can
│   │   ├── services/       see the full shape of the production system.
│   │   ├── ml/
│   │   ├── models/
│   │   ├── db/
│   │   └── data/
│   └── tests/
└── deploy.sh               Intended deployment sketch.
```

## License

MIT
