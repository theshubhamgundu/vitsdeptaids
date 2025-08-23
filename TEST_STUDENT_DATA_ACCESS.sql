-- Test Access to Your student_data Table
-- Run this to verify the table exists and can be accessed

-- Check if the table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'student_data'
) as table_exists;

-- Check table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'student_data'
ORDER BY ordinal_position;

-- Check row count
SELECT COUNT(*) as total_students FROM student_data;

-- See sample data (first 3 records)
SELECT * FROM student_data LIMIT 3;

-- Test basic queries
SELECT 
    COUNT(*) as total,
    COUNT(DISTINCT year) as unique_years,
    COUNT(DISTINCT branch) as unique_branches
FROM student_data;
