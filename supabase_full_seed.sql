
-- EXTENSIONS
create extension if not exists "uuid-ossp";

-- CLEANUP (CAREFUL: DELETES ALL DATA)
-- We drop tables in reverse order of dependencies
drop table if exists public.vaccination_records; -- if exists
drop table if exists public.vaccination_patients;
drop table if exists public.vaccines;
drop table if exists public.maternity_visits;
drop table if exists public.neonatal_patients;
drop table if exists public.indicator_goals; -- if exists
drop table if exists public.violence_cases;
drop table if exists public.tb_cases;
drop table if exists public.notification_cases;
drop table if exists public.sinan_numbers;
drop table if exists public.discharge_requests;
drop table if exists public.census_movements; -- if exists
drop table if exists public.authorization_requests;
drop table if exists public.ambulance_missions;
drop table if exists public.ambulances;
drop table if exists public.bed_requests;
drop table if exists public.beds;
drop table if exists public.emergency_visits;
drop table if exists public.documents; -- if exists
drop table if exists public.patients;
drop table if exists public.profiles;
drop table if exists public.health_units;

-- 1. HEALTH UNITS
create table public.health_units (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PROFILES (Users)
create table public.profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid, -- Link to Supabase Auth if we integrate it
  name text not null,
  role text not null,
  email text unique,
  status text default 'active',
  department text,
  unit_id uuid references public.health_units(id),
  avatar_url text,
  last_access timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PATIENTS
create table public.patients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  age integer,
  birth_date date,
  gender text,
  cns text,
  mother_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. EMERGENCY VISITS
create table public.emergency_visits (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.patients(id),
  protocol_number text unique not null,
  risk_level text, -- 'red', 'orange', etc.
  status text not null,
  chief_complaint text,
  arrival_time timestamp with time zone default timezone('utc'::text, now()),
  wait_time_minutes integer default 0,
  unit_id uuid references public.health_units(id),
  doctor_id uuid references public.profiles(id),
  location text,
  pending_exams integer default 0,
  completed_exams integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. BEDS
create table public.beds (
  id uuid default uuid_generate_v4() primary key,
  code text not null, -- e.g. '204-A'
  sector text not null,
  type text not null,
  status text default 'disponivel',
  gender text,
  is_isolation boolean default false,
  isolation_type text,
  unit_id uuid references public.health_units(id),
  current_patient_id uuid references public.patients(id),
  equipment text[], -- postgres array
  cleaning_assigned_to text,
  cleaning_start_time timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. BED REQUESTS
create table public.bed_requests (
  id uuid default uuid_generate_v4() primary key,
  patient_name text not null,
  patient_id uuid references public.patients(id),
  priority text,
  required_type text,
  requester_unit_id uuid references public.health_units(id),
  request_time timestamp with time zone default timezone('utc'::text, now()),
  status text default 'aguardando'
);

-- 7. AMBULANCES
create table public.ambulances (
  id uuid default uuid_generate_v4() primary key,
  plate text unique not null,
  type text not null,
  model text,
  status text default 'disponivel',
  location text,
  fuel_level integer default 100,
  last_maintenance date,
  crew text,
  equipment_status text default 'ok',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. MISSIONS
create table public.ambulance_missions (
  id uuid default uuid_generate_v4() primary key,
  ambulance_id uuid references public.ambulances(id),
  type text,
  priority text,
  address text,
  patient_info text,
  status text default 'pendente',
  start_time timestamp with time zone,
  eta_minutes integer
);

-- 9. AUTHORIZATION REQUESTS
create table public.authorization_requests (
  id uuid default uuid_generate_v4() primary key,
  protocol text unique not null,
  patient_name text,
  insurance text,
  insurance_id text,
  procedure_code text,
  procedure_name text,
  cid text,
  doctor_name text,
  request_date timestamp with time zone,
  type text,
  status text,
  documents_count integer default 0,
  denial_reason text
);

-- 10. DISCHARGE REQUESTS
create table public.discharge_requests (
  id uuid default uuid_generate_v4() primary key,
  patient_name text,
  unit_text text,
  date date,
  reason text,
  destination text,
  status text default 'pendente',
  documents_ready boolean default false,
  transport_required boolean default false
);

-- 11. MONITORING MODULES
create table public.sinan_numbers (
  id uuid default uuid_generate_v4() primary key,
  number text unique not null,
  year integer,
  status text default 'disponivel', -- 'disponivel', 'utilizado'
  patient_name text,
  disease text,
  generated_at timestamp with time zone
);

create table public.notification_cases (
  id uuid default uuid_generate_v4() primary key,
  disease text,
  patient_name text,
  notification_date date,
  status text,
  week integer,
  investigation_status text
);

create table public.tb_cases (
  id uuid default uuid_generate_v4() primary key,
  patient_name text,
  phase text,
  treatment_month integer,
  total_months integer,
  last_exam date,
  status text,
  tdo_compliance integer
);

create table public.violence_cases (
  id uuid default uuid_generate_v4() primary key,
  patient_name text,
  age integer,
  gender text,
  type text,
  date date,
  risk_level text,
  status text,
  is_confidential boolean default true
);

-- 12. MATERNITY & NEONATAL
create table public.neonatal_patients (
  id uuid default uuid_generate_v4() primary key,
  name text,
  mother_name text,
  birth_date date,
  weight_grams integer,
  gestational_age text,
  test_pezinho_status text,
  test_orelhinha_status text,
  test_olhinho_status text,
  test_coracaozinho_status text,
  test_linguinha_status text
);

create table public.maternity_visits (
  id uuid default uuid_generate_v4() primary key,
  mother_name text,
  baby_name text,
  room text,
  bed text,
  admission_date date,
  days_post_partum integer,
  type text,
  status text,
  risk_level text,
  team_responsible text
);

-- 13. VACCINES
create table public.vaccines (
  id uuid default uuid_generate_v4() primary key,
  name text,
  dose text,
  target_age text,
  batch text,
  expiration_date date,
  stock_level integer,
  status text
);

create table public.vaccination_patients (
  id uuid default uuid_generate_v4() primary key,
  name text,
  age_text text,
  birth_date date,
  cns text,
  compliance_rate integer
);

-- =====================================
-- ENABLE RLS (SECURITY)
-- =====================================
alter table public.health_units enable row level security;
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.emergency_visits enable row level security;
alter table public.beds enable row level security;
alter table public.bed_requests enable row level security;
alter table public.ambulances enable row level security;
alter table public.ambulance_missions enable row level security;
alter table public.authorization_requests enable row level security;
alter table public.discharge_requests enable row level security;
alter table public.sinan_numbers enable row level security;
alter table public.notification_cases enable row level security;
alter table public.tb_cases enable row level security;
alter table public.violence_cases enable row level security;
alter table public.neonatal_patients enable row level security;
alter table public.maternity_visits enable row level security;
alter table public.vaccines enable row level security;
alter table public.vaccination_patients enable row level security;

-- =====================================
-- RLS POLICIES
-- =====================================

-- 1. PUBLIC READ for Health Units (Critical for Login)
create policy "Public Read Health Units" 
on public.health_units for select to anon using (true);

-- 2. AUTHENTICATED FULL ACCESS (Simplifying for '100% working' demo)
-- This allows any logged-in user to read/write everything. 
-- Iterate on this for production strictness.
create policy "Auth Full Access" on public.health_units for all to authenticated using (true);
create policy "Auth Full Access" on public.profiles for all to authenticated using (true);
create policy "Auth Full Access" on public.patients for all to authenticated using (true);
create policy "Auth Full Access" on public.emergency_visits for all to authenticated using (true);
create policy "Auth Full Access" on public.beds for all to authenticated using (true);
create policy "Auth Full Access" on public.bed_requests for all to authenticated using (true);
create policy "Auth Full Access" on public.ambulances for all to authenticated using (true);
create policy "Auth Full Access" on public.ambulance_missions for all to authenticated using (true);
create policy "Auth Full Access" on public.authorization_requests for all to authenticated using (true);
create policy "Auth Full Access" on public.discharge_requests for all to authenticated using (true);
create policy "Auth Full Access" on public.sinan_numbers for all to authenticated using (true);
create policy "Auth Full Access" on public.notification_cases for all to authenticated using (true);
create policy "Auth Full Access" on public.tb_cases for all to authenticated using (true);
create policy "Auth Full Access" on public.violence_cases for all to authenticated using (true);
create policy "Auth Full Access" on public.neonatal_patients for all to authenticated using (true);
create policy "Auth Full Access" on public.maternity_visits for all to authenticated using (true);
create policy "Auth Full Access" on public.vaccines for all to authenticated using (true);
create policy "Auth Full Access" on public.vaccination_patients for all to authenticated using (true);

-- Also allow Anon Read explicitly for now if the app doesn't auth correctly yet
-- (Uncomment these if you have trouble with RLS blocking)
-- create policy "Anon Read" on public.profiles for select to anon using (true);

-- =====================================
-- SEED DATA
-- =====================================

-- 1. HEALTH UNITS
insert into public.health_units (name, type) values 
('Hospital Municipal Dr. Ernesto Che Guevara', 'Hospital'),
('UPA Inoã', 'UPA'),
('Maternidade Santa Clara', 'Maternidade'),
('UBS Jardim das Flores', 'UBS'),
('Laboratório Central', 'Laboratório');

-- 2. PROFILES
do $$
declare
  unit_hospital uuid;
begin
  select id into unit_hospital from public.health_units where type = 'Hospital' limit 1;

  insert into public.profiles (name, role, email, department, unit_id) values
  ('Dr. Roberto', 'doctor', 'roberto@saudemarica.rj.gov.br', 'Emergência', unit_hospital),
  ('Enf. Juliana', 'nurse', 'juliana@saudemarica.rj.gov.br', 'Triagem', unit_hospital),
  ('Admin Sistema', 'admin', 'admin@saudemarica.rj.gov.br', 'TI', unit_hospital);
end $$;

-- 3. PATIENTS & VISITS
do $$
declare
  p_id uuid;
  u_id uuid;
  d_id uuid;
begin
  select id into u_id from public.health_units where type = 'Hospital' limit 1;
  select id into d_id from public.profiles where role = 'doctor' limit 1;

  -- Patient 1
  insert into public.patients (name, age, gender, cns) 
  values ('Carlos Andrade', 54, 'M', '700123456789001') returning id into p_id;
  
  insert into public.emergency_visits (patient_id, protocol_number, risk_level, status, chief_complaint, location, unit_id, doctor_id, created_at)
  values (p_id, '2405-0012', 'red', 'em_atendimento', 'Dor torácica, sudorese', 'Box 1', u_id, d_id, now() - interval '10 minutes');

  -- Patient 2
  insert into public.patients (name, age, gender) 
  values ('Maria Helena', 72, 'F') returning id into p_id;
  
  insert into public.emergency_visits (patient_id, protocol_number, risk_level, status, chief_complaint, location, unit_id, created_at)
  values (p_id, '2405-0015', 'orange', 'aguardando_medico', 'Dispineia, saturação 88%', 'Sala Amarela', u_id, now() - interval '20 minutes');
  
  -- Patient 3
  insert into public.patients (name, age, gender) 
  values ('João Miguel', 8, 'M') returning id into p_id;
  
  insert into public.emergency_visits (patient_id, protocol_number, risk_level, status, chief_complaint, location, unit_id, created_at)
  values (p_id, '2405-0018', 'yellow', 'exames', 'Febre alta', 'Raio-X', u_id, now() - interval '40 minutes');

end $$;

-- 4. BEDS
do $$
declare
  u_id uuid;
begin
  select id into u_id from public.health_units where type = 'Hospital' limit 1;

  insert into public.beds (code, sector, type, status, unit_id, equipment) values
  ('UTI-01', 'UTI Adulto', 'UTI', 'ocupado', u_id, ARRAY['Ventilador', 'Monitor']),
  ('UTI-02', 'UTI Adulto', 'UTI', 'ocupado', u_id, ARRAY['Ventilador', 'Diálise']),
  ('UTI-03', 'UTI Adulto', 'UTI', 'disponivel', u_id, ARRAY['Monitor']),
  ('UTI-04', 'UTI Adulto', 'UTI', 'higienizacao', u_id, ARRAY['Monitor']),
  ('ENF-101', 'Enfermaria', 'Enfermaria', 'disponivel', u_id, ARRAY['Cama']),
  ('ENF-102', 'Enfermaria', 'Enfermaria', 'ocupado', u_id, ARRAY['Cama']);
end $$;

-- 5. AMBULANCES
insert into public.ambulances (plate, type, model, status, location, fuel_level) values
('BRA-2E19', 'USA', 'Mercedes Sprinter', 'disponivel', 'Base Central', 85),
('RJX-9921', 'USB', 'Renault Master', 'em_atendimento', 'Centro', 45),
('NEO-5566', 'Neonatal', 'Fiat Ducato', 'disponivel', 'Hospital', 92);

-- 6. MISSIONS
do $$
declare
  amb_id uuid;
begin
  select id into amb_id from public.ambulances where plate = 'RJX-9921';
  insert into public.ambulance_missions (ambulance_id, type, priority, address, patient_info, status, start_time)
  values (amb_id, 'Emergência', 'high', 'Rua das Flores, Centro', 'PCR', 'despachada', now());
end $$;

-- 7. VACCINES
do $$
declare
  u_id uuid;
begin
  select id into u_id from public.health_units where type = 'UBS' limit 1;
  insert into public.vaccines (name, dose, target_age, stock_level, status) values
  ('BCG', 'Única', 'Ao nascer', 45, 'Available'),
  ('Hepatite B', 'Única', 'Ao nascer', 120, 'Available'),
  ('Rotavírus', '1ª Dose', '2 meses', 10, 'Low');
end $$;

-- 8. MATERNITY
insert into public.maternity_visits (mother_name, baby_name, room, status, risk_level) values
('Juliana Paes', 'RN de Juliana', '204-A', 'pendente', 'Baixo'),
('Fernanda Lima', 'RN de Fernanda', '205-B', 'realizada', 'Médio');

-- 9. SINAN
insert into public.sinan_numbers (number, year, status, disease) values
('2024000125', 2024, 'utilizado', 'Dengue'),
('2024000126', 2024, 'disponivel', null),
('2024000127', 2024, 'disponivel', null);
