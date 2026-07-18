"""Coaster + CoasterPing models.

- Coaster: stable identity (plate, route assignment).
- CoasterPing: time-series of (coaster_id, ts, lat, lng, speed, source) — the
  raw input to both live tracking and offline ETA training.
"""
