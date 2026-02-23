# AireMaile Backend

Backend API for AireMaile — an automated flight notification service for private airline coordinators and FBOs.

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Auth & Database:** Supabase (Postgres + RLS)
- **Email:** Resend
- **Flight Data:** Aviationstack API (free tier)
- **Scheduler:** node-cron

## Getting Started

```bash
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/flights/arrivals?airport=KDAL&airline=AA` | Get arrivals at an airport, filtered by airline |
| GET | `/api/flights/live?airline=AA` | Get live/active flights for an airline |
| GET | `/api/fbos` | List FBOs for your org |
| POST | `/api/fbos` | Register a new FBO |
| DELETE | `/api/fbos/:id` | Remove an FBO |
| POST | `/api/notifications/send` | Manually trigger an FBO notification |

## Aviationstack Free Tier Notes

- **100 requests/month** — conserve by not polling too aggressively
- **HTTP only** (no HTTPS on free tier) — do not send sensitive data through the flight API
- Upgrade to Basic ($49.99/mo) for HTTPS + 10,000 requests/month
- Sign up at https://aviationstack.com/signup/free

## Supabase Tables

```sql
-- FBOs table
create table fbos (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  name text not null,
  email text not null,
  airport_iata text not null,
  created_at timestamptz default now()
);

-- Org airline configuration
create table org_airline_configs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  airline_iata text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table fbos enable row level security;
alter table org_airline_configs enable row level security;
```

## Environment Variables

See `.env.example` for all required variables.
