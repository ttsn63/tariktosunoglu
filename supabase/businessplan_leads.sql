create table if not exists public.businessplan_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  telefon text,
  vorhaben text not null,
  branche text,
  zweck text,
  startkapital text,
  umsatzziel text,
  mitarbeiter text,
  status text not null default 'neu',
  preis numeric,
  notizen text,
  created_at timestamptz not null default now()
);

alter table public.businessplan_leads enable row level security;

create index if not exists businessplan_leads_created_at_idx
  on public.businessplan_leads (created_at desc);

create index if not exists businessplan_leads_status_idx
  on public.businessplan_leads (status);

-- No public policies are needed for the MVP.
-- Leads are inserted only through the Netlify Function with the service role key.
