"""Route ORM + Pydantic schema.

Fields: id, name (en/ar), color, polyline (PostGIS LINESTRING),
stops (JSON), stop_zones (PostGIS MULTIPOLYGON — used by the ML feature
``near_stop_zone``).
"""
