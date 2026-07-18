"""GET /routes/{route_id}/eta?user_lat=..&user_lng=..

Runs the on-route check, picks the nearest coaster still behind the rider, and
returns the ML-predicted ETA plus a confidence band.
"""
