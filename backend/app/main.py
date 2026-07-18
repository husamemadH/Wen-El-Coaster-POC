"""FastAPI entrypoint.

Not implemented. In production this file would:

- create the FastAPI app,
- attach CORS for the web frontend,
- open a DB session per request (PostgreSQL + PostGIS),
- mount the routers from ``app/api/*``,
- load the trained ETA model from ``app/ml/`` at startup.
"""
