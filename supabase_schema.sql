-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. Health Units (Unidades de Saúde)
create table public.health_units (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type text not null, -- 'Hospital', 'UPA', 'UBS'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Profiles (Users - extending auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role text not null, -- 'admin', 'doctor', 'nurse', 'receptionist'
  email text,
  status text default 'active' check (status in ('active', 'inactive', 'suspended')),
  department text,
  unit_id uuid references public.health_units(id),
  avatar_url text,
  last_access timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Patients (Unified table for basic info)
create table public.patients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  age integer,
  birth_date date,
  gender text check (gender in ('M', 'F', 'O')),
  cns text, -- Cartão Nacional de Saúde
  mother_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Emergency Visits (Prontuário de Emergência)
create table public.emergency_visits (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.patients(id),
  protocol_number text unique not null,
  risk_level text check (risk_level in ('red', 'orange', 'yellow', 'green', 'blue', 'white')),
  status text not null, -- 'triagem', 'aguardando_medico', etc.
  chief_complaint text,
  arrival_time timestamp with time zone default timezone('utc'::text, now()),
  wait_time_minutes integer default 0,
  unit_id uuid references public.health_units(id),
  doctor_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Beds (Gestão de Leitos)
create table public.beds (
  id uuid default uuid_generate_v4() primary key,
  code text not null, -- '204-A'
  sector text not null,
  type text not null, -- 'UTI', 'Enfermaria'
  status text not null default 'disponivel', -- 'disponivel', 'ocupado', 'higienizacao'
  is_isolation boolean default false,
  unit_id uuid references public.health_units(id),
  current_patient_id uuid references public.patients(id),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Bed Requests (Solicitações de Leito / Regulação)
create table public.bed_requests (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.patients(id),
  requested_bed_type text not null,
  priority text check (priority in ('Alta', 'Média', 'Baixa')),
  requester_unit_id uuid references public.health_units(id),
  request_time timestamp with time zone default timezone('utc'::text, now()),
  status text default 'aguardando',
  notes text
);

-- 7. Ambulances (Frota)
create table public.ambulances (
  id uuid default uuid_generate_v4() primary key,
  plate text unique not null,
  type text not null, -- 'USA', 'USB'
  status text default 'disponivel',
  location text, -- Mock coordinates or address
  fuel_level integer default 100,
  crew text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Ambulance Missions (Missões)
create table public.ambulance_missions (
  id uuid default uuid_generate_v4() primary key,
  ambulance_id uuid references public.ambulances(id),
  type text not null, -- 'Emergência', 'Remoção'
  priority text,
  address text,
  patient_info text,
  status text default 'pendente',
  start_time timestamp with time zone default timezone('utc'::text, now())
);

-- 9. Authorization Requests (Autorizações de Convênio/Procedimentos)
create table public.authorization_requests (
  id uuid default uuid_generate_v4() primary key,
  protocol text unique not null,
  patient_name text not null, -- storing name directly if patient not reg yet
  insurance text,
  procedure_name text,
  doctor_name text,
  status text default 'pendente',
  request_date timestamp with time zone default timezone('utc'::text, now())
);

-- 10. Stock/Vaccines (Vacinação)
create table public.vaccines (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  batch text,
  dose text,
  expiration_date date,
  stock_level integer default 0,
  unit_id uuid references public.health_units(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on all tables
alter table public.health_units enable row level security;
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.emergency_visits enable row level security;
alter table public.beds enable row level security;
alter table public.bed_requests enable row level security;
alter table public.ambulances enable row level security;
alter table public.ambulance_missions enable row level security;
alter table public.authorization_requests enable row level security;
alter table public.vaccines enable row level security;

-- Create basic policies (Allow read/write for authenticated users for now - refine later)
create policy "Allow all access for authenticated users" on public.health_units for all to authenticated using (true);
create policy "Allow all access for authenticated users" on public.profiles for all to authenticated using (true);
create policy "Allow all access for authenticated users" on public.patients for all to authenticated using (true);
create policy "Allow all access for authenticated users" on public.emergency_visits for all to authenticated using (true);
create policy "Allow all access for authenticated users" on public.beds for all to authenticated using (true);
create policy "Allow all access for authenticated users" on public.bed_requests for all to authenticated using (true);
create policy "Allow all access for authenticated users" on public.ambulances for all to authenticated using (true);
create policy "Allow all access for authenticated users" on public.ambulance_missions for all to authenticated using (true);
create policy "Allow all access for authenticated users" on public.authorization_requests for all to authenticated using (true);
create policy "Allow all access for authenticated users" on public.vaccines for all to authenticated using (true);

-- Insert some default Health Units
insert into public.health_units (name, type) values 
('Hospital Municipal Dr. Ernesto Che Guevara', 'Hospital'),
('UPA Inoã', 'UPA'),
('UBS Centro', 'UBS');
