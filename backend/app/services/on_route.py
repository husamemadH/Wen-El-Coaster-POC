"""on_route(point, route) -> (on_route: bool, distance_m: float, projection).

PostGIS ST_Distance against the route LINESTRING, with a per-route tolerance
(default 250m) that accounts for GPS drift in dense urban Amman.
"""
