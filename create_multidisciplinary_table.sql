-- Create Multidisciplinary Appointments Table
create table if not exists public.multidisciplinary_appointments (
  id uuid default uuid_generate_v4() primary key,
  patient_name text not null,
  patient_id text,
  specialty text not null, -- 'Fisioterapia', 'Psicologia', etc.
  professional text not null,
  date date not null,
  time time not null,
  status text default 'scheduled', -- 'scheduled', 'checked-in', 'completed', 'canceled'
  notes text,
  unit_id uuid references public.health_units(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (standard practice, then disable as per project norm)
alter table public.multidisciplinary_appointments enable row level security;

-- Disable RLS immediately to allow full access for now
alter table public.multidisciplinary_appointments disable row level security;

-- Grant permissions just in case
grant all on public.multidisciplinary_appointments to authenticated;
grant all on public.multidisciplinary_appointments to service_role;
