-- 1. Maternity Visits (Puérperas)
create table if not exists public.maternity_visits (
  id uuid default uuid_generate_v4() primary key,
  room text not null,
  mother_name text not null,
  baby_name text,
  days_post_partum integer,
  type text, -- 'PC' (Parto Cesárea) or 'PN' (Parto Normal)
  risk_level text, -- 'Alto', 'Médio', 'Baixo'
  status text default 'pendente', -- 'pendente', 'realizada'
  alerts text[], -- Array of alerts like ['Sin. Gripais', 'Hipertensão']
  unit_id uuid references public.health_units(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Neonatal Patients (Triagem Neonatal)
create table if not exists public.neonatal_patients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  mother_name text not null,
  birth_date date,
  birth_time text,
  weight integer, -- in grams
  gestational_age text, -- e.g. '39s 2d'
  tests jsonb default '{}'::jsonb, -- Store test statuses and values in JSON
  unit_id uuid references public.health_units(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Disable RLS for easy prototyping
alter table public.maternity_visits enable row level security;
alter table public.maternity_visits disable row level security;

alter table public.neonatal_patients enable row level security;
alter table public.neonatal_patients disable row level security;

-- Grant permissions
grant all on public.maternity_visits to authenticated;
grant all on public.maternity_visits to service_role;

grant all on public.neonatal_patients to authenticated;
grant all on public.neonatal_patients to service_role;
