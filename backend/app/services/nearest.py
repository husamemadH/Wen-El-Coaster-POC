"""nearest_behind(user_point, route, coasters) -> Coaster | None.

Snaps every candidate to the route via ST_LineLocatePoint, filters out ones
already past the rider, returns the closest remaining coaster.
"""
