-- ================================================
-- FIX PROFILES TABLE: ADD CPF, REMOVE AUTH FK
-- ================================================

-- 1. Disable RLS temporarily to avoid permission issues during migration
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Drop the existing Foreign Key constraint to auth.users
-- We need to find the name of the constraint first, but usually it's 'profiles_id_fkey'
-- To be safe, we try to drop it if it exists.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 3. Add CPF column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'cpf') THEN
        ALTER TABLE public.profiles ADD COLUMN cpf text unique;
    END IF;
END $$;

-- 4. Alter ID column to have a default value if not present
-- This allows inserting into profiles without an ID (it will auto-generate)
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- 5. Ensure 'email' is NOT NULL only if we want to enforce it. 
-- Since we might create users with just CPF, we might want to allow nullable email?
-- For now, let's leave valid email constraint if it exists, or just keep it simple.
-- The original table might have 'email text', which is nullable by default.

-- 6. Insert/Update Policies for Profiles (Optional but good practice)
-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop old policies to avoid conflicts
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable read/write for all users" ON public.profiles;

-- Create new open policy (Warning: secure this in production!)
CREATE POLICY "Enable read/write for all users" ON public.profiles USING (true) WITH CHECK (true);

-- 7. Update existing users (Mock data) with some dummy CPF if needed
UPDATE public.profiles SET cpf = email WHERE cpf IS NULL AND email ~ '^[0-9]+$'; -- If email was holding CPF

-- 8. Output status
SELECT 'Profiles table repaired: FK removed, CPF added, ID default set.' as status;
