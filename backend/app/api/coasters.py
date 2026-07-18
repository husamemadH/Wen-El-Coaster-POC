"""GET /routes/{route_id}/coasters — live coasters on a specific track.

Applies the "only show what's on your track" rule server-side: coasters more
than ~250m from the polyline are filtered out before response. Intended to be
polled every 3-5s from the frontend (or upgraded to a WebSocket stream).
"""
