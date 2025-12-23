-- ================================================
-- CREATE CLINICAL TABLES: MATERNITY & VACCINATION
-- ================================================

-- 1. Maternity Visits Table
CREATE TABLE IF NOT EXISTS public.maternity_visits (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    mother_name text NOT NULL,
    baby_name text,
    room text,
    bed text,
    admission_date date DEFAULT now(),
    days_post_partum integer DEFAULT 0,
    type text CHECK (type IN ('Parto Normal', 'Cesariana', 'Aborto', 'Outros')),
    risk_level text CHECK (risk_level IN ('Baixo', 'Médio', 'Alto')),
    status text DEFAULT 'pendente' CHECK (status IN ('pendente', 'realizada', 'alta')),
    alerts text[], -- Array of strings for alerts
    unit_id uuid, -- Optional link to health unit
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Vaccination: Vaccines Stock Table
CREATE TABLE IF NOT EXISTS public.vaccines (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    batch text,
    expiration_date date,
    stock_level integer DEFAULT 0,
    status text GENERATED ALWAYS AS (
        CASE 
            WHEN stock_level = 0 THEN 'Esgotado'
            WHEN stock_level < 50 THEN 'Baixo' -- Threshold example
            WHEN expiration_date < CURRENT_DATE THEN 'Vencido'
            ELSE 'Disponível'
        END
    ) STORED,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Vaccination: Patients Table
CREATE TABLE IF NOT EXISTS public.vaccination_patients (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    cns text UNIQUE,
    birth_date date,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Vaccination: Records Table
CREATE TABLE IF NOT EXISTS public.vaccination_records (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id uuid REFERENCES public.vaccination_patients(id) ON DELETE CASCADE,
    vaccine_name text NOT NULL, -- or reference vaccines(id) if strict
    dose text, -- 1ª Dose, 2ª Dose
    date_applied date,
    date_scheduled date,
    status text CHECK (status IN ('Applied', 'Scheduled', 'Late', 'Pending')),
    vaccinator text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (and policies for simplified access for now)
ALTER TABLE public.maternity_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccination_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccination_records ENABLE ROW LEVEL SECURITY;

-- Simple policies for demo (Authenticated users can do everything)
CREATE POLICY "Enable all for maternity" ON public.maternity_visits USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for vaccines" ON public.vaccines USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for patients" ON public.vaccination_patients USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for vaccination_records" ON public.vaccination_records USING (true) WITH CHECK (true);

SELECT 'Clinical tables created successfully.' as status;
