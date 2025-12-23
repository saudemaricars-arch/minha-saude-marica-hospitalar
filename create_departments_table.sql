-- Create Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    head text,
    unit_id uuid REFERENCES public.health_units(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY "Enable all for departments" ON public.departments USING (true) WITH CHECK (true);

-- Insert some departments for existing units (optional, but requested "conteúdo que faça sentido")
-- We can't easily insert linked data without knowing unit IDs, so we'll rely on the UI to add them or user to add them.
-- But we can try to insert if we select from health_units.

DO $$
DECLARE
    unit_rec RECORD;
BEGIN
    FOR unit_rec IN SELECT id, name FROM public.health_units LOOP
        -- Insert a 'Recepção' for every unit if not exists
        IF NOT EXISTS (SELECT 1 FROM public.departments WHERE unit_id = unit_rec.id AND name = 'Recepção') THEN
            INSERT INTO public.departments (name, head, unit_id) VALUES ('Recepção', NULL, unit_rec.id);
        END IF;

         -- Insert a 'Administração' for every unit if not exists
        IF NOT EXISTS (SELECT 1 FROM public.departments WHERE unit_id = unit_rec.id AND name = 'Administração') THEN
            INSERT INTO public.departments (name, head, unit_id) VALUES ('Administração', NULL, unit_rec.id);
        END IF;
    END LOOP;
END $$;
