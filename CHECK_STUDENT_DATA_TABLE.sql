-- Check your existing student_data table structure
-- Run this in your Supabase SQL Editor to see what columns exist

-- Check what columns exist in student_data table
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'student_data'
ORDER BY ordinal_position;

-- Check how many students are in the table
SELECT COUNT(*) as total_students FROM student_data;

-- See a few sample records to understand the data structure
SELECT * FROM student_data LIMIT 3;

-- Check if there are any unique constraints or primary keys
SELECT 
    tc.constraint_name, 
    tc.constraint_type, 
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'student_data';
