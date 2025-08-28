-- Add profile_photo_url column to students table
-- This column stores the URL or base64 data of the student's profile photo

-- Check if column exists first
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'students' 
        AND column_name = 'profile_photo_url'
    ) THEN
        -- Add the column
        ALTER TABLE students 
        ADD COLUMN profile_photo_url TEXT;
        
        RAISE NOTICE 'Added profile_photo_url column to students table';
    ELSE
        RAISE NOTICE 'profile_photo_url column already exists in students table';
    END IF;
END $$;

-- Add profile_photo_url column to faculty table as well
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'faculty' 
        AND column_name = 'profile_photo_url'
    ) THEN
        -- Add the column
        ALTER TABLE faculty 
        ADD COLUMN profile_photo_url TEXT;
        
        RAISE NOTICE 'Added profile_photo_url column to faculty table';
    ELSE
        RAISE NOTICE 'profile_photo_url column already exists in faculty table';
    END IF;
END $$;

-- Verify the columns were added
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('students', 'faculty') 
AND column_name = 'profile_photo_url'
ORDER BY table_name;
