# Coaster Tracker — App Idea

## The Problem

Coasters (باصات الكوستر) are Jordan's informal minibus system. Each coaster runs a fixed route ("track") all day — e.g. كوستر الجامعة الاردنية, Jarash, Swelih, Baqaa — but:

- There's no official schedule or live tracking.
- Riders have no idea if a coaster is coming, or how far away it is.
- Coasters stop constantly at informal (unofficial but well-known) spots to wait for passengers, making arrival time hard to predict.

## The Idea

A website/app where a rider standing on a specific coaster route can see:

- **Is there a coaster coming on my route right now?**
- **Roughly when will it reach my location?**

Key rule: **you only see a coaster if you're on its track.** If you're not on that route, it doesn't show up — no clutter, no confusion between routes. Only the _nearest_ coaster on your specific route is shown.

## How It Works (Concept)

1. **Routes are pre-defined** for each track (University of Jordan, Jarash, Swelih, Baqaa, etc.) as a mapped path.
2. **Rider location** is checked against the route — a buffer/tolerance zone accounts for GPS drift, so "on the track" doesn't mean pixel-perfect.
3. **Coaster location** is collected (see Data Collection) and matched to the nearest point on its route.
4. **ETA is predicted** using a small ML model — not just straight-line distance ÷ speed, because coasters stop unpredictably to pick up passengers.

## Data Collection (Bootcamp Scope)

Focus on **one route** first (University of Jordan — high traffic, easy to validate by riding it yourself).

- Log GPS traces (timestamp, lat/lon, speed) every 5-10 seconds during real rides.
- Target: **15-20 full trips**, ideally from more than one rider/driver, spread across different times of day (morning rush / midday / evening).
- No need to build a production driver app yet — any simple GPS logger works for collecting training data at this stage.

## Model Inputs

The route is split into fixed **segments** (e.g. every 500m or between landmarks). For each segment, the model predicts travel time using:

| Feature                      | Why it matters                                              |
| ---------------------------- | ----------------------------------------------------------- |
| `segment_id`                 | Which part of the route this is                             |
| `time_of_day_bucket`         | Biggest proxy for traffic without needing live traffic data |
| `day_type` (weekday/weekend) | Amman traffic patterns shift on Thu/Fri                     |
| `near_stop_zone` (0/1)       | Flags segments near known informal stopping spots           |
| `rainy` (0/1, optional)      | Rain noticeably slows Amman traffic                         |

**Target:** `traversal_time_seconds` per segment.

This is intentionally simple — a gradient boosting or regression model on these features is enough to demonstrate real applied ML without needing deep learning or huge datasets.

## Open Questions / Design Decisions Still Needed

- **Data source long-term**: driver-installed app vs. crowdsourced rider reports vs. manual "I see it" taps. Likely a phased approach — start with rider self-reporting (no driver cooperation needed), use a small set of committed drivers for clean training data.
- **Multiple coasters per route**: show just the nearest, or a short queue ("next in 4 min, then 11 min")?
- **Trust/anti-spam**: what stops fake reports from riders?
- **Low-traffic routes**: what happens on routes with little crowdsourced data (e.g. Baqaa vs. University of Jordan)?
- **Route definition**: hand-drawn polylines to start; could later be inferred from collected GPS traces.

## Why This Is Interesting

- Solves a real, everyday problem for a system that has zero existing digital infrastructure.
- Combines geospatial logic (on-track detection, nearest-vehicle matching) with a genuine ML prediction problem (stop-aware ETA), not just a CRUD app.
- Naturally phased: a working rule-based MVP (distance ÷ average speed) can ship before the ML layer is trained, so there's always something demoable.

## Future Work (Beyond Bootcamp Scope)

- Live traffic API integration.
- Full driver-side background tracking app.
- Coverage across all major routes, not just one.
- Passenger-facing route discovery (which coaster do I even take to get from A to B).
