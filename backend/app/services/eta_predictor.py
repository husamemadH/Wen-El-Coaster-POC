"""Runtime wrapper around the trained ETA model.

Walks the route segments between coaster and rider, invokes the model on each,
sums the predicted per-segment durations. Falls back to distance / avg-speed
if the model isn't loaded yet (see the "phased" plan in POC.md).
"""
