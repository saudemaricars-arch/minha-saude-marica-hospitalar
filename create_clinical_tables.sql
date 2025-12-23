-- 1. Vaccination Patients
create table if not exists public.vaccination_patients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  cns text,
  birth_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Vaccination Records (Doses)
create table if not exists public.vaccination_records (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.vaccination_patients(id) on delete cascade,
  vaccine_name text not null,
  dose text not null, -- '1ª Dose', 'Reforço', etc.
  date_applied date,
  date_scheduled date,
  status text not null, -- 'Applied', 'Scheduled', 'Late'
  vaccinator text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Disease Notifications (Agravos)
create table if not exists public.disease_notifications (
  id uuid default uuid_generate_v4() primary key,
  disease text not null, -- 'Dengue', 'Tuberculose', etc.
  patient_name text not null,
  notification_date date default CURRENT_DATE,
  status text default 'suspeito', -- 'suspeito', 'confirmado', 'descartado'
  investigation_status text default 'em_andamento', -- 'em_andamento', 'concluido'
  week integer, -- Epidemiological Week
  unit_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Disable RLS for all new tables (Open access for prototype)
alter table public.vaccination_patients enable row level security;
alter table public.vaccination_patients disable row level security;

alter table public.vaccination_records enable row level security;
alter table public.vaccination_records disable row level security;

alter table public.disease_notifications enable row level security;
alter table public.disease_notifications disable row level security;

-- Grant permissions
grant all on public.vaccination_patients to authenticated;
grant all on public.vaccination_patients to service_role;

grant all on public.vaccination_records to authenticated;
grant all on public.vaccination_records to service_role;

grant all on public.disease_notifications to authenticated;
grant all on public.disease_notifications to service_role;
