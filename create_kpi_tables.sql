-- Enable UUID extension if not exists
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. KPI Metrics (Single Value Cards)
-- ==========================================
create table if not exists public.kpi_metrics (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  value text not null,
  trend text, -- 'up', 'down', 'neutral'
  trend_label text, -- e.g., "+2% vs mês anterior"
  trend_color text, -- 'green', 'red', 'gray'
  bg_color text default 'bg-white',
  icon_name text,
  icon_color text,
  category text not null, -- 'overview', 'clinical', 'quality', 'operational'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 2. KPI Charts (Line/Bar Charts)
-- ==========================================
create table if not exists public.kpi_charts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  chart_type text not null, -- 'bar', 'line'
  data_points numeric[] not null, -- Array of numbers
  labels text[], -- Array of strings (optional, e.g. months)
  color text, -- Chart main color
  category text not null, -- 'overview', 'clinical', 'quality', 'operational'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 3. Strategic Goals
-- ==========================================
create table if not exists public.kpi_goals (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  current_value numeric not null,
  target_value numeric not null,
  unit text not null,
  status text not null, -- 'success', 'warning', 'danger'
  trend text, -- 'up', 'down', 'stable'
  category text default 'general',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 4. Disable RLS for Development
-- ==========================================
alter table public.kpi_metrics disable row level security;
alter table public.kpi_charts disable row level security;
alter table public.kpi_goals disable row level security;

-- ==========================================
-- 5. Seed Initial Data (Matching Hardcoded)
-- ==========================================

-- Clean existing to prevent duplicates if re-run
truncate table public.kpi_metrics;
truncate table public.kpi_charts;
truncate table public.kpi_goals;

-- Seed Metrics (Overview)
insert into public.kpi_metrics (title, value, trend, trend_label, trend_color, icon_name, icon_color, category) values
('Ocupação Geral', '87%', 'up', '+2% vs mês anterior', 'red', 'Activity', 'text-indigo-600', 'overview'),
('Média Perm.', '5.2d', 'down', '-0.4d vs meta', 'green', 'Clock', 'text-blue-600', 'overview'),
('NPS (Sat)', '92', 'up', 'Zona de Excelência', 'green', 'HeartPulse', 'text-pink-600', 'overview'),
('Infecções', '1.2%', 'neutral', 'Dentro da meta (<2%)', 'gray', 'ShieldAlert', 'text-orange-600', 'overview');

-- Seed Metrics (Quality)
insert into public.kpi_metrics (title, value, trend, trend_label, trend_color, icon_name, icon_color, category) values
('NPS Global', '78', 'up', '+5 pts vs mês anterior', 'green', 'Smile', 'text-green-600', 'quality'),
('Taxa de Infecção (CCIH)', '1.8%', 'down', '-0.2% vs mês anterior', 'green', 'ShieldAlert', 'text-red-600', 'quality'),
('Eventos Adversos', '12', 'neutral', 'Notificados este mês', 'gray', 'AlertTriangle', 'text-orange-600', 'quality');

-- Seed Charts (Overview)
insert into public.kpi_charts (title, chart_type, data_points, labels, color, category) values
('Atendimentos Mensais (Urgência vs Ambulatório)', 'bar', '{1200, 1350, 1100, 1400, 1550, 1480}', '{"Jan", "Fev", "Mar", "Abr", "Mai", "Jun"}', 'bg-indigo-500', 'overview'),
('Taxa de Mortalidade Institucional (%)', 'line', '{4.2, 4.0, 3.8, 3.9, 3.5, 3.2}', '{"Jan", "Fev", "Mar", "Abr", "Mai", "Jun"}', '#10B981', 'overview');

-- Seed Charts (Clinical)
insert into public.kpi_charts (title, chart_type, data_points, labels, color, category) values
('Taxa de Ocupação por Especialidade', 'bar', '{95, 80, 65, 88, 70}', '{"Cardio", "Ortopedia", "Geral", "Neuro", "Pediatria"}', 'bg-blue-500', 'clinical');

-- Seed Goals
insert into public.kpi_goals (name, current_value, target_value, unit, status, trend) values
('Taxa de Ocupação Global', 87, 85, '%', 'warning', 'up'),
('Tempo Médio Permanência', 5.2, 5.0, 'dias', 'warning', 'stable'),
('Taxa de Infecção Hospitalar', 1.2, 2.0, '%', 'success', 'down'),
('Tempo Espera Emergência', 45, 30, 'min', 'danger', 'up'),
('Satisfação do Paciente (NPS)', 92, 90, 'pts', 'success', 'up'),
('Giro de Leitos', 4.2, 4.5, '/mês', 'warning', 'up'),
('Cancelamento Cirúrgico', 5, 3, '%', 'danger', 'stable'),
('Adesão Protocolo Sepse', 95, 98, '%', 'warning', 'up');

