
-- ==========================================
-- REPAIR DATABASE & REMOVE RESTRICTIONS
-- ==========================================

-- 1. Ensure Extensions
create extension if not exists "uuid-ossp";

-- 2. Create Tables (IF NOT EXISTS) to fix missing structure

-- Health Units
CREATE TABLE IF NOT EXISTS public.health_units (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role text not null,
  email text,
  status text default 'active',
  department text,
  unit_id uuid references public.health_units(id),
  avatar_url text,
  last_access timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Patients (Missing table fixed here)
CREATE TABLE IF NOT EXISTS public.patients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  age integer,
  birth_date date,
  gender text,
  cns text,
  mother_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Emergency Visits
CREATE TABLE IF NOT EXISTS public.emergency_visits (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.patients(id),
  protocol_number text unique not null,
  risk_level text,
  status text not null,
  chief_complaint text,
  arrival_time timestamp with time zone default timezone('utc'::text, now()),
  wait_time_minutes integer default 0,
  unit_id uuid references public.health_units(id),
  doctor_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Beds
CREATE TABLE IF NOT EXISTS public.beds (
  id uuid default uuid_generate_v4() primary key,
  code text not null,
  sector text not null,
  type text not null,
  status text not null default 'disponivel',
  is_isolation boolean default false,
  unit_id uuid references public.health_units(id),
  current_patient_id uuid references public.patients(id),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bed Requests
CREATE TABLE IF NOT EXISTS public.bed_requests (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.patients(id),
  requested_bed_type text not null,
  priority text,
  requester_unit_id uuid references public.health_units(id),
  request_time timestamp with time zone default timezone('utc'::text, now()),
  status text default 'aguardando',
  notes text
);

-- Ambulances
CREATE TABLE IF NOT EXISTS public.ambulances (
  id uuid default uuid_generate_v4() primary key,
  plate text unique not null,
  type text not null,
  status text default 'disponivel',
  location text,
  fuel_level integer default 100,
  crew text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ambulance Missions
CREATE TABLE IF NOT EXISTS public.ambulance_missions (
  id uuid default uuid_generate_v4() primary key,
  ambulance_id uuid references public.ambulances(id),
  type text not null,
  priority text,
  address text,
  patient_info text,
  status text default 'pendente',
  start_time timestamp with time zone default timezone('utc'::text, now())
);

-- Authorization Requests
CREATE TABLE IF NOT EXISTS public.authorization_requests (
  id uuid default uuid_generate_v4() primary key,
  protocol text unique not null,
  patient_name text not null,
  insurance text,
  procedure_name text,
  doctor_name text,
  status text default 'pendente',
  request_date timestamp with time zone default timezone('utc'::text, now())
);

-- Vaccines
CREATE TABLE IF NOT EXISTS public.vaccines (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  batch text,
  dose text,
  expiration_date date,
  stock_level integer default 0,
  unit_id uuid references public.health_units(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. DISABLE RLS (Fix Permissions)

ALTER TABLE public.health_units DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.beds DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bed_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulances DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulance_missions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorization_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccines DISABLE ROW LEVEL SECURITY;

-- 4. INSERT MASTER DATA (Gestor Máximo)

INSERT INTO public.health_units (id, name, type)
VALUES ('00000000-0000-0000-0000-000000000000', 'Gestão Central (Secretaria)', 'Administrativo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (email, name, role, unit_id, status)
VALUES ('00000000000', 'Gestor Máximo', 'master', '00000000-0000-0000-0000-000000000000', 'active')
ON CONFLICT (email) DO UPDATE SET unit_id = EXCLUDED.unit_id;

SELECT 'Database repaired, tables created, permissions removed, Master User added.' as status;
