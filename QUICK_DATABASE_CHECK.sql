-- Quick Database Check - Run this first to see what exists
-- Copy and paste this into your Supabase SQL Editor

-- Check what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%student%'
ORDER BY table_name;

-- Check what columns exist in students_list table (if it exists)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'students_list'
ORDER BY ordinal_position;

-- Check what columns exist in students table (if it exists)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'students'
ORDER BY ordinal_position;

-- Check if the tables have any data
SELECT 'students_list' as table_name, COUNT(*) as row_count 
FROM students_list
UNION ALL
SELECT 'students', COUNT(*) FROM students;
