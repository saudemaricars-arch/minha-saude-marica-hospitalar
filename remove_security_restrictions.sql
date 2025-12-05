
-- ==========================================
-- DISABLE ROW LEVEL SECURITY (FULL ACCESS)
-- ==========================================
-- WARNING: This removes all access controls. All users (anon and authenticated) 
-- will have full read/write access to these tables.
-- Run this in the Supabase SQL Editor.

-- 1. Health Units
ALTER TABLE public.health_units DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.health_units;

-- 2. Profiles
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.profiles;

-- 3. Patients
ALTER TABLE public.patients DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.patients;

-- 4. Emergency Visits
ALTER TABLE public.emergency_visits DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.emergency_visits;

-- 5. Beds
ALTER TABLE public.beds DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.beds;

-- 6. Bed Requests
ALTER TABLE public.bed_requests DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.bed_requests;

-- 7. Ambulances
ALTER TABLE public.ambulances DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.ambulances;

-- 8. Ambulance Missions
ALTER TABLE public.ambulance_missions DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.ambulance_missions;

-- 9. Authorization Requests
ALTER TABLE public.authorization_requests DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.authorization_requests;

-- 10. Vaccines
ALTER TABLE public.vaccines DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.vaccines;

-- 11. Optional: Allow public access explicitly (if DISABLE doesn't cover anon role implicitly in some configs, though usually DISABLE means everything goes)
-- But usually DISABLE RLS is enough.

SELECT 'All RLS policies disabled. Full control granted.' as status;
