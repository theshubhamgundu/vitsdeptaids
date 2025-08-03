-- Add new columns to user_profiles table for student registration
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS hall_ticket VARCHAR(50),
ADD COLUMN IF NOT EXISTS name VARCHAR(255),
ADD COLUMN IF NOT EXISTS year VARCHAR(20);

-- Create unique index on hall_ticket to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_hall_ticket 
ON public.user_profiles(hall_ticket) 
WHERE hall_ticket IS NOT NULL;

-- Update RLS policy to handle new fields
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow public user creation" ON public.user_profiles;
CREATE POLICY "Allow public user creation" ON public.user_profiles
    FOR INSERT WITH CHECK (true);
