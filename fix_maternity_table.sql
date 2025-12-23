-- Fix Maternity Visits Table
-- Add 'bed' column if it doesn't exist (using generic alter, safe to run if column missing)

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'maternity_visits' AND column_name = 'bed') THEN 
        ALTER TABLE public.maternity_visits ADD COLUMN bed text; 
    END IF;
END $$;
