
-- ==========================================
-- ADD MASTER USER & UNIT (GESTOR MÁXIMO)
-- ==========================================

-- 1. Insert Master Unit if it doesn't exist
-- We use a fixed UUID or check for name existence to avoid duplicates
INSERT INTO public.health_units (id, name, type)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- Fixed UUID for Master Unit
  'Gestão Central (Secretaria)',
  'Administrativo'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Master User Profile
-- Username (CPF): 00000000000
-- Password is not stored here (Login logic accepts any password for 'master' or checks Supabase Auth if integrated)
-- Based on current Login.tsx, we just need the profile to match.

INSERT INTO public.profiles (email, name, role, unit_id, status)
VALUES (
  '00000000000',      -- Acts as CPF for Login
  'Gestor Máximo',
  'master',
  '00000000-0000-0000-0000-000000000000', -- Must match the Unit ID above
  'active'
)
ON CONFLICT (email) DO UPDATE 
SET unit_id = EXCLUDED.unit_id, role = 'master';

-- Confirmation
SELECT * FROM public.profiles WHERE email = '00000000000';
