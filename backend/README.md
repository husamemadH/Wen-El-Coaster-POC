# backend/

**Skeleton only.** Not implemented in this POC — every file is a stub whose
docstring describes what it *would* do in a production build. Kept here so the
demo audience can see the intended shape of the API and ML pieces referenced
in [`POC.md`](../POC.md).

## Intended stack

- **FastAPI** for HTTP endpoints — matches the `/routes`, `/coasters`, `/eta`,
  `/reports` shape used by `frontend/src/services/api.ts`.
- **PostgreSQL + PostGIS** for route polylines, informal-stop zones, and
  historical GPS traces (spatial queries are the whole game here).
- **scikit-learn / LightGBM** for the segment-level ETA model described in the
  "Model Inputs" section of `POC.md`.

## Folder layout

```
app/
├── main.py             FastAPI entrypoint — wires routers, CORS, DB session.
├── api/                HTTP routers, one file per resource.
├── models/             Pydantic + ORM models shared by API and services.
├── services/           Business logic (on-route detection, nearest coaster,
│                       ETA orchestration). No HTTP concerns here.
├── ml/                 Training + inference for the segment ETA model.
├── data/               Static route polylines + raw GPS traces from rides.
└── db/                 Schema + seed SQL.
tests/                  pytest package (empty for POC).
```
